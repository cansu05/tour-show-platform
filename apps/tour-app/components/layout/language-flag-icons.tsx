import type { SVGProps } from "react";

export function TurkeyFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="turkey-rounded">
          <rect width="32" height="32" rx="50" />
        </clipPath>
      </defs>

      <g clipPath="url(#turkey-rounded)">
        <path d="M0 0h32v32H0z" fill="#E30A17" />

        <path
          fill="#fff"
          d="M17.8 16a5.7 5.7 0 1 1-5.7-5.7A5.7 5.7 0 0 1 17.8 16Z"
        />

        <path
          fill="#E30A17"
          d="M19.6 16a4.6 4.6 0 1 1-4.6-4.6 4.6 4.6 0 0 1 4.6 4.6Z"
        />

        <path
          fill="#fff"
          d="m23.1 11.7.9 2.8h2.9l-2.35 1.7.9 2.8-2.35-1.72L20.75 19l.9-2.8-2.35-1.7h2.9l.9-2.8Z"
        />
      </g>
    </svg>
  );
}

export function GermanyFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="germany-rounded">
          <rect width="32" height="32" rx="50" />
        </clipPath>
      </defs>

      <g clipPath="url(#germany-rounded)">
        <path d="M0 0h32v10.67H0z" fill="#000" />
        <path d="M0 10.67h32v10.66H0z" fill="#DD0000" />
        <path d="M0 21.33h32V32H0z" fill="#FFCE00" />
      </g>
    </svg>
  );
}

export function UnitedKingdomFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="uk-rounded">
          <rect width="32" height="32" rx="50" />
        </clipPath>
      </defs>

      <g clipPath="url(#uk-rounded)">
        <path d="M0 0h32v32H0z" fill="#012169" />

        <path d="M0 0l32 32M32 0 0 32" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l32 32M32 0 0 32" stroke="#C8102E" strokeWidth="3" />

        <path d="M16 0v32M0 16h32" stroke="#fff" strokeWidth="10" />
        <path d="M16 0v32M0 16h32" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function RussiaFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="russia-rounded">
          <rect width="32" height="32" rx="50" />
        </clipPath>
      </defs>

      <g clipPath="url(#russia-rounded)">
        <path d="M0 0h32v10.67H0z" fill="#fff" />
        <path d="M0 10.67h32v10.66H0z" fill="#0039A6" />
        <path d="M0 21.33h32V32H0z" fill="#D52B1E" />
      </g>
    </svg>
  );
}

export function FranceFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="france-rounded">
          <rect width="32" height="32" rx="50" />
        </clipPath>
      </defs>

      <g clipPath="url(#france-rounded)">
        <path d="M0 0h10.67v32H0z" fill="#0055A4" />
        <path d="M10.67 0h10.66v32H10.67z" fill="#fff" />
        <path d="M21.33 0H32v32H21.33z" fill="#EF4135" />
      </g>
    </svg>
  );
}

export function SlovakiaFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="slovakia-rounded">
          <rect width="32" height="32" rx="50" />
        </clipPath>
      </defs>

      <g clipPath="url(#slovakia-rounded)">
        <path d="M0 0h32v10.67H0z" fill="#fff" />
        <path d="M0 10.67h32v10.66H0z" fill="#0B4EA2" />
        <path d="M0 21.33h32V32H0z" fill="#EE1C25" />

        <path
          d="M8.5 8.8h8.8v7.2c0 4.6-4.4 6.7-4.4 6.7s-4.4-2.1-4.4-6.7V8.8Z"
          fill="#EE1C25"
          stroke="#fff"
          strokeWidth="1"
        />
        <path d="M12.9 10.8v8.1" stroke="#fff" strokeWidth="1.2" />
        <path d="M10.4 13.1h5" stroke="#fff" strokeWidth="1.2" />
        <path d="M11 15.3h3.8" stroke="#fff" strokeWidth="1.2" />
        <path
          d="M9.8 17.8c1.2-.8 2.2-.5 3.1.2 1-.8 2.1-.9 3.1-.2-.9 1.8-3.1 3.2-3.1 3.2s-2.2-1.4-3.1-3.2Z"
          fill="#0B4EA2"
        />
      </g>
    </svg>
  );
}

export function CzechFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="czech-rounded">
          <rect width="32" height="32" rx="50" />
        </clipPath>
      </defs>

      <g clipPath="url(#czech-rounded)">
        <path d="M0 0h32v16H0z" fill="#fff" />
        <path d="M0 16h32v16H0z" fill="#D7141A" />
        <path d="M0 0l18 16L0 32z" fill="#11457E" />
      </g>
    </svg>
  );
}

export const languageFlagIcons = {
  de: GermanyFlagIcon,
  en: UnitedKingdomFlagIcon,
  tr: TurkeyFlagIcon,
  ru: RussiaFlagIcon,
  fr: FranceFlagIcon,
  sk: SlovakiaFlagIcon,
  cs: CzechFlagIcon,
};
