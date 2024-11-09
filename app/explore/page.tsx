import { cookies } from 'next/headers';

import Explore from '@/components/custom/Explore';
import { getCompanyData } from '@/data/companyData';
import { getChatById } from '@/db/queries';

export default async function Page() {
  const companies = getCompanyData();
  const featuredCompanies = companies.slice(0, 2);

  const cookieStore = await cookies();
  const chatId = cookieStore.get('chat-id')?.value;
  const userId = cookieStore.get('user')?.value;

  const chat = !!chatId && !!userId ? await getChatById({ id: chatId }) : null;
  const isExistingUser = !!chat && chat.userId === userId;

  const userName = 'Matti';

  return (
    <Explore
      isExistingUser={isExistingUser}
      userName={userName}
      companies={featuredCompanies}
    />
  );
}
