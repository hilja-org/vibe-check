import { cookies } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { AreaChart } from '@/components/custom/AreaChart';
import { ChatHeader } from '@/components/custom/chat-header';
import CompanyMatch from '@/components/custom/CompanyMatch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCompanyData } from '@/data/companyData';
import { getUser } from '@/db/queries';

export default async function Page({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const businessId = (await params).businessId;
  const companies = getCompanyData();
  const company = companies.find(
    (company) => company.businessId === businessId
  );

  const cookieStore = await cookies();
  const userId = cookieStore.get('user')?.value ?? '';

  const user = (await getUser(userId))[0];

  if (!company) {
    return notFound();
  }

  return (
    <div
      className="min-h-screen p-4 flex flex-col gap-4 text-black"
      style={{
        background: 'linear-gradient(180deg, #212226 30%, transparent 30%)',
      }}
    >
      <ChatHeader showAvatar={false} switchColors={true} />
      <div className="bg-[#212226] grid place-items-center gap-2 text-white">
        <Image
          src={`https://avatar.vercel.sh/${userId}`}
          alt={''}
          width={48}
          height={48}
          className="rounded-full"
        />
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <CompanyMatch match={90} />
        match rate
      </div>

      <Card className="bg-indigo-600 text-white max-w-xl mx-auto rounded-3xl">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-center text-white">
            Why is this a good fit?
          </h2>

          <p className="text-center text-lg leading-relaxed">
            TechCorp Solutions strongly aligns with your{' '}
            <span className="font-semibold">
              focus on well-being and flexibility
            </span>
            . With{' '}
            <span className="font-semibold">
              dedicated mental health resources
            </span>{' '}
            and{' '}
            <span className="font-semibold">emphasis on work-life balance</span>
            , this company culture matches your priorities.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-indigo-600 rounded-full px-6 font-medium"
            >
              Flexible hours
            </Button>
            <Button
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-indigo-600 rounded-full px-6 font-medium"
            >
              D&I Focus
            </Button>
            <Button
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-indigo-600 rounded-full px-6 font-medium"
            >
              Hybrid work
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-row justify-evenly my-4">
        <Button
          variant="secondary"
          className="bg-white text-indigo-600 rounded-full px-6 text-lg"
        >
          Contact company
        </Button>
        <Button
          variant="secondary"
          className="bg-white text-indigo-600 rounded-full px-6 text-lg"
        >
          Similar companies
        </Button>
      </div>

      <p className="text-lg font-bold">Your drivers match pretty well</p>
      <AreaChart
        companyData={company.categories}
        companyName={company.name}
        user={user}
      />
      <p className="italic text-center text-[#5D5FEF]">
        {
          '"The most supportive work environment I`ve experienced. Management truly cares about work-life balance."'
        }
      </p>
      <p className="text-lg font-bold">You especially match on...</p>
      <div className="bg-white rounded-md p-4 flex gap-2 items-center">
        <div className="shrink-0 size-12 rounded-full bg-[#E2FFF7] grid place-items-center">
          90%
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">🛡️ Basic Needs & Security</h3>
          <p className="text-sm">
            This company offers <b>competitive financial security</b> and{' '}
            <b>stable work policies</b> that align with your desire for job
            stability and work-life balance.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-md p-4 flex gap-2 items-center">
        <div className="shrink-0 size-12  rounded-full bg-[#E2FFF7] grid place-items-center">
          85%
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">
            ⭐️ Recognition & Career Success
          </h3>
          <p className="text-sm">
            Employees report <b>good internal recognition</b>, with{' '}
            <b>opportunities to showcase impact</b>, though customer visibility
            could improve. They score 15% higher than the industry average in
            employee recognition.
          </p>
        </div>
      </div>
      <p className="italic text-center text-[#5D5FEF]">
        {'“Flexible work hours make a huge difference.”'}
      </p>
    </div>
  );
}
