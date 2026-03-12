import type {Tour} from '../types/tour';

type SeedLocalizedMap = Record<string, NonNullable<Tour['localized']>>;

export const seedTourTranslations: SeedLocalizedMap = {
  pamukkale: {
    title: {tr: 'Pamukkale', en: 'Pamukkale', de: 'Pamukkale'},
    shortDescription: {
      tr: 'Bembeyaz travertenlerde yürüyüş ve Hierapolis antik kenti ziyareti.',
      en: 'Walk on bright white travertines and visit the ancient city of Hierapolis.',
      de: 'Spaziergang auf schneeweissen Travertinen und Besuch der antiken Stadt Hierapolis.'
    },
    duration: {tr: 'Tam gün', en: 'Full day', de: 'Ganztägig'},
    priceText: {tr: 'Kişi başı 65 EUR', en: '65 EUR per person', de: '65 EUR pro Person'},
    keywords: {
      tr: ['pamukkale', 'traverten', 'hierapolis', 'termal'],
      en: ['pamukkale', 'travertine', 'hierapolis', 'thermal'],
      de: ['pamukkale', 'travertin', 'hierapolis', 'thermal']
    },
    highlights: {
      tr: ['Traverten terasları', 'Hierapolis antik tiyatro', 'Kleopatra havuzu çevresi'],
      en: ['Travertine terraces', 'Ancient theater of Hierapolis', 'Cleopatra pool surroundings'],
      de: ['Travertinterrassen', 'Antikes Theater von Hierapolis', 'Umgebung des Kleopatra-Pools']
    },
    includedServices: {
      tr: ['Gidiş-dönüş ulaşım', 'Profesyonel rehber', 'Öğle yemeği'],
      en: ['Round-trip transportation', 'Professional guide', 'Lunch'],
      de: ['Hin- und Rücktransfer', 'Professioneller Reiseführer', 'Mittagessen']
    }
  },
  kapadokya: {
    title: {tr: 'Kapadokya', en: 'Cappadocia', de: 'Kappadokien'},
    shortDescription: {
      tr: 'Peri bacaları manzarasında iki günlük unutulmaz Kapadokya deneyimi.',
      en: 'An unforgettable two-day Cappadocia experience with fairy chimney views.',
      de: 'Ein unvergessliches zweitaegiges Kappadokien-Erlebnis mit Feenkaminblick.'
    },
    duration: {tr: '2 gün 1 gece', en: '2 days 1 night', de: '2 Tage 1 Nacht'},
    priceText: {tr: 'Kişi başı 180 EUR', en: '180 EUR per person', de: '180 EUR pro Person'},
    keywords: {
      tr: ['kapadokya', 'balon', 'göreme', 'peri bacaları'],
      en: ['cappadocia', 'balloon', 'goreme', 'fairy chimneys'],
      de: ['kappadokien', 'ballon', 'goereme', 'feenkamine']
    },
    highlights: {
      tr: ['Göreme açık hava müzesi', 'Uçhisar panorama', 'Balon izleme noktası'],
      en: ['Goreme open-air museum', 'Uchisar panorama', 'Balloon viewing point'],
      de: ['Freilichtmuseum Goereme', 'Panorama von Uechisar', 'Ballon-Beobachtungspunkt']
    },
    includedServices: {
      tr: ['1 gece konaklama', 'Rehberlik', 'Kahvaltı ve akşam yemeği'],
      en: ['1-night accommodation', 'Guiding service', 'Breakfast and dinner'],
      de: ['1 Uebernachtung', 'Reiseleitung', 'Fruehstueck und Abendessen']
    }
  },
  manavgat: {
    title: {tr: 'Manavgat', en: 'Manavgat', de: 'Manavgat'},
    shortDescription: {
      tr: 'Manavgat şelalesi ve tekne turunu birleştiren keyifli günlük rota.',
      en: 'A pleasant day route combining Manavgat waterfall and a boat tour.',
      de: 'Eine angenehme Tagesroute mit Manavgat-Wasserfall und Bootstour.'
    },
    duration: {tr: 'Tam gün', en: 'Full day', de: 'Ganztägig'},
    priceText: {tr: 'Kişi başı 45 EUR', en: '45 EUR per person', de: '45 EUR pro Person'},
    keywords: {
      tr: ['manavgat', 'şelale', 'tekne', 'çarşı'],
      en: ['manavgat', 'waterfall', 'boat', 'bazaar'],
      de: ['manavgat', 'wasserfall', 'boot', 'basar']
    },
    highlights: {
      tr: ['Manavgat şelalesi', 'Nehirde tekne turu', 'Yerel pazar ziyareti'],
      en: ['Manavgat waterfall', 'River boat tour', 'Local market visit'],
      de: ['Manavgat-Wasserfall', 'Bootstour auf dem Fluss', 'Besuch des lokalen Marktes']
    },
    includedServices: {
      tr: ['Ulaşım', 'Tekne bileti', 'Rehberlik'],
      en: ['Transportation', 'Boat ticket', 'Guiding service'],
      de: ['Transfer', 'Bootsticket', 'Reiseleitung']
    }
  },
  'salda-golu': {
    title: {tr: 'Salda Gölü', en: 'Lake Salda', de: 'Salda-See'},
    shortDescription: {
      tr: 'Türkiye’nin Maldivleri olarak bilinen Salda Gölü doğa turu.',
      en: 'A nature tour to Lake Salda, known as the Maldives of Turkey.',
      de: 'Naturtour zum Salda-See, bekannt als die Malediven der Tuerkei.'
    },
    duration: {tr: 'Tam gün', en: 'Full day', de: 'Ganztägig'},
    priceText: {tr: 'Kişi başı 55 EUR', en: '55 EUR per person', de: '55 EUR pro Person'},
    keywords: {
      tr: ['salda', 'göl', 'beyaz kumsal', 'doğa'],
      en: ['salda', 'lake', 'white beach', 'nature'],
      de: ['salda', 'see', 'weisser strand', 'natur']
    },
    highlights: {
      tr: ['Beyaz kum kıyısı', 'Fotoğraf molaları', 'Göl kenarı serbest zaman'],
      en: ['White sandy shore', 'Photo breaks', 'Free time by the lake'],
      de: ['Weisser Sandstrand', 'Fotostopps', 'Freizeit am See']
    },
    includedServices: {
      tr: ['Ulaşım', 'Rehber', 'Ara ikram'],
      en: ['Transportation', 'Guide', 'Snacks'],
      de: ['Transfer', 'Reisefuehrer', 'Snacks']
    }
  },
  'antalya-sehir-turu': {
    title: {tr: 'Antalya Şehir Turu', en: 'Antalya City Tour', de: 'Antalya Stadttour'},
    shortDescription: {
      tr: 'Kaleiçi, Düden Şelalesi ve panoramik şehir noktalarını kapsayan rota.',
      en: 'A route covering Kaleici, Duden Waterfall, and panoramic city viewpoints.',
      de: 'Route mit Kaleici, Dueden-Wasserfall und panoramischen Aussichtspunkten.'
    },
    duration: {tr: 'Tam gün', en: 'Full day', de: 'Ganztägig'},
    priceText: {tr: 'Kişi başı 50 EUR', en: '50 EUR per person', de: '50 EUR pro Person'},
    keywords: {
      tr: ['antalya', 'kaleiçi', 'düden', 'teleferik'],
      en: ['antalya', 'kaleici', 'duden', 'cable car'],
      de: ['antalya', 'kaleici', 'dueden', 'seilbahn']
    },
    highlights: {
      tr: ['Kaleiçi yürüyüşü', 'Düden şelalesi', 'Tünektepe manzarası'],
      en: ['Kaleici walking tour', 'Duden waterfall', 'Tunektepe viewpoint'],
      de: ['Spaziergang durch Kaleici', 'Dueden-Wasserfall', 'Blickpunkt Tunektepe']
    },
    includedServices: {
      tr: ['Transfer', 'Rehberlik', 'Öğle yemeği'],
      en: ['Transfer', 'Guiding service', 'Lunch'],
      de: ['Transfer', 'Reiseleitung', 'Mittagessen']
    }
  },
  'kas-kekova': {
    title: {tr: 'Kaş Kekova', en: 'Kas Kekova', de: 'Kas Kekova'},
    shortDescription: {
      tr: 'Kekova koylarında yüzme molalı tekne turu ve batık şehir manzarası.',
      en: 'Boat tour with swimming breaks in Kekova bays and sunken city views.',
      de: 'Bootstour mit Badepausen in den Buchten von Kekova und Blick auf die versunkene Stadt.'
    },
    duration: {tr: 'Tam gün', en: 'Full day', de: 'Ganztägig'},
    priceText: {tr: 'Kişi başı 70 EUR', en: '70 EUR per person', de: '70 EUR pro Person'},
    keywords: {
      tr: ['kaş', 'kekova', 'tekne', 'batık şehir'],
      en: ['kas', 'kekova', 'boat', 'sunken city'],
      de: ['kas', 'kekova', 'boot', 'versunkene stadt']
    },
    highlights: {
      tr: ['Batık şehir', 'Koylarda yüzme molası', 'Simena manzarası'],
      en: ['Sunken city', 'Swimming stops in bays', 'Simena view'],
      de: ['Versunkene Stadt', 'Badepausen in Buchten', 'Blick auf Simena']
    },
    includedServices: {
      tr: ['Tekne turu', 'Öğle yemeği', 'Transfer'],
      en: ['Boat tour', 'Lunch', 'Transfer'],
      de: ['Bootstour', 'Mittagessen', 'Transfer']
    }
  },
  'sapadere-kanyonu': {
    title: {tr: 'Sapadere Kanyonu', en: 'Sapadere Canyon', de: 'Sapadere-Canyon'},
    shortDescription: {
      tr: 'Kanyon yürüyüşü ve doğal havuzlar eşliğinde serin bir günlük kaçış.',
      en: 'A refreshing day escape with canyon walking paths and natural pools.',
      de: 'Ein erfrischender Tagesausflug mit Canyon-Wanderwegen und Naturbecken.'
    },
    duration: {tr: 'Tam gün', en: 'Full day', de: 'Ganztägig'},
    priceText: {tr: 'Kişi başı 48 EUR', en: '48 EUR per person', de: '48 EUR pro Person'},
    keywords: {
      tr: ['sapadere', 'kanyon', 'doğa yürüyüşü', 'alanya'],
      en: ['sapadere', 'canyon', 'nature walk', 'alanya'],
      de: ['sapadere', 'canyon', 'naturwanderung', 'alanya']
    },
    highlights: {
      tr: ['Ahşap yürüyüş parkuru', 'Doğal havuzlar', 'Seyir noktaları'],
      en: ['Wooden walking trail', 'Natural pools', 'Scenic viewpoints'],
      de: ['Holzsteg-Wanderweg', 'Naturbecken', 'Aussichtspunkte']
    },
    includedServices: {
      tr: ['Ulaşım', 'Giriş biletleri', 'Rehberlik'],
      en: ['Transportation', 'Entrance tickets', 'Guiding service'],
      de: ['Transfer', 'Eintrittskarten', 'Reiseleitung']
    }
  },
  'rafting-turu': {
    title: {tr: 'Rafting Turu', en: 'Rafting Tour', de: 'Rafting-Tour'},
    shortDescription: {
      tr: 'Köprülü Kanyon’da ekipman dahil profesyonel rehberli rafting deneyimi.',
      en: 'Professionally guided rafting experience in Koprulu Canyon with equipment included.',
      de: 'Professionell gefuehrte Rafting-Erfahrung im Koepruelue-Canyon inklusive Ausruestung.'
    },
    duration: {tr: 'Tam gün', en: 'Full day', de: 'Ganztägig'},
    priceText: {tr: 'Kişi başı 60 EUR', en: '60 EUR per person', de: '60 EUR pro Person'},
    keywords: {
      tr: ['rafting', 'köprülü kanyon', 'adrenalin', 'nehir'],
      en: ['rafting', 'koprulu canyon', 'adrenaline', 'river'],
      de: ['rafting', 'koepruelue canyon', 'adrenalin', 'fluss']
    },
    highlights: {
      tr: ['Köprülü Kanyon parkuru', 'Profesyonel ekipman', 'Nehir kenarı öğle yemeği'],
      en: ['Koprulu Canyon route', 'Professional equipment', 'Riverside lunch'],
      de: ['Route im Koepruelue-Canyon', 'Professionelle Ausruestung', 'Mittagessen am Fluss']
    },
    includedServices: {
      tr: ['Transfer', 'Rafting ekipmanı', 'Sigorta', 'Öğle yemeği'],
      en: ['Transfer', 'Rafting equipment', 'Insurance', 'Lunch'],
      de: ['Transfer', 'Rafting-Ausruestung', 'Versicherung', 'Mittagessen']
    }
  }
};
