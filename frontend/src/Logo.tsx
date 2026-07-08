import { useState } from 'react';

type LogoSize = 'nav' | 'hero' | 'footer';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

export function Logo({ size = 'nav', className = '' }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  const src =
    size === 'nav' || size === 'footer'
      ? '/bluewavelogo_small.png'
      : '/logo.png';

  if (imgError) {
    return (
      <span className={size === 'hero' ? 'logo-hero-text' : 'logo-text'}>
        The Blue Wave
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="The Blue Wave"
      className={`logo-img logo-img-${size} ${className}`.trim()}
      onError={() => setImgError(true)}
    />
  );
}
