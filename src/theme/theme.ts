import { createTheme } from "@mui/material/styles";
import { getM3Scheme, m3ToMuiPalette } from "./m3";

export const munchTheme = createTheme({
  palette: m3ToMuiPalette(getM3Scheme("light"), "light"),
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "var(--font-cormorant), Georgia, serif",
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 700 },
    body1: { fontSize: "0.95rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});
