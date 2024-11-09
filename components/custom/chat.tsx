'use client';

import { Attachment, Message } from 'ai';
import { useAssistant } from 'ai/react';
import { AnimatePresence } from 'framer-motion';
import { Fragment, useRef, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { ChatHeader } from '@/components/custom/chat-header';
import { PreviewMessage, ThinkingMessage } from '@/components/custom/message';
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';

import { Block, UIBlock } from './block';
import { DrawerButton } from './drawer-button';
import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
}) {
  const {
    messages,
    setMessages,
    submitMessage,
    input,
    threadId,
    setInput,
    append,
    status,
    stop,
  } = useAssistant({
    api: '/api/assistant',
    threadId: id,
  });

  const allMessages = [...initialMessages, ...messages];

  if (allMessages.length === 0) {
    append({ role: 'user', content: '' });
    console.log('submit');
  }

  const { width: windowWidth = 1920, height: windowHeight = 1080 } =
    useWindowSize();

  const [block, setBlock] = useState<UIBlock>({
    documentId: 'init',
    content: '',
    title: '',
    status: 'idle',
    isVisible: false,
    boundingBox: {
      top: windowHeight / 4,
      left: windowWidth / 4,
      width: 250,
      height: 50,
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh ">
        <ChatHeader showAvatar={Boolean(allMessages.length)} />
        <div
          ref={messagesContainerRef}
          className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        >
          {allMessages.length === 0 && (
            <Overview
              setInput={setInput}
              textareaRef={textareaRef}
              fileInputRef={fileInputRef}
            />
          )}

          {allMessages.map((message, index) => (
            <Fragment key={message.id + '-container'}>
              <PreviewMessage
                key={message.id}
                chatId={threadId ?? id}
                message={message}
                block={block}
                setBlock={setBlock}
                isLoading={
                  status === 'in_progress' && allMessages.length - 1 === index
                }
              />
              {index % 5 === 4 ? (
                <DrawerButton key={message.id + '-drawer'} />
              ) : null}
            </Fragment>
          ))}

          {status === 'in_progress' &&
            allMessages.length > 0 &&
            allMessages[allMessages.length - 1].role === 'user' && (
              <ThinkingMessage />
            )}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        <form className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={threadId ?? id}
            input={input}
            setInput={setInput}
            handleSubmit={submitMessage}
            isLoading={status === 'in_progress'}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
            textareaRef={textareaRef}
            fileInputRef={fileInputRef}
          />
        </form>
      </div>

      <AnimatePresence>
        {block && block.isVisible && (
          <Block
            chatId={threadId ?? id}
            input={input}
            setInput={setInput}
            handleSubmit={submitMessage}
            isLoading={status === 'in_progress'}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            append={append}
            block={block}
            setBlock={setBlock}
            messages={messages}
            setMessages={setMessages}
            textareaRef={textareaRef}
            fileInputRef={fileInputRef}
          />
        )}
      </AnimatePresence>

      {/* <BlockStreamHandler streamingData={streamingData} setBlock={setBlock} /> */}
    </>
  );
}
