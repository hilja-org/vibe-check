import Link from 'next/link';

import Chip from '@/components/custom/Chip';
import {
  Company,
  CompanyWithMatch,
  getCategoryTitle,
} from '@/data/companyData';

export default function CompanyCard({
  company,
}: {
  company: CompanyWithMatch;
}) {
  return (
    <Link
      className="bg-white rounded-md p-4 flex gap-2"
      href={`/explore/${company.businessId}`}
    >
      <div className="shrink-0">Logo here</div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{company.name}</h3>
        <p className="text-sm">{company.summary}</p>
        <div className="flex gap-2">
          <Chip variant="positive">Positive trait</Chip>
          <Chip variant="negative">Negative trait</Chip>
        </div>
      </div>
    </Link>
  );
}
