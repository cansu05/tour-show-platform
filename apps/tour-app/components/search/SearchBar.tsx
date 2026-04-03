'use client';

import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ClearIcon from '@mui/icons-material/Clear';
import {IconButton, InputAdornment, TextField} from '@mui/material';
import {useTranslations} from 'next-intl';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onVoiceClick: () => void;
};

export function SearchBar({value, onChange, onVoiceClick}: Props) {
  const tHome = useTranslations('home');

  return (
    <TextField
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={tHome('searchPlaceholder')}
      aria-label={tHome('searchAria')}
      size="medium"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" sx={{fontSize: 30}} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" sx={{gap: 0.5}}>
              {value ? (
                <IconButton
                  aria-label={tHome('clearSearch')}
                  onClick={() => onChange('')}
                  sx={{
                    bgcolor: 'rgba(5,63,92,0.08)',
                    '&:hover': {bgcolor: 'rgba(5,63,92,0.15)'}
                  }}
                >
                  <ClearIcon />
                </IconButton>
              ) : null}
              <IconButton
                aria-label={tHome('voiceSearch')}
                onClick={onVoiceClick}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {bgcolor: 'primary.dark'}
                }}
              >
                <MicIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 20px rgba(5,63,92,0.08)',
          pr: 0.75,
          '& fieldset': {
            border: 'none'
          }
        },
        '& .MuiInputBase-input': {
          fontSize: {xs: 19, md: 24},
          py: {xs: 1.4, md: 1.75}
        }
      }}
    />
  );
}
