# 🚀 Quick Start Guide - Telegram Mini App

Panduan cepat untuk memulai development Telegram Mini App.

## ⚡ Quick Setup (5 Menit)

### 1. Setup Bot (2 menit)

```bash
# 1. Buka Telegram, cari @BotFather
# 2. Kirim /newbot
# 3. Ikuti instruksi, dapatkan Bot Token
# 4. Kirim /newapp, setup Mini App
```

### 2. Setup Environment (1 menit)

```bash
# Copy env.example
cp env.example .env.local

# Edit .env.local, isi:
# - TELEGRAM_BOT_TOKEN=<token-dari-botfather>
# - NEXTAUTH_SECRET=<generate-dengan-openssl-rand-base64-32>
# - NEXTAUTH_URL=http://localhost:3000
```

### 3. Install & Run (1 menit)

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev
```

### 4. Setup Ngrok (1 menit)

```bash
# Di terminal baru
ngrok http 3000

# Copy URL HTTPS (contoh: https://abc123.ngrok.io)
# Update .env.local:
# NEXTAUTH_URL=https://abc123.ngrok.io

# Update Bot Mini App URL di BotFather dengan URL ngrok
```

### 5. Test

1. Buka bot di Telegram
2. Klik tombol Mini App
3. Aplikasi akan terbuka dan auto-login!

---

## 🔧 Development Workflow

### Daily Development

```bash
# 1. Start dev server
pnpm dev

# 2. Start ngrok (jika perlu test di Telegram)
ngrok http 3000

# 3. Update NEXTAUTH_URL jika ngrok URL berubah
# 4. Code, test, repeat!
```

### Testing Locally (Tanpa Telegram)

Tambahkan script ini di browser console untuk simulasi:

```javascript
// Simulasi Telegram WebApp
window.Telegram = {
  WebApp: {
    initData: 'test',
    initDataUnsafe: {
      user: {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      },
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'test_hash'
    },
    ready: () => {},
    expand: () => {},
    close: () => {},
    showAlert: (msg, cb) => { alert(msg); if(cb) cb(); }
  }
};
// Reload halaman setelah ini
```

---

## 📋 Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build production
pnpm start            # Start production server
pnpm lint             # Run linter

# Generate secrets
openssl rand -base64 32  # Generate NEXTAUTH_SECRET
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `window.Telegram undefined` | Pastikan script di-load, atau gunakan simulasi |
| Auth gagal | Check `TELEGRAM_BOT_TOKEN` dan backend API |
| Cookie tidak tersimpan | Gunakan HTTPS (ngrok) |
| Ngrok URL berubah | Update `NEXTAUTH_URL` dan Bot Mini App URL |

---

## 📖 Next Steps

- Baca [TELEGRAM_MINI_APP_DEVELOPMENT_GUIDE.md](./TELEGRAM_MINI_APP_DEVELOPMENT_GUIDE.md) untuk detail lengkap
- Explore hooks dan API di `src/components/providers/TelegramMiniApp.tsx`
- Check NextAuth config di `src/lib/authOptions.ts`

---

**Happy Coding! 🎉**

