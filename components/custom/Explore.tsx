'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import BottomNav from '@/components/custom/BottomNav';
import CompanyCard from '@/components/custom/CompanyCard';
import { Button } from '@/components/ui/button';
import { Company } from '@/data/companyData';

export default function Explore({
  companies,
  isExistingUser,
  userName,
}: {
  companies: Company[];
  isExistingUser: boolean;
  userName: string;
}) {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen">
      <div className="bg-gray-800 py-14 px-8 relative z-0">
        <div className="pr-24">
          <h2 className="text-white text-xl">
            {isExistingUser
              ? `Welcome back ${userName}!`
              : `Welcome ${userName}!`}
          </h2>
          <p className="text-white text-xl">
            {isExistingUser
              ? 'Ready to find your perfect fit?'
              : 'Tell us what matters to you!'}
          </p>
        </div>
        <div className="absolute rocket h-56 top-2 right-2 overflow-hidden z-10" />
      </div>
      {isExistingUser ? (
        <ExistingUserHeader search={search} setSearch={setSearch} />
      ) : (
        <NewUserHeader />
      )}
      <div className="px-8 pb-4">
        <h2 className="pb-2">
          {isExistingUser ? 'Your top matches' : 'Companies'}
        </h2>
        <p className="pb-4">Create a profile and find your match</p>
        <div className="flex flex-col gap-4">
          {companies.map((company) => (
            <CompanyCard company={company} key={company.businessId} />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function ExistingUserHeader({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
  return (
    <div className="bg-gray-800 mb-10 px-8">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function NewUserHeader() {
  return (
    <div className="half-bg-gray-800 mb-10 px-8">
      <div className="bg-primary rounded-lg p-4 flex flex-col gap-4">
        <h3 className="text-white font-bold text-base">
          Ready to find your perfect fit?
        </h3>
        <div className="flex gap-4">
          <div className="shrink-0">
            <Image
              src="/images/aura.png"
              alt="Aura"
              width={60}
              height={60}
              className="w-14"
            />
          </div>
          <p className="text-white">
            Create your profile to unlock matches with companies that share your
            values and support your well-being.
          </p>
        </div>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/chat">Create your profile</Link>
        </Button>
      </div>
    </div>
  );
}
