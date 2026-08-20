"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Row } from "@/components/Flex";
import OutlinedCard from "@/components/OutlinedCard";
import PageShell from "@/components/PageShell";
import SummaryRow from "@/components/SummaryRow";
import { cuisineLabel, DEFAULT_FILTERS, dietaryLabel, readFilters } from "@/lib/filters";

type Mode = "solo" | "group";

function handleCreateSession() { }
function handleJoinSession() { }

export default function Home() {
  const [mode, setMode] = useState<Mode>("solo");

  return (
    <PageShell>
      <Row align="center" justify="space-between">
        <Typography variant="h2">MunchFind</Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          size="small"
          onChange={(_, next) => next && setMode(next)}
          sx={{
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: 3,  
          }}
        >
          <ToggleButton value="solo" sx={{ border: 0, borderRadius: 2.5, px: 2 }}>
            Solo
          </ToggleButton>
          <ToggleButton value="group" sx={{ border: 0, borderRadius: 2.5, px: 2 }}>
            Group
          </ToggleButton>
        </ToggleButtonGroup>
      </Row>

      {mode === "solo" ? <SoloHome /> : <GroupHome />}
    </PageShell>
  );
}

function SoloHome() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [location, setLocation] = useState<string | null>(null);
  const [inRange, setInRange] = useState<number | null>(null);

  useEffect(() => {
    setFilters(readFilters());
  }, []);

  useEffect(() => {
    fetch(`/api/restaurants/count?maxDistance=${filters.distance}`)
      .then((res) => res.json())
      .then((data: { count: number }) => setInRange(data.count))
      .catch(() => setInRange(null));
  }, [filters.distance]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation("Location unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetch(`/api/location?lat=${coords.latitude}&lon=${coords.longitude}`)
          .then((res) => res.json())
          .then((data: { town: string | null; countryCode: string | null }) => {
            setLocation([data.countryCode, data.town].filter(Boolean).join(" · ") || "Location unavailable");
          })
          .catch(() => setLocation("Location unavailable"));
      },
      () => setLocation("Location unavailable"),
    );
  }, []);

  const cuisines = cuisineLabel(filters.cuisines);
  const dietary = dietaryLabel(filters.dietary);

  return (
    <>
      <Row justify="space-between">
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2 }}>
          {location ?? "Locating…"}
        </Typography>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2 }}>
          {inRange === null ? "…" : inRange} in range
        </Typography>
      </Row>

      <Box>
        <Typography variant="h1" component="h1" sx={{ lineHeight: 1.15 }}>
          Stop scrolling.
          <br />
          We pick.
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontStyle: "italic", mt: 1.5 }}
        >
          MunchFind does not hand you a list. Set your limits once, press the
          button, and take the answer. One store, one dish, no negotiation.
        </Typography>
      </Box>

      <Link href="/result" style={{ textDecoration: "none" }}>
        <OutlinedCard
          sx={{
            textAlign: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Typography variant="h2" color="primary.main">
            Decide for me →
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {filters.budget} budget · {cuisines} cuisine · within {filters.distance}km
          </Typography>
        </OutlinedCard>
      </Link>

      <Box sx={{ mt: "auto" }}>
        <Link href="/filters" style={{ textDecoration: "none", color: "inherit" }}>
          <SummaryRow label="Budget" value={filters.budget} />
          <SummaryRow label="Cuisine" value={cuisines} />
          <SummaryRow label="Dietary" value={dietary} />
          <SummaryRow label="Within" value={`${filters.distance}km`} />
        </Link>
      </Box>
    </>
  );
}

function GroupHome() {
  return (
    <Col spacing={2} sx={{ flex: 1, justifyContent: "center", textAlign: "center" }}>
      <Typography variant="h2">Decide together.</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
        Everyone joins a session and gets the same random result — no
        back-and-forth.
      </Typography>
      <Col spacing={1.5} sx={{ mt: 2 }}>
        <Button variant="contained" size="large" onClick={handleCreateSession}>
          Create session
        </Button>
        <Button variant="outlined" size="large" onClick={handleJoinSession}>
          Join session
        </Button>
      </Col>
    </Col>
  );
}
