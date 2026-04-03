'use client';

import {Alert, Snackbar} from '@mui/material';

type FeedbackType = 'success' | 'error' | 'info';

type Props = {
  open: boolean;
  message: string;
  type?: FeedbackType;
  onClose: () => void;
};

export function FeedbackSnackbar({open, message, type = 'info', onClose}: Props) {
  return (
    <Snackbar open={open} autoHideDuration={2800} onClose={onClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
      <Alert onClose={onClose} severity={type} variant="filled" sx={{width: '100%'}}>
        {message}
      </Alert>
    </Snackbar>
  );
}

