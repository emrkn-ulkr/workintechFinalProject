# WT Store - Workintech Final Project

## Icerik

- [Proje Ozeti](#proje-ozeti)
- [Ozellikler](#ozellikler)
- [Teknoloji Yigini](#teknoloji-yigini)
- [Kurulum](#kurulum)
- [Ortam Degiskenleri](#ortam-degiskenleri)
- [Calistirma Komutlari](#calistirma-komutlari)
- [Proje Yapisi](#proje-yapisi)
- [Sayfalar ve Akis](#sayfalar-ve-akis)
- [API Bilgisi](#api-bilgisi)
- [Deployment](#deployment)
- [Guvenlik ve Release Kontrolu](#guvenlik-ve-release-kontrolu)
- [Postman](#postman)
- [Demo Hesaplar](#demo-hesaplar)
- [SSS](#sss)

## Proje Ozeti

Bu uygulama bir e-ticaret vitrini ve siparis akisi sunar. Kullanici;

- urunleri listeleyebilir,
- kategori, filtre ve siralama ile arama yapabilir,
- urun detayi gorebilir,
- sepete urun ekleyebilir,
- giris/kayit islemleri sonrasi siparis olusturabilir,
- gecmis siparislerini gorebilir.

## Ozellikler

- React Router v5 ile route tabanli sayfa yapisi
- Redux + Thunk ile global state yonetimi
- Kategori, urun, filtre, siralama ve sayfalama (load more)
- Giris/Kayit akisi ve token dogrulama
- Korumali rotalar (`/checkout`, `/orders`)
- Sepet, adres, kart ve siparis olusturma akisi
- TR/EN dil destegi
- Theme (light/dark) tercihi
- Responsive tasarim

## Teknoloji Yigini

- React 18
- Vite 7
- React Router DOM 5
- Redux, Redux Thunk, Redux Logger
- Axios
- React Hook Form
- React Toastify
- Tailwind CSS
- ESLint

## Kurulum

### Gereksinimler

- Node.js 18+
- npm 9+

### Adimlar

```bash
npm install
```

```bash
npm run dev
```

Uygulama varsayilan olarak Vite gelistirme sunucusu uzerinden calisir.

## Ortam Degiskenleri

`.env.example` dosyasini kopyalayip `.env` olusturun.

Mac/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Kullanilan degiskenler:

- `VITE_API_BASE_URL`: API base URL (varsayilan: `https://workintech-fe-ecommerce.onrender.com`)

## Calistirma Komutlari

- `npm run dev`: Gelistirme sunucusunu baslatir.
- `npm run build`: Production build alir.
- `npm run preview`: Build cikisini localde onizler.
- `npm run lint`: ESLint kurallarini calistirir.
- `npm run security:audit`: Production bagimliliklari icin guvenlik taramasi yapar.
- `npm run check:release`: Lint + Build + Security audit birlikte calisir.

## Proje Yapisi

```text
src/
  actions/       # Redux action creator'lar
  api/           # Axios instance ve API yardimcilari
  components/    # Tekrar kullanilabilir UI bilesenleri
  constants/     # Sabitler
  hooks/         # Custom hook'lar
  i18n/          # Dil metinleri
  layout/        # Header/Footer ve sayfa iskeleti
  pages/         # Route seviyesinde sayfalar
  reducers/      # Redux reducer'lar
  store/         # Store kurulumu
  thunks/        # Asenkron is akislari
  utils/         # Yardimci fonksiyonlar
```

## Sayfalar ve Akis

- `/` Ana sayfa
- `/shop` Magaza
- `/shop/:gender/:categoryName/:categoryId` Kategori bazli liste
- `/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId` Urun detayi
- `/product/:productId` Alternatif urun detay rotasi
- `/signup` Kayit
- `/login` Giris
- `/cart` Sepet
- `/checkout` Siparis olusturma (protected)
- `/orders` Gecmis siparisler (protected)

## API Bilgisi

- Base URL: `https://workintech-fe-ecommerce.onrender.com`
- Auth header formati: `Authorization: <token>` (`Bearer` prefix kullanilmiyor)

## Postman

Postman collection dosyasi:

- `postman/WorkintechFinalProject.postman_collection.json`

Kullanim:

1. Collection'i import et.
2. `baseUrl` degiskenini kontrol et.
3. Login istegi sonrasi `token` degiskenini set et.

## Demo Hesaplar

Sadece demo backend/test amaclidir:

- `customer@commerce.com` / `123456`
- `store@commerce.com` / `123456`
- `admin@commerce.com` / `123456`

## SSS

### Ayni kategori neden birden fazla gorunebiliyor?

Backend tarafinda bazi kategoriler cinsiyete gore ayri kayit olarak tutulur (ornegin kadin/erkek ayni kategori adi). Bu nedenle listede benzer adlar gorulebilir.

---

Bu proje egitim amacli gelistirilmistir.
