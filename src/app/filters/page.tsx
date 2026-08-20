"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Col } from "@/components/Flex";
import PageShell from "@/components/PageShell";
import SectionLabel from "@/components/SectionLabel";
import SelectableChipGroup from "@/components/SelectableChipGroup";
import { BUDGET_OPTIONS, CUISINE_OPTIONS, DIETARY_OPTIONS } from "@/lib/options";

function handleApplyFilters() {}

export default function FiltersPage() {
  const router = useRouter();
  const [budget, setBudget] = useState<string>("Any");
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string>("None");
  const [distance, setDistance] = useState(5);

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
          <SectionLabel label="Distance" value={`${distance}km`} />
          <Box sx={{ px: 0.5 }}>
            <Slider
              value={distance}
              onChange={(_, value) => setDistance(value as number)}
              min={1}
              max={20}
              color="primary"
            />
          </Box>
        </Col>
      </Col>

      <Button
        variant="contained"
        size="large"
        onClick={() => {
          handleApplyFilters();
          router.push("/");
        }}
      >
        Apply — 5 dishes qualify
      </Button>
    </PageShell>
  );
}
