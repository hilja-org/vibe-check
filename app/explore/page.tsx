import { cookies } from 'next/headers';

import Explore from '@/components/custom/Explore';
import { Company, CompanyWithMatch, getCompanyData } from '@/data/companyData';
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

type UserScores = Record<number, number>;

const generateCompaniesWithMatch = (
  companies: Company[],
  userScores: UserScores | null
): CompanyWithMatch[] => {
  return companies.map((company) => ({
    ...company,
    userMatch: userScores ? calculateUserMatch(company, userScores) : undefined,
  }));
};

const calculateUserMatch = (
  company: Company,
  userScores: UserScores
): number => {
  const totalDifference = company.categories.reduce(
    (prev, curr) => prev + (userScores[curr.categoryId] ?? 0),
    0
  );

  return 100 - (totalDifference / (company.categories.length * 100)) * 100;
};
