export const typographyTokens = {
  fontFamily:
    "'Playfair Display', 'Segoe UI Variable', 'Segoe UI', 'Helvetica Neue', sans-serif",
  h1: {
    fontSize: "clamp(2.1rem, 2.8vw, 2.9rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
  },
  h2: {
    fontSize: "clamp(1.6rem, 1.9vw, 2rem)",
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: 0.5,
  },
  h3: {
    fontSize: "clamp(1.35rem, 1.4vw, 1.6rem)",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: 0.5,
  },
  h4: {
    fontSize: "1.02rem",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: 0.5,
  },
  body1: { fontSize: "1.02rem", lineHeight: 1.6, letterSpacing: 0.5 },
  body2: { fontSize: "0.92rem", lineHeight: 1.5, letterSpacing: 0.5 },
  button: {
    fontSize: "1rem",
    fontWeight: 700,
    textTransform: "none" as const,
    letterSpacing: 0.5,
  },
};
