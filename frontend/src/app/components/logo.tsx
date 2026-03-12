export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#10B981"/>
        <path d="M12 6L16 10L12 18L8 10L12 6Z" fill="white"/>
      </svg>
      <span className="font-semibold text-xl">SafeSpace</span>
    </div>
  );
}
