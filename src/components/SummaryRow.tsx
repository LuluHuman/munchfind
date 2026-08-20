import Typography from "@mui/material/Typography";
import { Row } from "@/components/Flex";

export default function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Row justify="space-between" sx={{ py: 1.25, borderBottom: 1, borderColor: "divider" }}>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary">
        {value}
      </Typography>
    </Row>
  );
}
