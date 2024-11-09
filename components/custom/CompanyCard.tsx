import Link from 'next/link';

import Chip from '@/components/custom/Chip';
import CompanyMatch from '@/components/custom/CompanyMatch';
import { CompanyWithMatch } from '@/data/companyData';

export default function CompanyCard({
  company,
}: {
  company: CompanyWithMatch;
}) {
  const traits = getRandomTraits(company.name);

  const userMatch = company.userMatch;
  const hasUserMatch = !!userMatch;

  // TODO If we ever get logos get rid of this
  const showLogo = false;

  return (
    <Link
      className="bg-white rounded-md p-4 flex gap-2"
      href={`/explore/${company.businessId}`}
    >
      {!hasUserMatch && <CompanyLogo />}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold flex gap-2">
          {hasUserMatch && <CompanyLogo />}
          {company.name}
        </h3>
        <p className="text-sm">{company.summary}</p>
        <div className="flex gap-2 flex-wrap">
          {traits.positive.map((trait) => (
            <Chip key={trait} variant="positive">
              {trait}
            </Chip>
          ))}
          {traits.negative.map((trait) => (
            <Chip key={trait} variant="negative">
              {trait}
            </Chip>
          ))}
        </div>
      </div>
      {hasUserMatch && <CompanyMatch match={userMatch} />}
    </Link>
  );
}

const CompanyLogo = () => {
  return null;
  // TODO Do something if we get logos
  // return <div className="shrink-0">Logo here</div>;
};

const positiveTraits = [
  'Work-life balance',
  'Career growth',
  'Remote work',
  'DEI Focus',
];

const negativeTraits = ['Recognition', 'Flexibility'];

const getRandomTraits = (
  entity: string
): { positive: string[]; negative: string[] } => {
  const positiveCount = entity.length % 3; // Results in 0, 1, or 2
  const negativeCount = entity.length % 2 === 0 ? 0 : 1; // Results in 0 or 1 based on even/odd length

  // Select traits based on calculated counts
  const selectedPositiveTraits = positiveTraits.slice(0, positiveCount);
  const selectedNegativeTraits = negativeTraits.slice(0, negativeCount);

  return { positive: selectedPositiveTraits, negative: selectedNegativeTraits };
};
