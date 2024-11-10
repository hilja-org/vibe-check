import { z } from 'zod';

import * as data from './data.json';
import { User } from '@/db/schema';

const Source = z.object({
  url: z.string(),
  title: z.string(),
});

const Rating = z.object({
  categoryId: z.number(),
  summary: z.string(),
  score: z.number(),
  sources: z.array(Source),
});

export type Rating = z.infer<typeof Rating>;

export const Company = z.object({
  name: z.string(),
  businessId: z.string(),
  summary: z.string(),
  categories: z.array(Rating),
});

export type Company = z.infer<typeof Company>;

export type CompanyWithMatch = Company & {
  userMatch: number | undefined;
};

const CompanyData = z.object({ companies: z.array(Company) });

export const getCompanyData = () => {
  return CompanyData.parse(data).companies;
};

type RatingCategory = {
  id: number;
  title: string;
  userKey: keyof User;
};

export const ratingCategories: RatingCategory[] = [
  {
    id: 1,
    title: 'Basic needs and security',
    userKey: 'tmt_1',
  },
  {
    id: 2,
    title: 'Recognition and career success',
    userKey: 'tmt_2',
  },
  {
    id: 3,
    title: 'Authenticity and agency',
    userKey: 'tmt_3',
  },
  {
    id: 4,
    title: 'Self-development and competence',
    userKey: 'tmt_4',
  },
  {
    id: 5,
    title: 'Belongingness and contribution within the work community',
    userKey: 'tmt_5',
  },
  {
    id: 6,
    title: 'Broader and everyday good deeds through work',
    userKey: 'tmt_6',
  },
];

export const getCategoryTitle = (categoryId: number): string =>
  ratingCategories.find((c) => c.id === categoryId)?.title ?? '';

export type UserScores = Record<number, number>;

export const generateCompaniesWithMatch = (
  companies: Company[],
  userScores: UserScores | null
): CompanyWithMatch[] => {
  return companies
    .map((company) => ({
      ...company,
      userMatch: userScores
        ? calculateUserMatch(company, userScores)
        : undefined,
    }))
    .sort((a, b) => (b.userMatch ?? 0) - (a.userMatch ?? 0));
};

const calculateUserMatch = (
  company: Company,
  userScores: UserScores
): number => {
  const totalDifference = company.categories.reduce(
    (prev, curr) =>
      (prev + Math.abs(curr.score - (userScores[curr.categoryId] ?? 0))) ^ 2,
    0
  );

  return (
    100 -
    ((totalDifference ^ 2) / (company.categories.length * (100 ^ 2))) * 100
  );
};
