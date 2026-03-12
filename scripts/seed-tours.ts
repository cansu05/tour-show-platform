import {FieldValue} from 'firebase-admin/firestore';
import {adminDb} from '../lib/firebase/admin';
import type {Tour} from '../types/tour';
import {slugify} from '../utils/slug';
import {ensureTourLocalized} from '../utils/ensure-tour-localized';
import {seedTourTranslations} from './seed-tours.translations';

const image = (seed: number) => `https://picsum.photos/seed/tour-${seed}/1200/800`;

const tours: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Pamukkale',
    slug: slugify('Pamukkale'),
    keywords: ['pamukkale', 'traverten', 'hierapolis', 'termal'],
    categories: ['doğa', 'günübirlik'],
    shortDescription: 'Bembeyaz travertenlerde yürüyüş ve Hierapolis antik kenti ziyareti.',
    highlights: ['Traverten terasları', 'Hierapolis antik tiyatro', 'Kleopatra havuzu çevresi'],
    includedServices: ['Gidiş-dönüş ulaşım', 'Profesyonel rehber', 'Öğle yemeği'],
    duration: 'Tam gün',
    priceText: 'Kişi başı 65 EUR',
    coverImage: image(1),
    gallery: [image(2), image(3), image(4)],
    isActive: true,
    localized: {}
  },
  {
    title: 'Kapadokya',
    slug: slugify('Kapadokya'),
    keywords: ['kapadokya', 'balon', 'göreme', 'peri bacaları'],
    categories: ['doğa', 'tarih', 'konaklamalı'],
    shortDescription: 'Peri bacaları manzarasında iki günlük unutulmaz Kapadokya deneyimi.',
    highlights: ['Göreme açık hava müzesi', 'Uçhisar panorama', 'Balon izleme noktası'],
    includedServices: ['1 gece konaklama', 'Rehberlik', 'Kahvaltı ve akşam yemeği'],
    duration: '2 gün 1 gece',
    priceText: 'Kişi başı 180 EUR',
    coverImage: image(5),
    gallery: [image(6), image(7), image(8)],
    isActive: true,
    localized: {}
  },
  {
    title: 'Manavgat',
    slug: slugify('Manavgat'),
    keywords: ['manavgat', 'şelale', 'tekne', 'çarşı'],
    categories: ['aile', 'günübirlik', 'deniz'],
    shortDescription: 'Manavgat şelalesi ve tekne turunu birleştiren keyifli günlük rota.',
    highlights: ['Manavgat şelalesi', 'Nehirde tekne turu', 'Yerel pazar ziyareti'],
    includedServices: ['Ulaşım', 'Tekne bileti', 'Rehberlik'],
    duration: 'Tam gün',
    priceText: 'Kişi başı 45 EUR',
    coverImage: image(9),
    gallery: [image(10), image(11), image(12)],
    isActive: true,
    localized: {}
  },
  {
    title: 'Salda Gölü',
    slug: slugify('Salda Gölü'),
    keywords: ['salda', 'göl', 'beyaz kumsal', 'doğa'],
    categories: ['doğa', 'günübirlik'],
    shortDescription: 'Türkiye’nin Maldivleri olarak bilinen Salda Gölü doğa turu.',
    highlights: ['Beyaz kum kıyısı', 'Fotoğraf molaları', 'Göl kenarı serbest zaman'],
    includedServices: ['Ulaşım', 'Rehber', 'Ara ikram'],
    duration: 'Tam gün',
    priceText: 'Kişi başı 55 EUR',
    coverImage: image(13),
    gallery: [image(14), image(15), image(16)],
    isActive: true,
    localized: {}
  },
  {
    title: 'Antalya Şehir Turu',
    slug: slugify('Antalya Şehir Turu'),
    keywords: ['antalya', 'kaleiçi', 'düden', 'teleferik'],
    categories: ['tarih', 'aile', 'günübirlik'],
    shortDescription: 'Kaleiçi, Düden Şelalesi ve panoramik şehir noktalarını kapsayan rota.',
    highlights: ['Kaleiçi yürüyüşü', 'Düden şelalesi', 'Tünektepe manzarası'],
    includedServices: ['Transfer', 'Rehberlik', 'Öğle yemeği'],
    duration: 'Tam gün',
    priceText: 'Kişi başı 50 EUR',
    coverImage: image(17),
    gallery: [image(18), image(19), image(20)],
    isActive: true,
    localized: {}
  },
  {
    title: 'Kaş Kekova',
    slug: slugify('Kaş Kekova'),
    keywords: ['kaş', 'kekova', 'tekne', 'batık şehir'],
    categories: ['deniz', 'macera', 'günübirlik'],
    shortDescription: 'Kekova koylarında yüzme molalı tekne turu ve batık şehir manzarası.',
    highlights: ['Batık şehir', 'Koylarda yüzme molası', 'Simena manzarası'],
    includedServices: ['Tekne turu', 'Öğle yemeği', 'Transfer'],
    duration: 'Tam gün',
    priceText: 'Kişi başı 70 EUR',
    coverImage: image(21),
    gallery: [image(22), image(23), image(24)],
    isActive: true,
    localized: {}
  },
  {
    title: 'Sapadere Kanyonu',
    slug: slugify('Sapadere Kanyonu'),
    keywords: ['sapadere', 'kanyon', 'doğa yürüyüşü', 'alanya'],
    categories: ['doğa', 'macera', 'günübirlik'],
    shortDescription: 'Kanyon yürüyüşü ve doğal havuzlar eşliğinde serin bir günlük kaçış.',
    highlights: ['Ahşap yürüyüş parkuru', 'Doğal havuzlar', 'Seyir noktaları'],
    includedServices: ['Ulaşım', 'Giriş biletleri', 'Rehberlik'],
    duration: 'Tam gün',
    priceText: 'Kişi başı 48 EUR',
    coverImage: image(25),
    gallery: [image(26), image(27), image(28)],
    isActive: true,
    localized: {}
  },
  {
    title: 'Rafting Turu',
    slug: slugify('Rafting Turu'),
    keywords: ['rafting', 'köprülü kanyon', 'adrenalin', 'nehir'],
    categories: ['macera', 'günübirlik'],
    shortDescription: 'Köprülü Kanyon’da ekipman dahil profesyonel rehberli rafting deneyimi.',
    highlights: ['Köprülü Kanyon parkuru', 'Profesyonel ekipman', 'Nehir kenarı öğle yemeği'],
    includedServices: ['Transfer', 'Rafting ekipmanı', 'Sigorta', 'Öğle yemeği'],
    duration: 'Tam gün',
    priceText: 'Kişi başı 60 EUR',
    coverImage: image(29),
    gallery: [image(30), image(31), image(32)],
    isActive: true,
    localized: {}
  }
];

async function seedTours() {
  if (!adminDb) {
    throw new Error(
      'Firebase Admin SDK is not initialized. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.'
    );
  }

  const collectionRef = adminDb.collection('tours');

  for (const tour of tours) {
    const normalizedTour = ensureTourLocalized({
      ...tour,
      localized: seedTourTranslations[tour.slug] || tour.localized
    });

    await collectionRef.doc(tour.slug).set({
      ...normalizedTour,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  }

  console.log(`Seeded ${tours.length} tours`);
}

seedTours().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});

