import { ReactNode } from 'react';

type ChipVariant = 'positive' | 'negative' | 'active' | 'inactive';

export default function Chip({
  variant,
  children,
}: {
  variant: ChipVariant;
  children: ReactNode;
}) {
  const variantClassName = getVariantClassName(variant);

  return (
    <div
      className={`px-3 py-1 rounded-full border text-sm text-black text-center ${variantClassName}`}
    >
      {children}
    </div>
  );
}

const getVariantClassName = (variant: ChipVariant) => {
  switch (variant) {
    case 'positive':
      return 'border-green-500 bg-green-100';
    case 'negative':
      return 'border-red-500 bg-red-100';
    case 'inactive':
      return 'border-white bg-white';
    case 'active':
      return 'border-primary bg-primary text-white';
  }
};
