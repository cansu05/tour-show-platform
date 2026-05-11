export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_GALLERY_FILES = 24;
export const MAX_VIDEO_FILES = 10;

export const ACCEPTED_FILE_RULES = {
  cover: {
    mimePrefixes: ['image/'],
    extensions: new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']),
    maxSize: MAX_IMAGE_SIZE_BYTES,
    maxFiles: 1
  },
  gallery: {
    mimePrefixes: ['image/'],
    extensions: new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']),
    maxSize: MAX_IMAGE_SIZE_BYTES,
    maxFiles: MAX_GALLERY_FILES
  },
  video: {
    mimePrefixes: ['video/'],
    extensions: new Set(['.mp4', '.webm', '.mov']),
    maxSize: MAX_VIDEO_SIZE_BYTES,
    maxFiles: MAX_VIDEO_FILES
  }
} as const;

export type UploadKind = keyof typeof ACCEPTED_FILE_RULES;

export type SignedUploadPayload = {
  cloudName: string;
  apiKey: string;
  files: Array<{
    folder: string;
    publicId: string;
    signature: string;
    timestamp: string;
  }>;
};

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadValidationError';
  }
}

export function sanitizeUploadSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getFileExtension(filename: string) {
  const match = /\.([^.]+)$/.exec(filename.trim().toLowerCase());
  return match ? `.${match[1]}` : '.bin';
}

export function parseUploadKind(value: string): UploadKind | null {
  return value === 'cover' || value === 'gallery' || value === 'video' ? value : null;
}

export function getUploadBaseName(kind: UploadKind, slug: string, index: number) {
  if (kind === 'cover') return `${slug}-cover`;
  if (kind === 'video') return `${slug}-video-${index + 1}`;
  return `${slug}-${index + 1}`;
}

export function validateUploadFiles(kind: UploadKind, files: Array<Pick<File, 'name' | 'size' | 'type'>>) {
  const rules = ACCEPTED_FILE_RULES[kind];

  if (files.length > rules.maxFiles) {
    throw new UploadValidationError(kind === 'cover' ? 'Bu alan tek dosya kabul eder.' : 'Cok fazla dosya secildi.');
  }

  for (const file of files) {
    const extension = getFileExtension(file.name);
    const hasAcceptedMime = rules.mimePrefixes.some((prefix) => file.type.startsWith(prefix));

    if (!hasAcceptedMime || !rules.extensions.has(extension)) {
      throw new UploadValidationError('Desteklenmeyen dosya turu.');
    }

    if (file.size > rules.maxSize) {
      throw new UploadValidationError(kind === 'video' ? 'Video boyutu siniri asildi.' : 'Gorsel boyutu siniri asildi.');
    }
  }
}
