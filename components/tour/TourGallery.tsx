'use client';

import {useMemo, useState} from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import {Box, Dialog, IconButton, Stack, Typography} from '@mui/material';
import Image from 'next/image';
import {useTranslations} from 'next-intl';

type Props = {
  images: string[];
  alt: string;
};

export function TourGallery({images, alt}: Props) {
  const tTour = useTranslations('tour');
  const source = useMemo(() => (images.length ? images : ['https://picsum.photos/1200/800?random=99']), [images]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const go = (dir: 'prev' | 'next') => {
    setIndex((prev) => {
      if (dir === 'prev') return prev === 0 ? source.length - 1 : prev - 1;
      return prev === source.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <Stack spacing={1}>
      <Box sx={{position: 'relative', borderRadius: 2, overflow: 'hidden'}}>
        <Box sx={{position: 'relative', width: '100%', height: {xs: 260, md: 390}}}>
          <Image
            src={source[index]}
            alt={alt}
            fill
            priority={index === 0}
            sizes="(max-width: 900px) 100vw, 70vw"
            style={{objectFit: 'cover'}}
          />
        </Box>
        <IconButton aria-label={tTour('previousImage')} onClick={() => go('prev')} sx={{position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)'}}>
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <IconButton aria-label={tTour('nextImage')} onClick={() => go('next')} sx={{position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)'}}>
          <ArrowForwardIosRoundedIcon />
        </IconButton>
        <IconButton aria-label={tTour('showFullscreen')} onClick={() => setOpen(true)} sx={{position: 'absolute', right: 8, bottom: 8, bgcolor: 'rgba(255,255,255,0.85)'}}>
          <ZoomInIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center', fontWeight: 600}}>
        {`${index + 1} / ${source.length}`}
      </Typography>
      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <Box sx={{height: '100%', bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Box sx={{position: 'relative', width: '100%', height: '100%'}}>
            <Image
              src={source[index]}
              alt={alt}
              fill
              sizes="100vw"
              style={{objectFit: 'contain'}}
            />
          </Box>
          <IconButton
            aria-label={tTour('previousImage')}
            onClick={() => go('prev')}
            sx={{position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'white', bgcolor: 'rgba(255,255,255,0.15)'}}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <IconButton
            aria-label={tTour('nextImage')}
            onClick={() => go('next')}
            sx={{position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'white', bgcolor: 'rgba(255,255,255,0.15)'}}
          >
            <ArrowForwardIosRoundedIcon />
          </IconButton>
          <Typography sx={{position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', color: 'white', fontWeight: 700}}>
            {`${index + 1} / ${source.length}`}
          </Typography>
          <IconButton aria-label={tTour('closeGallery')} onClick={() => setOpen(false)} sx={{position: 'absolute', top: 16, right: 16, color: 'white'}}>×</IconButton>
        </Box>
      </Dialog>
    </Stack>
  );
}

