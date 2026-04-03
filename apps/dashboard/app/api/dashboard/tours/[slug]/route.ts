import {revalidatePath} from 'next/cache';
import {NextResponse} from 'next/server';
import {TourConflictError, TourDataAccessError, TourValidationError} from '@/services/firebase/tour.errors';
import type {TourDocument} from '@/types/tour';
import {updateTour} from '@/services/tour.service';

export async function PUT(request: Request, {params}: {params: Promise<{slug: string}>}) {
  try {
    const {slug} = await params;
    const payload = (await request.json()) as TourDocument;
    const updatedSlug = await updateTour(slug, payload);

    revalidatePath('/');
    revalidatePath('/tours');
    revalidatePath(`/tours/${slug}/edit`);

    if (updatedSlug !== slug) {
      revalidatePath(`/tours/${updatedSlug}/edit`);
    }

    return NextResponse.json({message: 'Tur başarıyla güncellendi.', slug: updatedSlug});
  } catch (error) {
    if (error instanceof TourValidationError) {
      return NextResponse.json({message: error.message}, {status: 400});
    }

    if (error instanceof TourConflictError) {
      return NextResponse.json({message: error.message}, {status: 409});
    }

    if (error instanceof TourDataAccessError) {
      return NextResponse.json({message: 'Firebase tarafında tur güncellenemedi.'}, {status: 500});
    }

    return NextResponse.json({message: 'Beklenmeyen bir hata oluştu.'}, {status: 500});
  }
}
