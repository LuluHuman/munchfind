import Paper from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

export default function OutlinedCard({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "primary.main",
        borderRadius: 3,
        p: 2.5,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
