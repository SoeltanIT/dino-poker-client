# 📱 Panduan Pengembangan Telegram Mini App

Panduan lengkap untuk mengembangkan aplikasi Telegram Mini App di project Dino Poker Client.

## 📋 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Setup Telegram Bot](#setup-telegram-bot)
3. [Setup Environment Variables](#setup-environment-variables)
4. [Setup Development Local](#setup-development-local)
5. [Testing dengan Telegram Mini App](#testing-dengan-telegram-mini-app)
6. [Arsitektur & Flow](#arsitektur--flow)
7. [API & Hooks](#api--hooks)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Deployment](#deployment)

---

## 🎯 Pendahuluan

Project ini menggunakan **Telegram Mini App** untuk autentikasi dan integrasi dengan Telegram. Aplikasi akan berjalan di dalam Telegram Web App environment dan menggunakan data autentikasi dari Telegram untuk login otomatis.

### Fitur Utama:

- ✅ Autentikasi otomatis melalui Telegram Mini App
- ✅ Integrasi dengan NextAuth untuk session management
- ✅ Cookie management untuk authorization token
- ✅ Telegram Web App API (showAlert, closeApp, dll)
- ✅ TypeScript support dengan `@types/telegram-web-app`

---

## 🤖 Setup Telegram Bot

### 1. Buat Bot melalui BotFather

1. Buka Telegram dan cari **@BotFather**
2. Kirim command `/newbot`
3. Ikuti instruksi untuk membuat bot:
   - Masukkan nama bot (contoh: "Dino Poker Bot")
   - Masukkan username bot (contoh: "dino_poker_bot")
4. BotFather akan memberikan **Bot Token** (simpan token ini!)

### 2. Konfigurasi Bot untuk Mini App

1. Kirim command `/newapp` ke BotFather
2. Pilih bot yang baru dibuat
3. Masukkan informasi Mini App:
   - **Title**: Nama aplikasi (contoh: "Dino Poker")
   - **Short name**: Nama pendek (contoh: "dinopoker")
   - **Description**: Deskripsi aplikasi
   - **Photo**: Upload foto/logo aplikasi
   - **Web App URL**: URL aplikasi Anda (untuk development: `https://your-domain.com` atau gunakan ngrok)

### 3. Dapatkan Bot Token

Bot Token akan terlihat seperti ini:

```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**⚠️ PENTING**: Jangan share token ini ke publik!

---

## ⚙️ Setup Environment Variables

### 1. Buat File `.env.local`

Buat file `.env.local` di root project (copy dari `env.example`):

```bash
cp env.example .env.local
```

### 2. Konfigurasi Environment Variables

Edit file `.env.local` dan isi dengan nilai yang sesuai:

```env
# ==========================================
# NextAuth Configuration
# ==========================================
# Generate secret dengan: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

# URL aplikasi (untuk development gunakan ngrok atau localhost dengan port)
NEXTAUTH_URL=http://localhost:3000

# ==========================================
# Telegram Bot Configuration
# ==========================================
# Token dari BotFather
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# ==========================================
# Backend API URLs
# ==========================================
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
NEXT_PUBLIC_API_TRANS_URL=https://your-transaction-api-url.com
NEXT_PUBLIC_API_PROMOTION_URL=https://your-promotion-api-url.com
```

### 3. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy hasil output dan paste ke `NEXTAUTH_SECRET` di `.env.local`.

---

## 💻 Setup Development Local

### 1. Install Dependencies

Project ini menggunakan `pnpm` sebagai package manager:

```bash
# Install dependencies
pnpm install
```

### 2. Setup Local HTTPS (Opsional tapi Recommended)

Telegram Mini App memerlukan HTTPS untuk production. Untuk development, Anda bisa menggunakan:

#### Opsi A: Ngrok (Recommended untuk Testing)

1. Install ngrok: https://ngrok.com/download
2. Start development server:
   ```bash
   pnpm dev
   ```
3. Di terminal lain, jalankan ngrok:
   ```bash
   ngrok http 3000
   ```
4. Copy URL HTTPS dari ngrok (contoh: `https://abc123.ngrok.io`)
5. Update `.env.local`:
   ```env
   NEXTAUTH_URL=https://abc123.ngrok.io
   ```
6. Update Bot Mini App URL di BotFather dengan URL ngrok

#### Opsi B: Localhost dengan Self-Signed Certificate

Untuk development, Telegram juga bisa menerima localhost dengan beberapa konfigurasi tambahan.

### 3. Run Development Server

```bash
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

---

## 🧪 Testing dengan Telegram Mini App

### Method 1: Testing via Telegram Desktop/Web

1. **Setup Bot di BotFather**:

   - Pastikan Mini App URL sudah dikonfigurasi
   - Gunakan ngrok URL jika testing local

2. **Buka Bot di Telegram**:

   - Cari bot Anda di Telegram
   - Klik tombol "Menu" atau "Web App" di bot

3. **Test Flow**:
   - Mini App akan terbuka
   - Autentikasi otomatis akan terjadi
   - Check console browser untuk logs

### Method 2: Testing dengan Telegram Web App Simulator

Karena Telegram Mini App memerlukan environment Telegram, untuk development biasa Anda bisa:

1. **Simulasikan Telegram WebApp** di browser console:

   ```javascript
   // Simulasi Telegram WebApp untuk testing
   window.Telegram = {
     WebApp: {
       initData: 'test_data',
       initDataUnsafe: {
         user: {
           id: 123456789,
           first_name: 'Test',
           last_name: 'User',
           username: 'testuser',
           language_code: 'en'
         },
         auth_date: Math.floor(Date.now() / 1000),
         hash: 'test_hash'
       },
       ready: () => {},
       expand: () => {},
       close: () => {},
       showAlert: (message, callback) => {
         alert(message)
         if (callback) callback()
       }
     }
   }
   ```

2. **Reload halaman** setelah menjalankan script di atas

### Method 3: Test di Mobile Telegram

1. Deploy aplikasi ke staging/production
2. Buka bot di Telegram mobile app
3. Klik tombol Mini App
4. Test semua flow autentikasi dan fitur

---

## 🏗️ Arsitektur & Flow

### Komponen Utama

```
src/
├── components/
│   └── providers/
│       └── TelegramMiniApp.tsx    # Provider utama untuk Telegram Mini App
├── lib/
│   └── authOptions.ts             # NextAuth config dengan Telegram provider
└── app/
    └── [lang]/
        └── layout.tsx             # Layout dengan Telegram script
```

### Flow Autentikasi

```
1. User membuka Mini App di Telegram
   ↓
2. Telegram WebApp script load (di layout.tsx)
   ↓
3. TelegramMiniAppProvider detect window.Telegram
   ↓
4. initTelegramMiniApp() dipanggil
   ↓
5. Ambil initData dari window.Telegram.WebApp
   ↓
6. Sign in dengan NextAuth provider 'telegram'
   ↓
7. authOptions.ts verify Telegram data
   ↓
8. POST ke backend API /v1/login dengan telegram data
   ↓
9. Backend return JWT token
   ↓
10. Token disimpan di cookie dan session
   ↓
11. User authenticated dan bisa akses aplikasi
```

### File-File Penting

#### 1. `TelegramMiniApp.tsx`

Provider yang meng-handle:

- Inisialisasi Telegram Mini App
- Autentikasi otomatis
- Context untuk hooks (`useTelegramMiniApp`)
- Cookie management

#### 2. `authOptions.ts`

NextAuth configuration dengan:

- Credentials provider untuk login biasa
- Telegram provider untuk Mini App auth
- JWT callbacks
- Session management

#### 3. `layout.tsx`

Layout utama yang:

- Load Telegram WebApp script
- Wrap aplikasi dengan Providers

---

## 🔌 API & Hooks

### Hook: `useTelegramMiniApp()`

Hook untuk mengakses Telegram Mini App functionality:

```typescript
import { useTelegramMiniApp } from '@/components/providers/TelegramMiniApp'

function MyComponent() {
  const { isMiniAppLoaded, showAlert, closeApp } = useTelegramMiniApp()

  // Check jika Mini App sudah loaded
  if (!isMiniAppLoaded) {
    return <div>Loading...</div>
  }

  // Show alert
  const handleAlert = async () => {
    await showAlert('Hello from Mini App!')
  }

  // Close app
  const handleClose = () => {
    closeApp()
  }

  return (
    <div>
      <button onClick={handleAlert}>Show Alert</button>
      <button onClick={handleClose}>Close App</button>
    </div>
  )
}
```

### API Methods

#### `showAlert(message: string): Promise<void>`

Menampilkan alert menggunakan Telegram WebApp API.

```typescript
await showAlert('This is an alert message')
```

#### `closeApp(): void`

Menutup Mini App.

```typescript
closeApp()
```

### Direct Telegram WebApp API

Anda juga bisa mengakses Telegram WebApp API langsung:

```typescript
// Check jika di Telegram environment
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  const webApp = window.Telegram.WebApp

  // Expand app
  webApp.expand()

  // Set theme
  webApp.setHeaderColor('#000000')
  webApp.setBackgroundColor('#ffffff')

  // Get user data
  const user = webApp.initDataUnsafe.user

  // Enable closing confirmation
  webApp.enableClosingConfirmation()

  // Listen to events
  webApp.onEvent('viewportChanged', () => {
    console.log('Viewport changed')
  })
}
```

### Type Definitions

Type definitions tersedia melalui `@types/telegram-web-app`:

```typescript
import { WebApp } from '@twa-dev/types'

// Type-safe access
const webApp: WebApp = window.Telegram.WebApp
```

---

## 🐛 Troubleshooting

### Problem 1: `window.Telegram is undefined`

**Penyebab**: Telegram WebApp script belum load atau tidak di environment Telegram.

**Solusi**:

1. Pastikan script sudah di-load di `layout.tsx`:
   ```tsx
   <script defer src='https://telegram.org/js/telegram-web-app.js?59' />
   ```
2. Check apakah aplikasi dibuka di Telegram
3. Untuk development, gunakan simulasi (lihat Testing Method 2)

### Problem 2: Autentikasi gagal

**Penyebab**:

- Bot token tidak valid
- Backend API tidak bisa verify Telegram data
- Hash verification gagal

**Solusi**:

1. Check `TELEGRAM_BOT_TOKEN` di `.env.local`
2. Check console untuk error messages
3. Verify backend API endpoint `/v1/login` berfungsi
4. Check network tab untuk request/response

### Problem 3: Cookie tidak tersimpan

**Penyebab**: Cookie policy atau SameSite settings.

**Solusi**:

1. Check cookie settings di `TelegramMiniApp.tsx`:
   ```typescript
   setCookie('_authorization', token, {
     path: '/',
     secure: true, // Harus true untuk HTTPS
     sameSite: 'lax',
     maxAge: 60 * 60 * 24
   })
   ```
2. Pastikan menggunakan HTTPS (ngrok untuk local)

### Problem 4: Session tidak persist

**Penyebab**: NEXTAUTH_SECRET tidak valid atau session expired.

**Solusi**:

1. Generate ulang `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
2. Update `.env.local` dengan secret baru
3. Restart development server
4. Clear cookies dan login ulang

### Problem 5: CORS Error

**Penyebab**: Backend API tidak allow origin dari Mini App.

**Solusi**:

1. Pastikan backend API allow CORS dari domain Mini App
2. Check `Access-Control-Allow-Origin` header
3. Untuk development, bisa temporary disable CORS check

### Problem 6: Ngrok URL berubah setiap restart

**Solusi**:

1. Gunakan ngrok dengan domain tetap (ngrok paid plan)
2. Atau gunakan alternatif seperti localtunnel:
   ```bash
   npx localtunnel --port 3000
   ```

---

## ✅ Best Practices

### 1. Error Handling

Selalu handle error dengan baik:

```typescript
try {
  await initTelegramMiniApp()
} catch (err) {
  console.error('[Telegram.MiniApp]:', err)
  // Show user-friendly error message
  showAlert('Failed to initialize. Please try again.')
}
```

### 2. Check Environment

Selalu check apakah di Telegram environment:

```typescript
const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp

if (isTelegram) {
  // Telegram-specific code
} else {
  // Fallback for web browser
}
```

### 3. Loading States

Gunakan `isMiniAppLoaded` untuk handle loading:

```typescript
const { isMiniAppLoaded } = useTelegramMiniApp()

if (!isMiniAppLoaded) {
  return <LoadingSpinner />
}
```

### 4. Type Safety

Gunakan TypeScript types untuk type safety:

```typescript
import { WebApp } from '@twa-dev/types'

if (window.Telegram?.WebApp) {
  const webApp: WebApp = window.Telegram.WebApp
  // Type-safe access
}
```

### 5. Security

- **Jangan** expose `TELEGRAM_BOT_TOKEN` di client-side code
- **Selalu** verify Telegram data di backend
- **Gunakan** HTTPS untuk production
- **Validate** semua data dari Telegram sebelum digunakan

### 6. Performance

- Lazy load components yang tidak critical
- Optimize images dan assets
- Use Next.js Image component
- Implement proper caching

### 7. User Experience

- Show loading states
- Handle offline scenarios
- Provide clear error messages
- Use Telegram native UI components ketika memungkinkan

---

## 🚀 Deployment

### 1. Production Environment Variables

Pastikan semua environment variables sudah di-set di hosting platform:

```env
NEXTAUTH_SECRET=<production-secret>
NEXTAUTH_URL=https://your-production-domain.com
TELEGRAM_BOT_TOKEN=<production-bot-token>
NEXT_PUBLIC_API_BASE_URL=<production-api-url>
# ... other variables
```

### 2. Update Bot Mini App URL

1. Buka BotFather di Telegram
2. Kirim `/myapps`
3. Pilih bot Anda
4. Edit Mini App
5. Update **Web App URL** ke production domain

### 3. Build & Deploy

```bash
# Build production
pnpm build

# Test production build locally
pnpm start

# Deploy ke hosting platform (Vercel, Netlify, dll)
# Ikuti instruksi dari platform hosting Anda
```

### 4. Post-Deployment Checklist

- [ ] Test autentikasi di Telegram Mini App
- [ ] Verify semua API calls berfungsi
- [ ] Check console untuk errors
- [ ] Test di berbagai device (mobile, desktop)
- [ ] Verify HTTPS certificate valid
- [ ] Check analytics dan monitoring

---

## 📚 Resources

### Official Documentation

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [NextAuth.js Documentation](https://next-auth.js.org/)

### Tools

- [Ngrok](https://ngrok.com/) - HTTPS tunneling untuk local development
- [BotFather](https://t.me/BotFather) - Telegram bot creation tool
- [Telegram Web App Simulator](https://core.telegram.org/bots/webapps#testing-mini-apps)

### Type Definitions

- [`@types/telegram-web-app`](https://www.npmjs.com/package/@types/telegram-web-app)

---

## 📝 Notes

- **Development**: Gunakan ngrok atau localtunnel untuk HTTPS
- **Production**: Pastikan HTTPS certificate valid
- **Testing**: Simulasi Telegram WebApp untuk development tanpa Telegram
- **Security**: Jangan commit `.env.local` ke git
- **Debugging**: Check browser console dan network tab untuk troubleshooting

---

## 🆘 Support

Jika mengalami masalah:

1. Check console untuk error messages
2. Review troubleshooting section
3. Check Telegram Mini Apps documentation
4. Verify environment variables
5. Test dengan simulator terlebih dahulu

---

**Last Updated**: 2024
**Version**: 1.0.0
