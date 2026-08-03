// Minimal inline SVG icons (Lucide-style). 20px stroke icons unless noted.
type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (size = 20, color = "currentColor", strokeWidth = 1.75) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconLogo = ({ size = 28 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#6a56f0" />
    <path d="M9 22V10l7 8 7-8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconHome = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M3 10.5 12 3l9 7.5V21H3z" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export const IconFolder = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

export const IconChart = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M3 3v18h18" />
    <path d="M7 14l4-4 3 3 5-6" />
  </svg>
);

export const IconLayers = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="m12 2 10 5-10 5L2 7z" />
    <path d="m2 12 10 5 10-5" />
    <path d="m2 17 10 5 10-5" />
  </svg>
);

export const IconUsers = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconSettings = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const IconShare = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.59 13.51 6.83 3.98" />
    <path d="m15.41 6.51-6.82 3.98" />
  </svg>
);

export const IconBookmark = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const IconBookText = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8" />
    <path d="M8 11h8" />
  </svg>
);

export const IconGraduation = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M22 10v6" />
    <path d="M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export const IconMessageWarning = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

export const IconBell = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const IconGrip = (p: IconProps) => (
  <svg {...base(p.size ?? 14, p.color, p.strokeWidth)}>
    <circle cx="9" cy="6" r="1" />
    <circle cx="15" cy="6" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="18" r="1" />
    <circle cx="15" cy="18" r="1" />
  </svg>
);

export const IconMoreVertical = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export const IconResize = (p: IconProps) => (
  <svg {...base(p.size ?? 12, p.color, p.strokeWidth)}>
    <path d="M22 22 2 22" opacity="0" />
    <path d="M22 12 12 22" />
    <path d="M22 18 18 22" />
  </svg>
);

export const IconGrid = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const IconUpload = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const IconFolderPlus = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

export const IconTrash = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const IconX = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const IconChevronLeft = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IconSparkle = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
  </svg>
);

export const IconType = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

export const IconShapes = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1z" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <circle cx="17.5" cy="17.5" r="3.5" />
  </svg>
);

export const IconImage = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const IconHash = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

export const IconCode = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const IconHistory = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

export const IconLayout = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

export const IconBenchmark = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
    <path d="M12 8v4l3 3" />
    <path d="M3.05 11H5" />
    <path d="M19 11h1.95" />
  </svg>
);

export const IconFileSearch = (p: IconProps) => (
  <svg {...base(p.size, p.color, p.strokeWidth)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="11.5" cy="14.5" r="2.5" />
    <path d="M13.25 16.25 15 18" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconRefresh = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export const IconDownload = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const IconEye = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconTag = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p.size ?? 16, p.color, p.strokeWidth)}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
