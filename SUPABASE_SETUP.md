# 🚀 Kampoeng Steak ERP - Supabase Setup Guide

## 📋 Panduan Setup Database Supabase

Ikuti langkah-langkah berikut untuk setup database Supabase untuk sistem ERP Kampoeng Steak:

---

## 1️⃣ Buat Project Supabase (GRATIS)

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"** atau **"Sign up"**
3. Login dengan GitHub, Google, atau email
4. Klik **"New Project"**
5. Isi form:
   - **Organization**: Pilih atau buat organization baru
   - **Project Name**: `kampoeng-steak-erp`
   - **Database Password**: Buat password yang kuat (simpan dengan aman!)
   - **Region**: Pilih region terdekat (contoh: `Singapore (South East Asia)`)
6. Klik **"Create new project"**
7. Tunggu ~2 menit hingga project siap

---

## 2️⃣ Copy API Keys

1. Setelah project siap, buka **Settings** (icon gear di sidebar kiri)
2. Klik **API** di menu kiri
3. Copy 2 keys berikut:
   - **Project URL** → `https://xxxxxxxxxxxxxxxx.supabase.co`
   - **anon public** key → `eyJh...` (key panjang)

---

## 3️⃣ Setup Environment Variables

1. Buat file `.env.local` di root project Anda (jika belum ada)
2. Paste keys yang sudah dicopy:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ PENTING**: Ganti `your-project` dan `your-anon-key-here` dengan API keys Anda yang sebenarnya!

---

## 4️⃣ Jalankan SQL Schema

1. Di dashboard Supabase, buka **SQL Editor** (icon database di sidebar kiri)
2. Klik **"New query"**
3. Copy **SEMUA isi file** `src/lib/supabase/schema.sql` (562 baris)
4. Paste ke SQL Editor
5. Klik **"Run"** (tombol play hijau di kanan atas)
6. Tunggu hingga muncul **"Success. No rows returned"**

**✅ Database sekarang berisi:**
- 17 tabel (outlets, employees, products, dll)
- 286+ data dummy siap pakai!
- Row Level Security (RLS) policies
- Indexes untuk performa optimal

---

## 5️⃣ Verifikasi Data Dummy

1. Di Supabase dashboard, buka **Table Editor** (icon table di sidebar)
2. Klik tabel **"outlets"** → Harus ada 18 outlets
3. Klik tabel **"employees"** → Harus ada 50 karyawan
4. Klik tabel **"sales"** → Harus ada 30 transaksi
5. Klik tabel lainnya untuk verifikasi data dummy

---

## 6️⃣ Jalankan Aplikasi

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000)

**✅ Aplikasi sekarang terhubung ke Supabase!**

---

## 📊 Data Dummy yang Tersedia (286+ Records)

| Tabel | Jumlah Data | Keterangan |
|-------|-------------|------------|
| **outlets** | 18 | Outlet di Jakarta, Bandung, Surabaya, dll |
| **employees** | 50 | Manager, Koki, Kasir, Waiter |
| **products** | 10 | Steak Wagyu, Sirloin, Chicken, dll |
| **ingredients** | 20 | Daging, Kentang, Tomat, dll + status stok |
| **sales** | 30 | Transaksi dengan berbagai payment methods |
| **suppliers** | 5 | Supplier bahan baku dengan rating |
| **purchase_orders** | 15 | PO dengan status Pending/Approved/Rejected |
| **distributions** | 10 | Transfer stok antar outlet |
| **daily_checklists** | 18 | Checklist harian per outlet |
| **shift_reports** | 10 | Laporan shift kasir |
| **candidates** | 15 | Kandidat rekrutmen dengan status |
| **promotions** | 5 | Program promo dengan periode |
| **assets** | 30 | Kompor, Kulkas, AC, dll per outlet |
| **cash_flow** | 50 | Pemasukan & pengeluaran |
| **users** | 1 | Admin pusat |

**Total: 286+ records!** 🎉

---

## 🔧 Troubleshooting

### Error: "Supabase not configured"
✅ Pastikan file `.env.local` ada di root project  
✅ Pastikan API keys sudah benar  
✅ Restart server dengan `npm run dev`

### Error: "relation does not exist"
✅ Jalankan SQL schema di SQL Editor  
✅ Pastikan semua 562 baris di-run  
✅ Check di Table Editor apakah tabel sudah ada

### Data dummy tidak muncul
✅ Check di Supabase Table Editor apakah data ada  
✅ Pastikan RLS policies sudah di-enable  
✅ Refresh browser dengan Ctrl+F5

### Connection timeout
✅ Check internet connection  
✅ Pastikan Supabase URL benar  
✅ Check status Supabase di [status.supabase.com](https://status.supabase.com)

---

## 🎯 Fitur Real-time

Supabase menyediakan real-time subscriptions secara otomatis!

**Yang bisa dilakukan:**
- Tambah outlet baru → Langsung muncul di semua user
- Update stok bahan → Semua kasir melihat update real-time
- Approve PO → Area manager langsung ternotifikasi
- **Tidak perlu refresh manual!** 🚀

---

## 🔐 Production Security

Untuk production, update RLS policies di Supabase:

1. Buka **Authentication** → Setup user authentication
2. Buka **Database** → **Policies** → Update policies
3. Contoh policy untuk outlet manager:

```sql
-- Hanya bisa lihat outlet sendiri
CREATE POLICY "Outlet manager can only see their outlet"
ON outlets FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM users WHERE outlet_id = outlets.id
));
```

---

## 📚 Resource Tambahan

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🆘 Butuh Bantuan?

- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
- Email: support@supabase.io

---

**Selamat! Sistem ERP Kampoeng Steak siap mengelola 18 outlet dengan database real-time!** 🎊
