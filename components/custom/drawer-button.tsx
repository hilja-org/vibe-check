'use client';

import * as React from 'react';

import CompanyCard from '@/components/custom/CompanyCard';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { generateCompaniesWithMatch, getCompanyData } from '@/data/companyData';
import { User } from '@/db/schema';

export function DrawerButton({ user }: { user: User }) {
  const companies = getCompanyData();

  // TODO Get user scores
  const companiesWithMatch = generateCompaniesWithMatch(companies, user);

  const featuredCompanies = companiesWithMatch.slice(0, 2);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex justify-end px-4">
          <Button variant="secondary" className="text-primary font-bold w-32">
            View my matches
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="p-4 bg-primary rounded-lg relative">
            <DrawerTitle className="text-white">
              Based on what you shared
            </DrawerTitle>
            <DrawerDescription className="text-white">
              Here are some companies that seem like a perfect fit for you
            </DrawerDescription>
            <div className="absolute rocket h-20 bottom-14 right-2 overflow-hidden z-10" />
          </DrawerHeader>
          {featuredCompanies.map((company) => (
            <CompanyCard company={company} key={company.businessId} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
