import Typography from "@mui/material/Typography";
import { Row } from "@/components/Flex";

export default function SectionLabel({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <Row justify="space-between" align="baseline">
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: 1.2, lineHeight: 1.4 }}
      >
        {label}
      </Typography>
      {value && (
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      )}
    </Row>
  );
}
