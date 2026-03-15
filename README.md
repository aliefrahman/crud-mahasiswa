# Aplikasi CRUD Data Mahasiswa

Aplikasi web CRUD (Create, Read, Update, Delete) sederhana untuk manajemen data mahasiswa, dibangun menggunakan **Node.js, Express.js**, dan **Supabase**. Dilengkapi dengan desain premium berbasis *glassmorphism* dan *Dark Mode* modern.

## Fitur
* Menampilkan daftar data mahasiswa terdaftar
* Menambah mahasiswa baru
* Mengubah data mahasiswa
* Menghapus data mahasiswa
* Responsif & antarmuka premium (Modern Vanilla CSS)

## Persyaratan
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (Versi 16 ke atas direkomendasikan)
* Akun [Supabase](https://supabase.com/)

## Persiapan Supabase Database
1. Buat project baru di [Supabase](https://supabase.com/).
2. Buka menu **SQL Editor**.
3. Jalankan query berikut untuk membuat tabel `mahasiswa`:

```sql
CREATE TABLE mahasiswa (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nim text NOT NULL UNIQUE,
  nama text NOT NULL,
  jurusan text NOT NULL,
  angkatan integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

4. Buka menu **Project Settings -> API**.
5. Salin URL project dan `anon` public key Anda.

## Instalasi & Cara Menjalankan

1. Masuk ke direktori project:
   ```bash
   cd /var/www/html/crud-mahasiswa
   ```

2. Instal semua dependencies:
   ```bash
   npm install
   ```

3. Ganti nama file `.env.example` menjadi `.env`:
   ```bash
   mv .env.example .env
   ```

4. Buka file `.env` dan masukkan konfigurasi Supabase Anda:
   ```env
   PORT=3000
   SUPABASE_URL=https://<your-project-url>.supabase.co
   SUPABASE_KEY=<your-anon-key>
   ```

5. Jalankan aplikasi:
   * **Mode Development (auto-restart dengan nodemon):**
     ```bash
     npm run dev
     ```
   * **Mode Production:**
     ```bash
     npm start
     ```

6. Buka browser Anda dan akses aplikasi di: [http://localhost:3000](http://localhost:3000)
