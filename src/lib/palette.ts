export const palette = {
  verdeLimon:   { name: "Verde Limón",   light: "#BFE202", dark: "#0C2107" },
  azulFresco:   { name: "Azul Fresco",   light: "#1CD9EB", dark: "#0C1B2B" },
  lilaOrquidea: { name: "Lila Orquídea", light: "#9F82FF", dark: "#260D36" },
  rosadoDulce:  { name: "Rosado Dulce",  light: "#FF5488", dark: "#330E1F" },
  rojoIntenso:  { name: "Rojo Intenso",  light: "#FD293D", dark: "#300203" },
  naranja:      { name: "Naranja",       light: "#F89E0A", dark: "#361C00" },
  amarillo:     { name: "Amarillo",      light: "#FFDD15", dark: "#361C00" },
} as const;

export type PaletteKey = keyof typeof palette;

export const paletteList = Object.values(palette);

/** Official brand accent colors from BrandBookColors in the Flutter app. */
export const BrandBookColors = {
  red:    "#FD293D",
  orange: "#F89E0A",
  pink:   "#FF5488",
  blue:   "#1CD9EB",
  purple: "#9F82FF",
  black:  "#1B1A1A",
} as const;
