'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import BottomNav from '@/components/custom/BottomNav';
import Chip from '@/components/custom/Chip';
import CompanyCard from '@/components/custom/CompayCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompanyWithMatch } from '@/data/companyData';

export default function Explore({
  companies,
  isExistingUser,
  userName,
}: {
  companies: CompanyWithMatch[];
  isExistingUser: boolean;
  userName: string;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<number>(0);

  const filteredCompanies = isExistingUser
    ? companies.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : companies.slice(0, 2);

  return (
    <div className="min-h-screen z-0">
      <div className="bg-gray-800 py-14 px-8 relative">
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
        <ExistingUserHeader
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
      ) : (
        <NewUserHeader />
      )}
      <div className="px-8 pb-4">
        <h2 className="pb-2">
          {isExistingUser ? 'Your top matches' : 'Companies'}
        </h2>
        <p className="pb-4">Create a profile and find your match</p>
        <div className="flex flex-col gap-4">
          {filteredCompanies.map((company) => (
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
  filter,
  setFilter,
}: {
  search: string;
  setSearch: (search: string) => void;
  filter: number | undefined;
  setFilter: (filter: number) => void;
}) {
  const filters = ['Featured', 'Near me', 'Industry', 'Remote work', 'Culture'];

  return (
    <div className="bg-gray-800 pb-6 mb-4">
      <div className="flex flex-col z-20 relative gap-4">
        <div className="px-8">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for companies"
            className="rounded-full"
          />
        </div>
        <div className="flex gap-1 overflow-y-scroll pl-8 pr-2">
          {filters.map((f, i) => (
            <HeaderFilterChip
              key={i}
              label={f}
              active={filter === i}
              onClick={() => setFilter(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeaderFilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const variant = active ? 'active' : 'inactive';

  return (
    <div className="shrink-0 cursor-pointer" onClick={onClick}>
      <Chip variant={variant}>{label}</Chip>
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
