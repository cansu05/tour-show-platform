import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Stack, Typography } from "@mui/material";
import type { TourDetailListProps } from "@/features/tour-detail/tour-detail.types";

export function TourDetailList({ items }: TourDetailListProps) {
  return (
    <Stack
      component="ul"
      spacing={0.75}
      sx={{ pl: 0, m: 0, listStyle: "none" }}
    >
      {items.map((item) => (
        <Stack
          component="li"
          key={item}
          direction="row"
          spacing={0.8}
          alignItems="center"
          sx={{
            color: "#173B51",
          }}
        >
          <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14, color: "#FF7800", flexShrink: 0 }} />
          <Typography
            component="span"
            sx={{
              color: "#173B51",
              fontSize: { xs: 14.5, md: 15.5 },
              lineHeight: 1.35,
              fontWeight: 500,
            }}
          >
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
