import { cookies } from 'next/headers';

import Explore from '@/components/custom/Explore';
import { generateCompaniesWithMatch, getCompanyData } from '@/data/companyData';
import { getChatById } from '@/db/queries';

export default async function Page() {
  const companies = getCompanyData();

  const cookieStore = await cookies();
  const chatId = cookieStore.get('chat-id')?.value;
  const userId = cookieStore.get('user')?.value;

  const chat = !!chatId && !!userId ? await getChatById({ id: chatId }) : null;
  const isExistingUser = !!chat && chat.userId === userId;

  const userName = 'Matti';

  // TODO Get user scores
  const companiesWithMatch = generateCompaniesWithMatch(companies, {
    1: 90,
    2: 85,
    3: 80,
    4: 85,
    5: 90,
    6: 80,
  });

  return (
    <Explore
      isExistingUser={isExistingUser}
      userName={userName}
      companies={companiesWithMatch}
    />
  );
}
