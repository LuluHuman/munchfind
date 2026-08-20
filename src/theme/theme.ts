import { createTheme } from "@mui/material/styles";

export const munchTheme = createTheme({
  palette: {
    primary: { main: "#B68235" },
    secondary: { main: "#A18E76" },
    background: { default: "#FEF7FF", paper: "#FFFFFF" },
    text: { primary: "#2B2119", secondary: "#8A7A67" },
    divider: "#E4D9C8",
  },
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
