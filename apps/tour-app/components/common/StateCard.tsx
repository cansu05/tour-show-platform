import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {Paper, Stack, Typography} from '@mui/material';
import {radiusTokens} from '@/theme/tokens';

type Props = {
  title: string;
  description?: string;
};

export function StateCard({title, description}: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {xs: 3, md: 4},
        borderRadius: `${radiusTokens.lg}px`,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F4FBFE 100%)',
        boxShadow: '0 8px 22px rgba(5,63,92,0.08)'
      }}
    >
      <Stack spacing={1.5} alignItems="center" textAlign="center">
        <InfoOutlinedIcon color="primary" sx={{fontSize: 34}} />
        <Typography variant="h4">{title}</Typography>
        {description ? <Typography color="text.secondary">{description}</Typography> : null}
      </Stack>
    </Paper>
  );
}
