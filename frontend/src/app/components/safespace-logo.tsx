import { Link } from "react-router-dom";

type SafeSpaceLogoProps = {
  to?: string;
  compact?: boolean;
  className?: string;
};

export function SafeSpaceLogo({
  to = "/",
  compact = false,
  className = "",
}: SafeSpaceLogoProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-11 w-11 items-center justify-center bg-[#C4DFE6] shadow-[inset_0_0_0_1px_rgba(196,223,230,0.35)] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
        <svg
          viewBox="0 0 48 48"
          className="h-8 w-8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M24 5.5L38 10.8V22.8C38 31.5 32.1 39.2 24 42.8C15.9 39.2 10 31.5 10 22.8V10.8L24 5.5Z"
            fill="#003B46"
          />
          <path
            d="M17 18.8C17 16.7 18.7 15 20.8 15H27.2C29.3 15 31 16.7 31 18.8V22.7C31 24.8 29.3 26.5 27.2 26.5H23.1L18.4 30.2V26.3C17.5 25.6 17 24.5 17 23.3V18.8Z"
            fill="#66A5AD"
          />
          <path
            d="M20.5 20.4H27.5M20.5 23.1H25.2"
            stroke="#C4DFE6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!compact && (
        <span className="text-xl font-black tracking-[-0.045em] text-white">
          SafeSpace
        </span>
      )}
    </div>
  );

  return (
    <Link to={to} aria-label="SafeSpace home">
      {content}
    </Link>
  );
}