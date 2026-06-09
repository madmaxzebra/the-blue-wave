export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61573224060522';

type FacebookLinkProps = {
  variant?: 'nav' | 'hero' | 'footer';
  showLabel?: boolean;
};

function FacebookIcon() {
  return (
    <svg className="facebook-link__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.026 10.125 11.926v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.251h3.328l-.532 3.49h-2.796v8.437C19.612 23.099 24 18.1 24 12.073z"
      />
    </svg>
  );
}

export function FacebookLink({ variant = 'footer', showLabel = true }: FacebookLinkProps) {
  const label =
    variant === 'nav' ? 'Follow us' : variant === 'hero' ? 'Follow The Blue Wave on Facebook' : 'Facebook';

  return (
    <a
      href={FACEBOOK_URL}
      className={`facebook-link facebook-link--${variant}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="The Blue Wave Magazine on Facebook"
    >
      <span className="facebook-link__badge" aria-hidden="true">
        <FacebookIcon />
      </span>
      {showLabel && <span className="facebook-link__label">{label}</span>}
    </a>
  );
}
