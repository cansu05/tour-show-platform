import type { SVGProps } from "react";

export function FamilyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h0a5.5 5.5 0 0 1 5.5 5.5V20" />
      <path d="M14.5 14.5A4.5 4.5 0 0 1 21 18.5V20" />
    </svg>
  );
}

export function NatureIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 20c8-2 13-8 14-16-8 1-14 6-16 14" />
      <path d="M5 20c2-5 6-9 11-12" />
      <path d="M9 15H5" />
      <path d="M13 11V7" />
    </svg>
  );
}

export function DailyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function HotelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 20V8" />
      <path d="M21 20V12a4 4 0 0 0-4-4H9v12" />
      <path d="M3 14h18" />
      <path d="M7 14V9" />
      <path d="M7 9h2.5a2.5 2.5 0 0 1 0 5H7" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function AdventureIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 19h18" />
      <path d="M5 19l6-12 4 8 2-4 4 8" />
      <path d="M11 7l2.5 3" />
      <path d="M15 15l2 4" />
    </svg>
  );
}

export function HistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 10h18" />
      <path d="M5 10l7-5 7 5" />
      <path d="M6 10v8" />
      <path d="M10 10v8" />
      <path d="M14 10v8" />
      <path d="M18 10v8" />
      <path d="M4 18h16" />
      <path d="M3 21h18" />
    </svg>
  );
}

export function AllToursIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

export const categoryIcons = {
  all: AllToursIcon,
  family: FamilyIcon,
  nature: NatureIcon,
  daily: DailyIcon,
  hotel: HotelIcon,
  adventure: AdventureIcon,
  history: HistoryIcon,
};
