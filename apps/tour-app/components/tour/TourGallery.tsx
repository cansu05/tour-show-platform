'use client';

import {useMemo, useState} from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {Box, Dialog, IconButton, Stack, Typography} from '@mui/material';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {isUploadedTourAsset} from '@/utils/media';

type GalleryItem =
  | {type: 'image'; src: string}
  | {type: 'video'; src: string};

type Props = {
  images: string[];
  alt: string;
  videoUrl?: string;
};

function normalizeMediaSrc(value?: string) {
  if (typeof value !== 'string') return undefined;
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

const protectedMediaSx = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none'
} as const;

export function TourGallery({images, alt, videoUrl}: Props) {
  const tTour = useTranslations('tour');
  const source = useMemo<GalleryItem[]>(() => {
    const normalizedImages = images.map((src) => src.trim()).filter(Boolean);
    const imageItems = (normalizedImages.length ? normalizedImages : ['https://picsum.photos/1200/800?random=99']).map((src) => ({
      type: 'image' as const,
      src
    }));
    const normalizedVideoUrl = normalizeMediaSrc(videoUrl);

    return normalizedVideoUrl ? [...imageItems, {type: 'video', src: normalizedVideoUrl}] : imageItems;
  }, [images, videoUrl]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const currentItem = source[index];
  const useUnoptimizedImage = currentItem?.type === 'image' && isUploadedTourAsset(currentItem.src);

  const go = (dir: 'prev' | 'next') => {
    setIndex((prev) => {
      if (dir === 'prev') return prev === 0 ? source.length - 1 : prev - 1;
      return prev === source.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <Stack spacing={1}>
      <Box sx={{position: 'relative', borderRadius: 2, overflow: 'hidden'}}>
        <Box sx={{position: 'relative', width: '100%', height: {xs: 320, md: 520}, bgcolor: '#000'}}>
          {currentItem?.type === 'video' ? (
            <Box
              component="video"
              src={currentItem.src}
              controls
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              playsInline
              preload="metadata"
              sx={{display: 'block', width: '100%', height: '100%', objectFit: 'cover', ...protectedMediaSx}}
            />
          ) : (
            <Image
              src={currentItem?.src || 'https://picsum.photos/1200/800?random=99'}
              alt={alt}
              fill
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              priority={index === 0}
              unoptimized={Boolean(useUnoptimizedImage)}
              sizes="(max-width: 900px) 100vw, 70vw"
              style={{objectFit: 'cover', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none'}}
            />
          )}
        </Box>
        <IconButton aria-label={tTour('previousImage')} onClick={() => go('prev')} sx={{position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)'}}>
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <IconButton aria-label={tTour('nextImage')} onClick={() => go('next')} sx={{position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)'}}>
          <ArrowForwardIosRoundedIcon />
        </IconButton>
        {currentItem?.type === 'image' ? (
          <IconButton aria-label={tTour('showFullscreen')} onClick={() => setOpen(true)} sx={{position: 'absolute', right: 8, bottom: 8, bgcolor: 'rgba(255,255,255,0.85)'}}>
            <ZoomInIcon />
          </IconButton>
        ) : null}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center', fontWeight: 600}}>
        {`${index + 1} / ${source.length}`}
      </Typography>
      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <Box sx={{height: '100%', bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Box sx={{position: 'relative', width: '100%', height: '100%'}}>
            <Image
              src={currentItem?.type === 'image' ? currentItem.src : 'https://picsum.photos/1200/800?random=99'}
              alt={alt}
              fill
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              unoptimized={Boolean(useUnoptimizedImage)}
              sizes="100vw"
              style={{objectFit: 'contain', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none'}}
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
          <IconButton aria-label={tTour('closeGallery')} onClick={() => setOpen(false)} sx={{position: 'absolute', top: 16, right: 16, color: 'white'}}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </Dialog>
    </Stack>
  );
}
