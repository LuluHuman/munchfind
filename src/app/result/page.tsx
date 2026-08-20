"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Col, Row } from "@/components/Flex";
import OutlinedCard from "@/components/OutlinedCard";
import PageShell from "@/components/PageShell";

function handleDecideAgain() {}

export default function ResultPage() {
  const router = useRouter();
  const [locked, setLocked] = useState(false);

  return (
    <PageShell>
      <BackHeader
        eyebrow="Decided"
        action={
          <Typography variant="caption" color="text.secondary">
            0.8s
          </Typography>
        }
      />

      <OutlinedCard>
        <Col spacing={1.5}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ letterSpacing: 1.2 }}
          >
            Tampines Mall
          </Typography>
          <Typography variant="h2">Beef rendang set</Typography>
          <Typography variant="body2" color="text.secondary">
            S$9.50 · 3.1km · Malay
          </Typography>
          <Row spacing={1}>
            <Chip label="Halal" size="small" variant="outlined" />
            <Chip label="No Pork" size="small" variant="outlined" />
          </Row>
          <Divider />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Drawn from 16 dishes inside your limits.
          </Typography>
        </Col>
      </OutlinedCard>

      {locked ? (
        <>
          <Row
            align="center"
            spacing={1}
            sx={{
              bgcolor: (theme) => theme.palette.m3.primaryContainer,
              color: (theme) => theme.palette.m3.onPrimaryContainer,
              border: 1,
              borderColor: "primary.main",
              borderRadius: 3,
              p: 2,
            }}
          >
            <CheckCircleIcon color="primary" fontSize="small" />
            <Col>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Locked in
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Confirmed at 1:30pm · Show at counter
              </Typography>
            </Col>
          </Row>
          <Button variant="outlined" color="inherit" onClick={() => router.push("/")}>
            Start over
          </Button>
        </>
      ) : (
        <Col spacing={1.5}>
          <Button variant="contained" size="large" onClick={() => setLocked(true)}>
            Lock it in
          </Button>
          <Row spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={handleDecideAgain}
            >
              Decide again
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={() => router.push("/filters")}
            >
              Adjust filters
            </Button>
          </Row>
        </Col>
      )}
    </PageShell>
  );
}
