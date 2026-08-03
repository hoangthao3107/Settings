// Design tokens extracted from Figma.
export const color = {
  // Neutral
  white: "#ffffff",
  n01: "#343839", // text primary (headings)
  n02: "#525965", // tertiary (body)
  n03: "#6a758a", // quaternary (muted labels)
  n05: "#d0d5dd", // border contrast
  n06: "#e7ebee", // border primary
  n08: "#f9fafb", // bg utility

  // Brand
  purple: "#6a56f0",
  purpleTint: "#eae7fe",

  // Semantic
  green: "#12b76a",
  greenText: "#027a48",
  greenBg: "#ecfdf3",
  red: "#f04438",

  // Chart palette (matches design — orange-forward, with red/amber variations)
  orange: "#ED7D2D",        // primary series
  orangeLight: "#F9B27A",   // secondary series
  orangeSoft: "#FEE4CA",    // tertiary / tint
  trendLine: "#E23E3E",     // secondary trendline (red-orange)
};

export const font = {
  family: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  // Figma text styles
  displayXsSemibold: { fontSize: 24, lineHeight: "32px", fontWeight: 600 },
  textLgSemibold:    { fontSize: 18, lineHeight: "28px", fontWeight: 600 },
  textMdSemibold:    { fontSize: 16, lineHeight: "24px", fontWeight: 600 },
  textMdMedium:      { fontSize: 16, lineHeight: "24px", fontWeight: 500 },
  textSmMedium:      { fontSize: 14, lineHeight: "20px", fontWeight: 500 },
  textSmRegular:     { fontSize: 14, lineHeight: "20px", fontWeight: 400 },
  textXsRegular:     { fontSize: 12, lineHeight: "16px", fontWeight: 400 },
} as const;

export const space = { s1: 4, s2: 8, s3: 12, s4: 16, s6: 24, s8: 32 };
export const radius = { sm: 8, md: 12, lg: 16 };
