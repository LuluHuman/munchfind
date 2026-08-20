"use client";

import Stack, { type StackProps } from "@mui/material/Stack";
import type { CSSProperties } from "react";

type FlexProps = StackProps & {
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  wrap?: CSSProperties["flexWrap"];
};

function Flex({ justify, align, wrap, sx, ...props }: FlexProps) {
  return (
    <Stack
      useFlexGap
      sx={{ justifyContent: justify, alignItems: align, flexWrap: wrap, ...sx }}
      {...props}
    />
  );
}

export function Row(props: FlexProps) {
  return <Flex direction="row" {...props} />;
}

export function Col(props: FlexProps) {
  return <Flex direction="column" {...props} />;
}
