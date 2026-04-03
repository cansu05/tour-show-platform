'use client';

import MicIcon from '@mui/icons-material/Mic';
import {Fab} from '@mui/material';

type Props = {
  onClick: () => void;
  ariaLabel: string;
};

export function VoiceSearchButton({onClick, ariaLabel}: Props) {
  return (
    <Fab color="secondary" size="medium" aria-label={ariaLabel} onClick={onClick}>
      <MicIcon />
    </Fab>
  );
}

