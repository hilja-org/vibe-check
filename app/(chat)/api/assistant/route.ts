import { AssistantResponse } from 'ai';
import { cookies } from 'next/headers';
import { default as OpenAI } from 'openai';
import { MessageCreateParams } from 'openai/resources/beta/threads/messages.mjs';

import { saveChat, saveMessages, updateUser } from '@/db/queries';
import { generateUUID, sanitizeResponseMessages } from '@/lib/utils';

import {
  generateTitleFromUserMessage,
  saveChatId,
} from '../../../chat/actions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
    data: {
      attachments: string;
    };
  } = await req.json();

  const cookieStore = await cookies();
  const userId = cookieStore.get('user')?.value ?? '';

  // Create a thread if needed
  const chatId = cookieStore.get('chat-id')?.value;
  const threadId = chatId ?? (await openai.beta.threads.create({})).id;

  if (!chatId) {
    await saveChat({
      id: threadId,
      userId: userId,
      title: input.message ?? '',
    });
    await saveChatId(threadId);
  }

  let createdMessage: any = {};

  if (input.message) {
    const userMessage: MessageCreateParams = {
      role: 'user',
      content: [{ type: 'text', text: input.message }],
    };

    if (input.data?.attachments && typeof userMessage.content !== 'string') {
      userMessage.content.push({
        type: 'image_url',
        image_url: {
          url: input.data.attachments,
        },
      });
    }

    // Add a message to the thread
    createdMessage = await openai.beta.threads.messages.create(
      threadId,
      userMessage
    );

    await saveMessages({
      messages: [
        {
          role: 'user',
          content: input.message,
          id: generateUUID(),
          createdAt: new Date(),
          chatId: threadId,
        },
      ],
    });
  }

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.OPENAI_ASSISTANT_ID ??
          (() => {
            throw new Error('OPENAI_ASSISTANT_ID is not set');
          })(),
      });

      // forward run status would stream message deltas
      let runResult = await forwardStream(runStream);

      // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
      while (
        runResult?.status === 'requires_action' &&
        runResult.required_action?.type === 'submit_tool_outputs'
      ) {
        try {
          const tool_outputs =
            runResult.required_action.submit_tool_outputs.tool_calls.map(
              (toolCall: any) => {
                const parameters = JSON.parse(toolCall.function.arguments);

                switch (toolCall.function.name) {
                  case 'store_tmt_results':
                    console.log(parameters, userId, 'setting user scores');
                    updateUser(userId, parameters);
                    return {
                      tool_call_id: toolCall.id,
                      output: 'Stored TMT results',
                    };

                  default:
                    throw new Error(
                      `Unknown tool call function: ${toolCall.function.name}`
                    );
                }
              }
            );

          runResult = await forwardStream(
            openai.beta.threads.runs.submitToolOutputsStream(
              threadId,
              runResult.id,
              { tool_outputs }
            )
          );
        } catch (error) {
          console.error('Failed to submit tool outputs', error);
          throw error;
        }
      }

      if (runResult?.status === 'completed') {
        try {
          const messages = await openai.beta.threads.messages.list(threadId);
          const lastMessage = messages.data
            .filter((role) => role.role === 'assistant')
            .sort((a, b) => a.created_at - b.created_at)
            .pop();

          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages([lastMessage] as any);

          await saveMessages({
            messages: responseMessagesWithoutIncompleteToolCalls.map(
              (message) => {
                const messageId = generateUUID();

                return {
                  id: messageId,
                  chatId: threadId,
                  role: message.role,
                  content: (message.content[0] as any).text.value,
                  createdAt: new Date(),
                };
              }
            ),
          });
        } catch (error) {
          console.error('Failed to save chat');
        }
      }
    }
  );
}
