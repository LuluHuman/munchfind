import type { PaletteColor, PaletteColorOptions, PaletteOptions } from "@mui/material/styles";
import materialTheme from "./material-theme.json";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: PaletteColor;
    m3: M3Scheme;
  }
  interface PaletteOptions {
    tertiary?: PaletteColorOptions;
    m3?: M3Scheme;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}

export interface M3Scheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
}

export type M3SchemeName = keyof typeof materialTheme.schemes;

export function getM3Scheme(name: M3SchemeName = "light"): M3Scheme {
  return materialTheme.schemes[name] as M3Scheme;
}

export function m3ToMuiPalette(
  scheme: M3Scheme,
  mode: "light" | "dark" = "light",
): PaletteOptions {
  return {
    mode,
    primary: { main: scheme.primary, contrastText: scheme.onPrimary },
    secondary: { main: scheme.secondary, contrastText: scheme.onSecondary },
    tertiary: { main: scheme.tertiary, contrastText: scheme.onTertiary },
    error: { main: scheme.error, contrastText: scheme.onError },
    background: { default: scheme.background, paper: scheme.surface },
    text: { primary: scheme.onSurface, secondary: scheme.onSurfaceVariant },
    divider: scheme.outlineVariant,
    m3: scheme,
  };
}
