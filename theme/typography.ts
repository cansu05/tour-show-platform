export const typographyTokens = {
  fontFamily: "'Avenir Next', 'Segoe UI Variable', 'Segoe UI', 'Helvetica Neue', sans-serif",
  h1: {fontSize: 'clamp(2.1rem, 2.8vw, 2.9rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.01em'},
  h2: {fontSize: 'clamp(1.6rem, 1.9vw, 2rem)', fontWeight: 750, lineHeight: 1.2, letterSpacing: '-0.01em'},
  h3: {fontSize: 'clamp(1.35rem, 1.4vw, 1.6rem)', fontWeight: 700, lineHeight: 1.25},
  h4: {fontSize: '1.02rem', fontWeight: 700, lineHeight: 1.3},
  body1: {fontSize: '1.02rem', lineHeight: 1.6},
  body2: {fontSize: '0.92rem', lineHeight: 1.5},
  button: {fontSize: '1rem', fontWeight: 700, textTransform: 'none' as const, letterSpacing: '0.01em'}
};
