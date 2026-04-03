import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

function resolveTourAppPublicRoot() {
  const candidates = [
    path.resolve(process.cwd(), "apps", "tour-app", "public"),
    path.resolve(process.cwd(), "..", "tour-app", "public"),
  ];

  const match = candidates.find((candidate) => existsSync(candidate));
  return match ?? candidates[0];
}

const TOUR_APP_PUBLIC_ROOT = resolveTourAppPublicRoot();

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetPath: string[] }> },
) {
  try {
    const { assetPath } = await params;
    const requestedPath = path.normalize(path.join(TOUR_APP_PUBLIC_ROOT, ...assetPath));

    if (!requestedPath.startsWith(TOUR_APP_PUBLIC_ROOT)) {
      return NextResponse.json({ message: "Geçersiz medya yolu." }, { status: 400 });
    }

    const file = await readFile(requestedPath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": getContentType(requestedPath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ message: "Medya bulunamadı." }, { status: 404 });
  }
}
