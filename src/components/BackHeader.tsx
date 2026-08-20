"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Col, Row } from "@/components/Flex";

export default function BackHeader({
  title,
  eyebrow,
  action,
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  const router = useRouter();

  return (
    <Col spacing={1}>
      <Row align="center" justify="space-between">
        <Button
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon fontSize="small" />}
          color="inherit"
          sx={{ pl: 0, color: "text.secondary" }}
        >
          Back
        </Button>
        {action}
      </Row>
      {eyebrow && (
        <Typography
          variant="overline"
          color="primary.main"
          sx={{ letterSpacing: 1.5, lineHeight: 1 }}
        >
          {eyebrow}
        </Typography>
      )}
      {title && <Typography variant="h1">{title}</Typography>}
    </Col>
  );
}
