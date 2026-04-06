import {createHash, randomUUID} from 'node:crypto';
import {NextResponse} from 'next/server';
import {
  getUploadBaseName,
  parseUploadKind,
  sanitizeUploadSlug,
  UploadValidationError,
  validateUploadFiles,
  type SignedUploadPayload
} from '@/features/dashboard/uploads';

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {cloudName, apiKey, apiSecret};
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

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      slug?: string;
      kind?: string;
      files?: Array<{name?: string; size?: number; type?: string}>;
    };

    const slug = sanitizeUploadSlug(String(payload.slug || 'tour'));
    const kind = parseUploadKind(String(payload.kind || 'gallery'));
    const files = Array.isArray(payload.files)
      ? payload.files.map((file) => ({
          name: String(file?.name || ''),
          size: Number(file?.size || 0),
          type: String(file?.type || '')
        }))
      : [];
    const config = getCloudinaryConfig();

    if (!slug) {
      return NextResponse.json({message: 'Slug zorunludur.'}, {status: 400});
    }

    if (!kind) {
      return NextResponse.json({message: 'Gecersiz yukleme turu.'}, {status: 400});
    }

    if (files.length === 0) {
      return NextResponse.json({message: 'Yuklenecek dosya bulunamadi.'}, {status: 400});
    }

    if (!config) {
      return NextResponse.json({message: 'Cloudinary ayarlari eksik.'}, {status: 500});
    }

    validateUploadFiles(kind, files);

    const response: SignedUploadPayload = {
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      files: files.map((_, index) => {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const folder = `tour-show/tours/${slug}`;
        const publicId = `${getUploadBaseName(kind, slug, index)}-${randomUUID()}`;
        const signature = createCloudinarySignature({folder, public_id: publicId, timestamp}, config.apiSecret);

        return {
          folder,
          publicId,
          signature,
          timestamp
        };
      })
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({message: error.message}, {status: 400});
    }

    return NextResponse.json({message: error instanceof Error ? error.message : 'Dosyalar yuklenemedi.'}, {status: 500});
  }
}
