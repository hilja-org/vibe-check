export default function CompanyMatch({
  match,
  className,
}: {
  match: number;
  className?: string;
}) {
  const rounded = Math.round(match);

  return (
    <div
      className={`company-match shrink-0 flex items-center justify-center text-white font-medium size-14 ${className ?? ''}`}
    >
      <span className="drop-shadow-lg">{rounded} %</span>
    </div>
  );
}
