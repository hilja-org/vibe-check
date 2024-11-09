'use client';

import { MessageCircleMore, Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentType } from 'react';

export default function BottomNav() {
  return (
    <div className="h-[68px]">
      <div className="bg-white fixed h-[68px] bottom-0 inset-x-0 flex gap-2 px-2">
        <BottomNavButton Icon={MessageCircleMore} href="/chat" label="Chat" />
        <BottomNavButton Icon={Search} href="/explore" label="Explore" />
        <BottomNavButton Icon={User} href="/me" label="Me" />
      </div>
    </div>
  );
}

function BottomNavButton({
  Icon,
  label,
  href,
}: {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  const currentPathname = usePathname();
  const isActive = currentPathname === href;
  const textColorClassName = isActive ? 'text-black' : 'text-gray-400';

  return (
    <div className="grow text-black">
      <Link href={href} className="size-full block p-2">
        <div className="h-full flex flex-col text-center items-center justify-between">
          <Icon className="size-7" />
          <span className={`text-xs font-medium ${textColorClassName}`}>
            {label}
          </span>
        </div>
      </Link>
    </div>
  );
}
