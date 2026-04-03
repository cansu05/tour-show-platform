# Tour Show Platform

Tourizm satis ekipleri icin gelistirilmis, cok dilli tur tanitim ve yonetim platformu.

## Kisa Aciklama

Tour Show Platform, tur paketlerinin musterilere sunulmasi ve iceriklerin yonetim paneli uzerinden duzenlenmesi icin hazirlanmis bir monorepo projedir. Public uygulama tur detaylarini sergilerken, dashboard uygulamasi icerik yonetimi ve operasyonel duzenleme ihtiyaclarini karsilar.

## Kullanilan Teknolojiler

- Next.js 15
- React 19
- TypeScript
- Material UI
- Tailwind CSS
- Firebase Firestore
- Firebase Storage
- Firebase Admin SDK
- next-intl
- Vitest
- npm Workspaces

## One Cikan Ozellikler

- Cok dilli yapi ve locale tabanli routing
- Tablet odakli, hizli ve sade arayuz
- Tur arama, kategori filtreleme ve fuzzy search
- Sesli arama destegi
- Zengin tur detay sayfalari ve galeri yapisi
- Link, QR ve WhatsApp ile tur paylasimi
- Dashboard uzerinden tur ekleme, guncelleme ve listeleme
- Firebase tabanli veri ve medya yonetimi
- `packages/shared` ile ortak kod kullanimi

## Kurulum Adimlari

### 1. Repoyu klonlayin

```bash
git clone https://github.com/kullanici-adi/tour-show-platform.git
cd tour-show-platform
```

### 2. Bagimliliklari yukleyin

```bash
npm install
```

### 3. Ortam degiskenlerini tanimlayin

Gerekli uygulama klasorlerinde `.env.local` dosyasi olusturun.

Ornek:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Gelistirme ortamini baslatin

Public uygulama:

```bash
npm run dev:tour-app
```

Dashboard:

```bash
npm run dev:dashboard
```

Her iki uygulama:

```bash
npm run dev:all
```

## Kullanim

Proje iki ana uygulamadan olusur:

- `apps/tour-app`: Musteriye veya satis personeline gosterilen public uygulama
- `apps/dashboard`: Tur iceriklerinin yonetildigi admin paneli

Temel kullanim senaryolari:

- Tur listeleme ve detay goruntuleme
- Arama ve kategori bazli filtreleme
- Tur paylasimi
- Dashboard uzerinden yeni tur ekleme veya mevcut turu guncelleme

## Klasor Yapisi

```bash
apps/
  dashboard/      # Admin paneli
  tour-app/       # Public tur uygulamasi

packages/
  shared/         # Ortak tipler ve yardimci moduller

package.json
README.md
```

## Gelistirilebilecek Alanlar

- Rol bazli yetkilendirme sistemi
- Dashboard icin gelismis raporlama ekranlari
- Medya yonetim akislarinin guclendirilmesi
- SEO ve performans optimizasyonlari
- Test kapsaminin genisletilmesi
- Hata izleme ve loglama entegrasyonlari

## Ekran Goruntusu / Demo

### Canli Demo

- Public App: `[Canli demo linki eklenecek]`
- Dashboard: `[Dashboard demo linki eklenecek]`

### Ekran Goruntuleri

```md
![Ana Sayfa](./docs/screenshots/home.png)
![Tur Detay](./docs/screenshots/tour-detail.png)
![Dashboard](./docs/screenshots/dashboard.png)
```

> Bu alanlar hazir oldugunda guncellenebilir.

## Iletisim

- GitHub: `https://github.com/cansu05`
- E-posta: `[iletisim mail adresi eklenecek]`
- Proje sahibi: `Cansu`
