type IconProps = {
  className?: string;
};

export function MagazineIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={`nav-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      width={18}
      height={18}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h1V2H6zm4 0v20h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-8zm2 4h4v2h-4V6zm0 4h4v2h-4v-2z"
      />
    </svg>
  );
}

export function AppPhoneIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={`nav-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      width={18}
      height={18}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M7 1h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm0 3v16h10V4H7zm5 15a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z"
      />
    </svg>
  );
}
