export default function CompanyMatch({ match }: { match: number }) {
  const rounded = Math.round(match);

  return (
    <div className="company-match shrink-0 flex items-center justify-center text-white font-medium">
      <span className="drop-shadow-lg">{rounded} %</span>
    </div>
  );
}
