import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Share2Icon } from 'lucide-react';

import { AreaChart } from '@/components/custom/AreaChart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUser } from '@/db/queries';
import { ChatHeader } from '@/components/custom/chat-header';
import Link from 'next/link';

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user')?.value ?? '';

  const user = (await getUser(userId))[0];

  if (!user) {
    return notFound();
  }

  return (
    <div
      className="min-h-screen px-4 flex flex-col gap-4 pb-4 text-black"
      style={{
        background: 'linear-gradient(180deg, #212226 30%, transparent 30%)',
      }}
    >
      <ChatHeader showAvatar={false} switchColors={true} />
      <div className="bg-[#212226] grid place-items-center gap-2 text-white">
        <Image
          src={'/images/matti.png'}
          alt={''}
          width={96}
          height={96}
          className="rounded-full"
        />
        <h1 className="text-3xl font-bold">Matti Meikäläinen</h1>
        <p className="text-white text-sm">Senior software developer</p>
        <p className="text-white text-sm">IT sector</p>

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
            Growth Opportunities
          </Button>
          <Button
            variant="secondary"
            className="bg-white hover:bg-gray-100 text-indigo-600 rounded-full px-6 font-medium"
          >
            Hybrid work
          </Button>
        </div>
      </div>

      <Card className="bg-indigo-600 text-white max-w-xl mx-auto rounded-3xl">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-center text-white">
            Your Work Happiness Blueprint
          </h2>

          <p className="text-center text-lg leading-relaxed">
            Here’s what matters most to you for a fulfilling work life. These
            values support your work life
          </p>
        </CardContent>
      </Card>

      <p className="text-lg font-bold">You crave...</p>
      <div className="bg-white rounded-md p-4 flex gap-2 items-center">
        <div className="shrink-0 size-12 rounded-full bg-[#E2FFF7] grid place-items-center">
          90%
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">🛡️ Basic Needs & Security</h3>
          <p className="text-sm">
            <b>Stability</b> is key to your peace of mind and productivity.{' '}
            <b>Financial security</b>, <b>work-life balance</b>, and{' '}
            <b>job stability</b> give you the foundation to grow.
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
            You thrive on <b>feedback from managers and customers</b> alike.
            Recognition reinforces the value of your contributions.
          </p>
        </div>
      </div>

      <p className="text-lg font-bold">What drives you at work?</p>
      <AreaChart user={user} />

      <p className="text-lg font-bold">You work best with leaders who are...</p>

      <div className="flex flex-col">
        <div className="flex flex-row gap-4 items-center rounded-xl bg-white p-2">
          <Image
            src="/images/heart.png"
            alt=""
            height={40}
            width={40}
            className="bg-[#E2FFF7] rounded-full p-2"
          />
          <p>Supportive</p>
        </div>
        <div className="flex flex-row gap-4 items-center rounded-xl bg-white p-2">
          <Image
            src="/images/rocket_small.png"
            alt=""
            height={40}
            width={40}
            className="bg-[#E2FFF7] rounded-full p-2"
          />
          <p>Mentorship-focused</p>
        </div>
        <div className="flex flex-row gap-4 items-center rounded-xl bg-white p-2">
          <Image
            src="/images/hand_up.png"
            alt=""
            height={40}
            width={40}
            className="bg-[#E2FFF7] rounded-full p-2"
          />
          <p>Hands-off</p>
        </div>
      </div>

      <div className="flex flex-row justify-evenly my-4">
        <Link href="/explore">
          <Button
            variant="secondary"
            className="bg-white text-indigo-600 rounded-full px-6 text-lg"
          >
            Find my matches
          </Button>
        </Link>
        <Button
          variant="secondary"
          className="bg-white text-indigo-600 rounded-full px-6 text-lg"
        >
          <Share2Icon />
          Share my profile
        </Button>
      </div>
    </div>
  );
}
