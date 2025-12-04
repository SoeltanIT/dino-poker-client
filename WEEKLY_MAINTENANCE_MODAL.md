# Weekly Maintenance Modal - Dokumentasi

## 📋 Ringkasan

Modal popup yang ditampilkan secara otomatis setiap minggu dari **Rabu jam 00:01** sampai **Kamis jam 12:00** untuk menginformasikan pengguna tentang jadwal maintenance mingguan.

## 🎯 Fitur Utama

1. **Jadwal Otomatis**: Modal muncul otomatis berdasarkan waktu sistem

   - Mulai: Rabu jam 00:01
   - Selesai: Kamis jam 12:00

2. **Opsi "Jangan Tampilkan Hari Ini"**:

   - Pengguna dapat memilih untuk tidak melihat modal sampai hari berikutnya
   - Preferensi disimpan di localStorage

3. **Bilingual Support**:

   - Bahasa Korea (ko)
   - Bahasa Inggris (en)

4. **Responsive Design**:
   - Mobile: max-width 90vw
   - Desktop: max-width 500px

## 📁 File yang Dibuat/Dimodifikasi

### File Baru:

1. `/src/components/organisms/WeeklyMaintenanceModal/index.tsx` - Komponen utama modal
2. `/src/components/organisms/WeeklyMaintenanceModal/README.md` - Dokumentasi komponen

### File yang Dimodifikasi:

1. `/src/components/templates/App/AppWrapper/index.tsx` - Menambahkan import dan render modal

### Asset yang Digunakan:

- `/public/images/banner-mt.avif` - Gambar banner maintenance (sudah ada)

## 🔧 Implementasi

### 1. Komponen Modal

Komponen `WeeklyMaintenanceModal` menggunakan:

- **Dialog** dari `@/components/ui/dialog` untuk modal base
- **Image** dari Next.js untuk optimasi gambar
- **localStorage** untuk menyimpan preferensi user

### 2. Logika Jadwal

```typescript
// Cek hari dan waktu
const now = new Date()
const day = now.getDay() // 0 = Sunday, 3 = Wednesday, 4 = Thursday
const hours = now.getHours()
const minutes = now.getMinutes()

// Tampilkan jika:
// - Rabu (day 3) dari jam 00:01 onwards
// - Kamis (day 4) sebelum jam 12:00
```

### 3. localStorage Key

- **Key**: `hideMaintenanceUntil`
- **Value**: ISO timestamp string
- **Fungsi**: Menyimpan waktu sampai kapan modal tidak ditampilkan

## 🎨 Styling

Modal menggunakan:

- **Background**: Gradient purple (from-purple-200 to-purple-100)
- **Border Radius**: rounded-2xl
- **Shadow**: shadow-2xl
- **Buttons**:
  - "Jangan Tampilkan Hari Ini": White background dengan purple text
  - "Tutup": Yellow gradient dengan purple text

## 📱 Tampilan

Modal menampilkan:

1. **Close button (X)** di pojok kanan atas
2. **Banner image** dari `/images/banner-mt.avif`
3. **Dua tombol** di bagian bawah:
   - Tombol kiri: "오늘 하루 보지 않기" / "Don't show today"
   - Tombol kanan: "닫기" / "Close"

## 🚀 Cara Penggunaan

Modal sudah terintegrasi dan akan muncul otomatis. Tidak perlu konfigurasi tambahan.

### Testing Manual

Untuk testing, Anda bisa mengubah logika waktu di file:
`/src/components/organisms/WeeklyMaintenanceModal/index.tsx`

Contoh untuk testing (tampilkan selalu):

```typescript
useEffect(() => {
  setIsOpen(true) // Force open untuk testing
}, [])
```

### Menghapus Preferensi User

Jika ingin reset preferensi "Jangan Tampilkan Hari Ini":

```javascript
localStorage.removeItem('hideMaintenanceUntil')
```

## 🔍 Troubleshooting

### Modal tidak muncul?

1. Cek apakah hari dan waktu sesuai jadwal (Rabu 00:01 - Kamis 12:00)
2. Cek localStorage apakah ada key `hideMaintenanceUntil`
3. Cek console browser untuk error

### Gambar tidak muncul?

1. Pastikan file `/public/images/banner-mt.avif` ada
2. Cek network tab di browser developer tools

### Tombol tidak berfungsi?

1. Cek console untuk JavaScript errors
2. Pastikan localStorage tidak di-block oleh browser

## 📝 Catatan

- Modal menggunakan `'use client'` directive karena menggunakan hooks dan browser APIs
- Timezone mengikuti sistem user (local time)
- Modal tidak akan muncul jika user sudah memilih "Jangan Tampilkan Hari Ini"

## 🔄 Update Future

Jika ingin mengubah jadwal:

1. Edit logika di fungsi `checkMaintenanceSchedule()`
2. Ubah kondisi `day` dan `hours` sesuai kebutuhan

Contoh untuk Senin 10:00 - Selasa 14:00:

```typescript
if (day === 1 && hours >= 10) {
  return true
} else if (day === 2 && hours < 14) {
  return true
}
```
