"use client";

import CheckIcon from "@mui/icons-material/Check";
import Chip from "@mui/material/Chip";
import { Row } from "@/components/Flex";

export default function SelectableChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: readonly string[];
  onToggle: (option: string) => void;
}) {
  return (
    <Row wrap="wrap" spacing={1}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Chip
            key={option}
            label={option}
            clickable
            onClick={() => onToggle(option)}
            icon={isSelected ? <CheckIcon fontSize="small" /> : undefined}
            variant={isSelected ? "filled" : "outlined"}
            color={isSelected ? "primary" : "default"}
            sx={{
              borderColor: "divider",
              ...(isSelected && { "& .MuiChip-icon": { color: "inherit" } }),
            }}
          />
        );
      })}
    </Row>
  );
}
