import { getCompanyData } from '@/data/companyData';

export default async function Page({
  params: { businessId },
}: {
  params: { businessId: string };
}) {
  const companies = getCompanyData();
  const company = companies.find(
    (company) => company.businessId === businessId
  );

  return (
    <div className="min-h-screen">
      <div className="bg-[#212226] grid place-items-center">
        Company logo <h1>{company?.name}</h1>
      </div>
    </div>
  );
}
