import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { Col } from "@/components/Flex";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Col
        component="main"
        spacing={3}
        sx={{
          width: "100%",
          maxWidth: 480,
          minHeight: "100dvh",
          px: { xs: 2.5, sm: 3 },
          py: 3,
        }}
      >
        {children}
      </Col>
    </Box>
  );
}
