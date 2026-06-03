const BRAND_DESCRIPTOR = "Private Villa & Condo Stewardship";

export function BrandMark({
  className = "",
  showDescriptor = false,
  light = false,
}: {
  className?: string;
  showDescriptor?: boolean;
  light?: boolean;
}) {
  return (
    <div className={className}>
      <span
        className={`font-display block text-xl font-light tracking-[0.48em] uppercase md:text-2xl ${
          light ? "text-coconut" : "text-espresso"
        }`}
      >
        ARAYA
      </span>
      {showDescriptor && (
        <span
          className={`mt-2 block text-[9px] font-light tracking-[0.28em] uppercase md:text-[10px] ${
            light ? "text-coconut/70" : "text-espresso-muted"
          }`}
        >
          {BRAND_DESCRIPTOR}
        </span>
      )}
    </div>
  );
}
