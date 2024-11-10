import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { DEFAULT_MODEL_NAME, models } from '@/ai/models';
import { Chat } from '@/components/custom/chat';
import { getChatById, getMessagesByChatId, getUser } from '@/db/queries';
import { convertToUIMessages } from '@/lib/utils';

export default async function Page() {
  const cookieStore = await cookies();
  const chatIdFromCookie = cookieStore.get('chat-id')?.value ?? '';
  const userId = cookieStore.get('user')?.value ?? '';

  const user = await getUser(userId);

  if (chatIdFromCookie) {
    const chat = await getChatById({ id: chatIdFromCookie });
    const userId = cookieStore.get('user')?.value ?? '';

    if (chat && userId !== chat.userId) {
      return notFound();
    }

    const messagesFromDb = await getMessagesByChatId({ id: chatIdFromCookie });

    return (
      <Chat
        id={chat?.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        user={user}
      />
    );
  }

  return <Chat id="" initialMessages={[]} user={user} />;
}
