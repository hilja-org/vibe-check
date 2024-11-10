'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Rating, ratingCategories } from '@/data/companyData';
import { User } from '@/db/schema';

export function AreaChart({
  companyData,
  companyName,
  user,
}: {
  companyData?: Rating[];
  companyName?: string;
  user: User;
}) {
  console.log({ user });
  const chartConfig = {
    user: {
      label: 'You',
      color: 'hsl(var(--chart-2))',
    },
    ...(companyData && {
      company: {
        label: companyName,
        color: 'hsl(var(--chart-1))',
      },
    }),
  } satisfies ChartConfig;

  const chartData = ratingCategories.map((rating) => {
    const companyRating = companyData?.find(
      (companyRating) => companyRating.categoryId === rating.id
    );

    const userRating = user[rating.userKey];

    return {
      category: rating.title,
      company: companyRating?.score ?? 0,
      user: userRating ?? 0,
    };
  });

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square min-h-[250px]"
    >
      <RadarChart
        data={chartData}
        margin={{
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        }}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarAngleAxis
          dataKey="category"
          tick={({ x, y, textAnchor, value, index, ...props }) => {
            const data = chartData[index];

            return (
              <text
                x={x}
                y={index === 0 ? y - 10 : y}
                textAnchor={textAnchor}
                fontSize={13}
                fontWeight={500}
                {...props}
              >
                <tspan
                  x={x}
                  dy={'1rem'}
                  fontSize={12}
                  className="fill-black max-w-6"
                >
                  {data.category}
                </tspan>
              </text>
            );
          }}
        />

        <PolarGrid />
        {companyData && (
          <Radar
            dataKey="company"
            fill="var(--color-company)"
            fillOpacity={0.6}
          />
        )}
        <Radar dataKey="user" fill="var(--color-user)" />
      </RadarChart>
    </ChartContainer>
  );
}
