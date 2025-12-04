# Weekly Maintenance Modal

Modal yang ditampilkan setiap minggu dari hari Rabu jam 00:01 sampai Kamis jam 12:00.

## Fitur

- **Jadwal Otomatis**: Modal akan muncul otomatis pada waktu yang ditentukan (Rabu 00:01 - Kamis 12:00)
- **"Jangan Tampilkan Hari Ini"**: User dapat memilih untuk tidak melihat modal sampai hari berikutnya
- **Responsive**: Desain yang menyesuaikan dengan ukuran layar mobile dan desktop
- **Bilingual**: Mendukung bahasa Korea dan Inggris

## Penggunaan

Komponen ini sudah diintegrasikan ke dalam `AppWrapper` dan akan muncul secara otomatis.

```tsx
<WeeklyMaintenanceModal locale={locale} />
```

## Props

- `locale` (optional): Bahasa yang digunakan ('ko' atau 'en')

## Gambar

Modal menggunakan gambar dari `/images/banner-mt.avif`

## Storage

Komponen menggunakan `localStorage` untuk menyimpan preferensi user:

- Key: `hideMaintenanceUntil`
- Value: ISO timestamp untuk kapan modal boleh ditampilkan lagi
