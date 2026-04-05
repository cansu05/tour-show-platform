import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
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

function resolveTourAppPublicRoot() {
  const candidates = [
    path.resolve(process.cwd(), 'apps', 'tour-app', 'public'),
    path.resolve(process.cwd(), '..', 'tour-app', 'public')
  ];

  const match = candidates.find((candidate) => existsSync(candidate));
  return match ?? candidates[0];
}

const TOUR_APP_PUBLIC_ROOT = resolveTourAppPublicRoot();

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
    throw new UploadValidationError(kind === 'gallery' ? 'Çok fazla dosya seçildi.' : 'Bu alan tek dosya kabul eder.');
  }

  for (const file of files) {
    const extension = getExtension(file.name);
    const hasAcceptedMime = rules.mimePrefixes.some((prefix) => file.type.startsWith(prefix));
    if (!hasAcceptedMime || !rules.extensions.has(extension)) {
      throw new UploadValidationError('Desteklenmeyen dosya türü.');
    }

    if (file.size > rules.maxSize) {
      throw new UploadValidationError(kind === 'video' ? 'Video boyutu sınırı aşıldı.' : 'Görsel boyutu sınırı aşıldı.');
    }
  }
}

async function buildUniqueFilePath(targetDir: string, baseName: string, extension: string) {
  let suffix = 0;
  let fileName = `${baseName}${extension}`;
  let filePath = path.join(targetDir, fileName);

  while (existsSync(filePath)) {
    suffix += 1;
    fileName = `${baseName}-${suffix}${extension}`;
    filePath = path.join(targetDir, fileName);
  }

  return {fileName, filePath};
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
      return NextResponse.json({message: 'Geçersiz yükleme türü.'}, {status: 400});
    }

    if (files.length === 0) {
      return NextResponse.json({message: 'Yüklenecek dosya bulunamadı.'}, {status: 400});
    }

    validateFiles(kind, files);

    const targetDir = path.join(TOUR_APP_PUBLIC_ROOT, 'images', 'tours', slug);
    await mkdir(targetDir, {recursive: true});

    const savedFiles = await Promise.all(
      files.map(async (file, index) => {
        const extension = getExtension(file.name);
        const {fileName, filePath} = await buildUniqueFilePath(targetDir, getBaseName(kind, slug, index), extension);
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        if (!isLikelyValidFile(bytes, extension)) {
          throw new UploadValidationError('Dosya içeriği uzantı ile eşleşmiyor.');
        }

        await writeFile(filePath, Buffer.from(arrayBuffer));

        return `/images/tours/${slug}/${fileName}`;
      })
    );

    return NextResponse.json({files: savedFiles});
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({message: error.message}, {status: 400});
    }

    return NextResponse.json({message: 'Dosyalar yüklenemedi.'}, {status: 500});
  }
}
