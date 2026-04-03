import {revalidatePath} from 'next/cache';
import {NextResponse} from 'next/server';
import {createTour} from '@/services/tour.service';
import {TourConflictError, TourDataAccessError, TourValidationError} from '@/services/firebase/tour.errors';
import type {TourDocument} from '@/types/tour';

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TourDocument;
    await createTour(payload);

    revalidatePath('/');
    revalidatePath('/tours');

    return NextResponse.json({message: 'Tur başarıyla kaydedildi.'});
  } catch (error) {
    if (error instanceof TourValidationError) {
      return NextResponse.json({message: error.message}, {status: 400});
    }

    if (error instanceof TourConflictError) {
      return NextResponse.json({message: error.message}, {status: 409});
    }

    if (error instanceof TourDataAccessError) {
      return NextResponse.json({message: 'Firebase tarafında tur kaydı oluşturulamadı.'}, {status: 500});
    }

    return NextResponse.json({message: 'Beklenmeyen bir hata oluştu.'}, {status: 500});
  }
}
