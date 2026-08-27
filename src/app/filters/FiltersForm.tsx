"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Col } from "@/components/Flex";
import PageShell from "@/components/PageShell";
import SectionLabel from "@/components/SectionLabel";
import SelectableChipGroup from "@/components/SelectableChipGroup";
import type { Coords } from "@/lib/coords";
import { DEFAULT_FILTERS, readFilters, writeFilters } from "@/lib/filters";
import { BUDGET_OPTIONS, CUISINE_OPTIONS, DIETARY_OPTIONS } from "@/lib/options";

export default function FiltersForm({
  coords,
}: {
  coords: Coords | null;
}) {
  const router = useRouter();
  const [budget, setBudget] = useState<string>(DEFAULT_FILTERS.budget);
  const [cuisines, setCuisines] = useState<string[]>(DEFAULT_FILTERS.cuisines);
  const [dietary, setDietary] = useState<string>(DEFAULT_FILTERS.dietary);
  const [distance, setDistance] = useState(1);
  const [dishCount, setDishCount] = useState<number | null>(null);

  useEffect(() => {
    const saved = readFilters();
    setBudget(saved.budget);
    setCuisines(saved.cuisines);
    setDietary(saved.dietary);
    setDistance(Math.min(Math.max(saved.distance, 2.4), 10));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ budget, dietary, distance: String(distance) });
    cuisines.forEach((cuisine) => params.append("cuisine", cuisine));
    if (coords) {
      params.set("lat", String(coords.lat));
      params.set("lng", String(coords.lng));
    }

    let cancelled = false;
    fetch(`/api/dishes/count?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { count: number }) => {
        if (!cancelled) setDishCount(data.count);
      })
      .catch(() => {
        if (!cancelled) setDishCount(null);
      });

    return () => {
      cancelled = true;
    };
  }, [budget, cuisines, dietary, distance, coords]);

  return (
    <PageShell>
      <BackHeader title="Set your limits" />
      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
        The pick is random inside these bounds, not outside them.
      </Typography>

      <Col spacing={4} sx={{ flex: 1 }}>
        <Col spacing={1.5}>
          <SectionLabel label="Budget per dish" />
          <SelectableChipGroup
            options={BUDGET_OPTIONS}
            selected={[budget]}
            onToggle={setBudget}
          />
        </Col>

        <Col spacing={1.5}>
          <SectionLabel label="Cuisine — none selected means all" />
          <SelectableChipGroup
            options={CUISINE_OPTIONS}
            selected={cuisines}
            onToggle={(option) =>
              setCuisines((current) =>
                current.includes(option)
                  ? current.filter((item) => item !== option)
                  : [...current, option],
              )
            }
          />
        </Col>

        <Col spacing={1.5}>
          <SectionLabel label="Dietary restriction" />
          <RadioGroup value={dietary} onChange={(_, value) => setDietary(value)}>
            {DIETARY_OPTIONS.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio size="small" />}
                label={option}
              />
            ))}
          </RadioGroup>
        </Col>

        <Col spacing={1.5}>
          <SectionLabel label="Distance" value={`${distance.toFixed(1)}km`} />
          <Box sx={{ px: 0.5 }}>
            <Slider
              value={distance}
              onChange={(_, value) => setDistance(value as number)}
              min={0.1}
              max={10}
              step={0.5}
              color="primary"
            />
          </Box>
        </Col>
      </Col>

      <Button
        variant="contained"
        size="large"
        onClick={() => {
          writeFilters({ budget, cuisines, dietary, distance });
          router.push("/");
        }}
      >
        Apply — {dishCount === null ? "…" : dishCount} dish
        {dishCount === 1 ? "" : "es"} qualify
      </Button>
    </PageShell>
  );
}
