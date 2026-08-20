"use client";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Col, Row } from "@/components/Flex";
import OutlinedCard from "@/components/OutlinedCard";
import PageShell from "@/components/PageShell";
import { consumeRoll, MAX_ROLLS, type RollResult } from "@/lib/rolls";

type Dish = {
  id: number;
  name: string;
  price: number;
  restaurantId: string;
  restaurantName: string;
  cuisines: string[];
  distanceInKm: number;
  rating: number | null;
  halal: boolean;
};

type ResultResponse = {
  dish: Dish | null;
  poolSize: number;
};

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ResultResponse>({ dish: null, poolSize: 0 });
  const [roll, setRoll] = useState<RollResult | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const draw = useCallback(() => {
    const rollResult = consumeRoll();
    setRoll(rollResult);

    if (!rollResult.allowed) {
      setLoading(false);
      setResult({ dish: null, poolSize: 0 });
      return;
    }

    setLoading(true);
    fetch("/api/result")
      .then((res) => res.json())
      .then((data: ResultResponse) => setResult(data))
      .catch(() => setResult({ dish: null, poolSize: 0 }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { dish, poolSize } = result;
  const resetPassed = roll !== null && now >= roll.resetAt;
  const rollsRemaining = roll === null || resetPassed ? MAX_ROLLS : roll.remaining;

  return (
    <PageShell>
      <BackHeader
        eyebrow="Decided"
        action={
          <Typography variant="caption" color="text.secondary">
            {rollsRemaining} roll{rollsRemaining === 1 ? "" : "s"} left
          </Typography>
        }
      />

      <OutlinedCard>
        <Col spacing={1.5}>
          {roll && !roll.allowed && !resetPassed ? (
            <>
              <Typography variant="h2">Out of rolls</Typography>
              <Typography variant="body2" color="text.secondary">
                You&apos;ve used all {MAX_ROLLS} picks this hour. Resets in{" "}
                {formatCountdown(roll.resetAt - now)}.
              </Typography>
            </>
          ) : loading ? (
            <Typography variant="body2" color="text.secondary">
              Picking something for you…
            </Typography>
          ) : dish ? (
            <>
              <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1.2 }}>
                {dish.restaurantName}
              </Typography>
              <Typography variant="h2">{dish.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                S${dish.price.toFixed(2)} · {dish.distanceInKm.toFixed(1)}km ·{" "}
                {dish.cuisines[0] ?? "Various"}
              </Typography>
              <Row spacing={1}>
                {dish.halal && <Chip label="Halal" size="small" variant="outlined" />}
                {dish.rating !== null && (
                  <Chip label={`★ ${dish.rating}`} size="small" variant="outlined" />
                )}
              </Row>
              <Divider />
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                Drawn from {poolSize} dish{poolSize === 1 ? "" : "es"} inside your limits.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h2">Nothing fits</Typography>
              <Typography variant="body2" color="text.secondary">
                No dishes match your current limits. Try loosening a filter.
              </Typography>
            </>
          )}
        </Col>
      </OutlinedCard>

      <Col spacing={1.5}>
        <Button
          variant="contained"
          size="large"
          component="a"
          href={
            dish
              ? `https://food.grab.com/sg/en/restaurant/online-delivery/${dish.restaurantId}`
              : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          disabled={!dish}
        >
          Order on Grab →
        </Button>
        <Row spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={draw}
            disabled={rollsRemaining <= 0}
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
    </PageShell>
  );
}
