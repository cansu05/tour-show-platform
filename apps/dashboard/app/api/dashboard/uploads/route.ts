import {createHash, randomUUID} from 'node:crypto';
import path from 'node:path';
import {NextResponse} from 'next/server';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;
const MAX_GALLERY_FILES = 24;

const ACCEPTED_FILE_RULES = {
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
    maxFiles: 1
  }
} as const;

type UploadKind = keyof typeof ACCEPTED_FILE_RULES;

class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadValidationError';
  }
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {cloudName, apiKey, apiSecret};
}

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ext || '.bin';
}

function parseUploadKind(value: string): UploadKind | null {
  return value === 'cover' || value === 'gallery' || value === 'video' ? value : null;
}

function getBaseName(kind: UploadKind, slug: string, index: number) {
  if (kind === 'cover') return `${slug}-cover`;
  if (kind === 'video') return `${slug}-video`;
  return `${slug}-${index + 1}`;
}

function hasMagicBytes(buffer: Uint8Array, signature: number[]) {
  return signature.every((value, index) => buffer[index] === value);
}

function isLikelyValidFile(buffer: Uint8Array, extension: string) {
  if (buffer.length < 12) {
    return false;
  }

  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return hasMagicBytes(buffer, [0xff, 0xd8, 0xff]);
    case '.png':
      return hasMagicBytes(buffer, [0x89, 0x50, 0x4e, 0x47]);
    case '.gif':
      return hasMagicBytes(buffer, [0x47, 0x49, 0x46, 0x38]);
    case '.webp':
      return hasMagicBytes(buffer, [0x52, 0x49, 0x46, 0x46]) && hasMagicBytes(buffer.subarray(8), [0x57, 0x45, 0x42, 0x50]);
    case '.mp4':
      return hasMagicBytes(buffer.subarray(4), [0x66, 0x74, 0x79, 0x70]);
    case '.webm':
      return hasMagicBytes(buffer, [0x1a, 0x45, 0xdf, 0xa3]);
    case '.mov':
      return hasMagicBytes(buffer.subarray(4), [0x66, 0x74, 0x79, 0x70]);
    default:
      return false;
  }
}

function validateFiles(kind: UploadKind, files: File[]) {
  const rules = ACCEPTED_FILE_RULES[kind];

  if (files.length > rules.maxFiles) {
    throw new UploadValidationError(kind === 'gallery' ? 'Cok fazla dosya secildi.' : 'Bu alan tek dosya kabul eder.');
  }

  for (const file of files) {
    const extension = getExtension(file.name);
    const hasAcceptedMime = rules.mimePrefixes.some((prefix) => file.type.startsWith(prefix));
    if (!hasAcceptedMime || !rules.extensions.has(extension)) {
      throw new UploadValidationError('Desteklenmeyen dosya turu.');
    }

    if (file.size > rules.maxSize) {
      throw new UploadValidationError(kind === 'video' ? 'Video boyutu siniri asildi.' : 'Gorsel boyutu siniri asildi.');
    }
  }
}

function createCloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const payload = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return createHash('sha1')
    .update(`${payload}${apiSecret}`)
    .digest('hex');
}

async function saveToCloudinary(slug: string, kind: UploadKind, index: number, file: File) {
  const config = getCloudinaryConfig();

  if (!config) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = `tour-show/tours/${slug}`;
  const publicId = `${getBaseName(kind, slug, index)}-${randomUUID()}`;
  const signature = createCloudinarySignature({folder, public_id: publicId, timestamp}, config.apiSecret);
  const formData = new FormData();

  formData.append('file', file);
  formData.append('api_key', config.apiKey);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`, {
    method: 'POST',
    body: formData
  });

  const result = (await response.json().catch(() => null)) as
    | {secure_url?: string; error?: {message?: string}}
    | null;

  if (!response.ok || !result?.secure_url) {
    throw new Error(result?.error?.message || 'Cloudinary yuklemesi basarisiz oldu.');
  }

  return result.secure_url;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const slug = sanitizeSegment(String(formData.get('slug') || 'tour'));
    const kind = parseUploadKind(String(formData.get('kind') || 'gallery'));
    const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File);

    if (!slug) {
      return NextResponse.json({message: 'Slug zorunludur.'}, {status: 400});
    }

    if (!kind) {
      return NextResponse.json({message: 'Gecersiz yukleme turu.'}, {status: 400});
    }

    if (files.length === 0) {
      return NextResponse.json({message: 'Yuklenecek dosya bulunamadi.'}, {status: 400});
    }

    if (!getCloudinaryConfig()) {
      return NextResponse.json({message: 'Cloudinary ayarlari eksik.'}, {status: 500});
    }

    validateFiles(kind, files);

    const savedFiles = await Promise.all(
      files.map(async (file, index) => {
        const extension = getExtension(file.name);
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        if (!isLikelyValidFile(bytes, extension)) {
          throw new UploadValidationError('Dosya icerigi uzanti ile eslesmiyor.');
        }

        return saveToCloudinary(slug, kind, index, file);
      })
    );

    return NextResponse.json({files: savedFiles});
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({message: error.message}, {status: 400});
    }

    return NextResponse.json({message: error instanceof Error ? error.message : 'Dosyalar yuklenemedi.'}, {status: 500});
  }
}
