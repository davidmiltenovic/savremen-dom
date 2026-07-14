# Savremen Dom - Premium Real Estate Platform

Premium real estate platform za agenciju Savremen Dom sa admin panelom i javnim frontend-om.

## Dizajn

Aplikacija koristi svetlu temu sa bojama iz brenda:
- Zelena (#5F9234) - primarna boja za akcije i akcente
- Žuta (#F1C543) - sekundarni akcent
- Roze (#CC2B7A) - akcent
- Plava (#9AD0EE) - info/light akcent
- Pozadina (#EEEEEE) - svetlo siva pozadina

## Karakteristike

### Admin Panel
- **Dashboard** - Pregled statistike i najgledanijih oglasa
- **Property Management** - CRUD za nekretnine sa collapsible sekcijama
- **Lead Management** - Mini CRM sistem za upravljanje upitima
- **Brz unos** - Optimizovano za unos oglasa u manje od 2 minuta

### Javni Frontend
- **Homepage** - Hero sekcija, istaknuti i najnoviji oglasi
- **Search** - Napredna pretraga sa filterima
- **Property Detail** - Detaljan prikaz nekretnine sa lightbox galerijom
- **Contact Form** - Direktan kontakt sa agencijom

## Tehnologije

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Database + Auth)
- Lucide React (Icons)

## Pokretanje projekta

```bash
npm install
npm run dev
```

## Kreiranje Admin korisnika

Kako bi mogli da pristupite admin panelu, potrebno je da kreirate admin korisnika u Supabase bazi.

### 1. Kreiraj korisnika preko Supabase Auth

1. Idite na [Supabase Dashboard](https://app.supabase.com)
2. Otvorite vaš projekat
3. Idite na **Authentication** → **Users**
4. Kliknite **Add user** → **Create new user**
5. Unesite email i lozinku
6. Sačuvajte User ID koji se prikaže

### 2. Dodaj profil u bazu

U Supabase SQL Editor izvršite sledeću komandu:

```sql
INSERT INTO profiles (id, email, full_name, role, phone)
VALUES (
  'USER_ID_OVDE',  -- Zamenite sa User ID iz prethodnog koraka
  'admin@admin.com',
  'Admin User',
  'super_admin',
  '+381111234567'
);
```

### 3. Prijavite se

Idite na `/admin/login` i prijavite se sa email-om i lozinkom.

## Admin URLs

- `/admin/login` - Login stranica
- `/admin` - Dashboard
- `/admin/properties` - Lista nekretnina
- `/admin/properties/new` - Dodaj novi oglas
- `/admin/leads` - Upravljanje upitima

## Javni URLs

- `/` - Homepage
- `/search` - Pretraga nekretnina
- `/property/:slug` - Detalji nekretnine
- `/contact` - Kontakt forma

## Database Schema

Baza sadrži sledeće tabele:

- **profiles** - Korisnici sa rolama (super_admin, agent)
- **properties** - Nekretnine sa svim detaljima
- **property_images** - Slike za nekretnine
- **leads** - Upiti korisnika

## Build

```bash
npm run build
```

Build verzija će biti kreirana u `dist` folderu.

## Napomene

- Sve slike trenutno koriste placeholder-e sa Pexels
- Mapa funkcionalnost je placeholder
- Auto-generisanje šifre oglasa (SD-XXXXXX)
- Auto-kalkulacija cene po m²
- Row Level Security (RLS) omogućen na svim tabelama
