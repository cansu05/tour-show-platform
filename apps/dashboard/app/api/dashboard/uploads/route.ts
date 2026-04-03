import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {NextResponse} from 'next/server';

const TOUR_APP_PUBLIC_ROOT = path.join(process.cwd(), '..', 'tour-app', 'public');

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

function getBaseName(kind: string, slug: string, index: number) {
  if (kind === 'cover') return `${slug}-cover`;
  if (kind === 'video') return `${slug}-video`;
  return `${slug}-${index + 1}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const slug = sanitizeSegment(String(formData.get('slug') || 'tour'));
    const kind = String(formData.get('kind') || 'gallery');
    const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File);

    if (!slug) {
      return NextResponse.json({message: 'Slug zorunludur.'}, {status: 400});
    }

    if (files.length === 0) {
      return NextResponse.json({message: 'Yüklenecek dosya bulunamadı.'}, {status: 400});
    }

    const targetDir = path.join(TOUR_APP_PUBLIC_ROOT, 'images', 'tours', slug);
    await mkdir(targetDir, {recursive: true});

    const savedFiles = await Promise.all(
      files.map(async (file, index) => {
        const extension = getExtension(file.name);
        const fileName = `${getBaseName(kind, slug, index)}${extension}`;
        const filePath = path.join(targetDir, fileName);
        const arrayBuffer = await file.arrayBuffer();

        await writeFile(filePath, Buffer.from(arrayBuffer));

        return `/images/tours/${slug}/${fileName}`;
      })
    );

    return NextResponse.json({files: savedFiles});
  } catch {
    return NextResponse.json({message: 'Dosyalar yüklenemedi.'}, {status: 500});
  }
}
