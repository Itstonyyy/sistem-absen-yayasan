import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Simple password hashing utility (SHA-256 for demonstration, use bcrypt in production)
function simpleHashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Generate consistent seed ID based on input
function generateSeedId(seed: string): string {
  return `seed_${seed}`
}

async function main() {
  console.log('🌱 Seeding database...')

  // Create main administrator with default password 'Admin123!'
  const admin = await prisma.employee.upsert({
    where: { email: 'admin@almaghfirah.or.id' },
    update: {},
    create: {
      nip: 'YAM-0000',
      name: 'Super Admin',
      email: 'admin@almaghfirah.or.id',
      passwordHash: simpleHashPassword('Admin123!'),
      role: 'admin',
      jabatan: 'Administrator',
      telepon: '0851 1234 5678',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Jakarta',
      tanggalLahir: new Date('1990-01-01'),
    }
  })
  console.log('✅ Admin user created/updated: Super Admin (admin@almaghfirah.or.id)')

  // Create GPS locations
  await prisma.gpsLocation.upsert({
    where: { nama: 'Kantor Utama' },
    update: { latitude: -6.2163, longitude: 106.8231, radius: 100 },
    create: { nama: 'Kantor Utama', latitude: -6.2163, longitude: 106.8231, radius: 100, isActive: true },
  })
  await prisma.gpsLocation.upsert({
    where: { nama: 'Rumah Karyawan 1' },
    update: { latitude: -6.2168, longitude: 106.8229, radius: 50 },
    create: { nama: 'Rumah Karyawan 1', latitude: -6.2168, longitude: 106.8229, radius: 50, isActive: true },
  })
  await prisma.gpsLocation.upsert({
    where: { nama: 'Rumah Karyawan 2' },
    update: { latitude: -6.2170, longitude: 106.8232, radius: 50 },
    create: { nama: 'Rumah Karyawan 2', latitude: -6.2170, longitude: 106.8232, radius: 50, isActive: true },
  })
  console.log('✅ GPS locations created')

  // Create work schedules
  const defaultSchedules = [
    { namaJadwal: 'Jadwal Kerja Global', jamMasuk: '08:00', jamPulang: '17:00', toleransiTerlambat: 15, hariKerja: 'Senin - Jumat', isDefault: true },
    { namaJadwal: 'Jadwal Lembur', jamMasuk: '19:00', jamPulang: '21:00', toleransiTerlambat: 30, hariKerja: 'Senin - Jumat', isDefault: false },
  ]

  for (const schedule of defaultSchedules) {
    await prisma.workSchedule.upsert({
      where: { namaJadwal: schedule.namaJadwal },
      update: { ...schedule },
      create: { ...schedule },
    })
  }
  console.log('✅ Work schedules created')

  // Clear existing holidays before seeding
  await prisma.holiday.deleteMany()

  const routineHoliday = await prisma.holiday.create({
    data: {
      nama: 'Libur Rutin Mingguan (Sabtu & Minggu)',
      tanggalMulai: new Date('2026-01-01'),
      tanggalSelesai: new Date('2026-12-31'),
      jenis: 'rutin',
      keterangan: 'Libur rutin akhir pekan setiap Sabtu dan Minggu'
    }
  })
  console.log('✅ Holidays created:', routineHoliday.nama, routineHoliday.jenis)

  // Create initial quiz questions (based on frontend mock data)
  const quizzes = [
    { pertanyaan: 'Pada tahun berapa Hijriah dimulai?', opsiA: '622 M', opsiB: '632 M', opsiC: '642 M', opsiD: '652 M', kunci: 'A', pembahasan: 'Kalender Hijriah dimulai pada tahun 622 M, bertepatan dengan peristiwa Hijrah Nabi Muhammad SAW dari Mekkah ke Madinah.', status: 'aktif' },
    { pertanyaan: 'Siapakah khalifah pertama dalam sejarah Islam?', opsiA: 'Umar bin Khattab', opsiB: 'Utsman bin Affan', opsiC: 'Abu Bakar Ash-Shiddiq', opsiD: 'Ali bin Abi Thalib', kunci: 'C', pembahasan: 'Abu Bakar Ash-Shiddiq adalah khalifah pertama yang dipilih oleh umat Islam setelah wafatnya Nabi Muhammad SAW.', status: 'aktif' },
    { pertanyaan: 'Pertempuran pertama dalam sejarah Islam adalah?', opsiA: 'Perang Badar', opsiB: 'Perang Uhud', opsiC: 'Perang Khandaq', opsiD: 'Perang Hunain', kunci: 'A', pembahasan: 'Perang Badar terjadi pada tahun 2 Hijriah (624 M) dan merupakan pertempuran besar pertama umat Islam.', status: 'aktif' },
    { pertanyaan: 'Al-Quran pertama kali diturunkan di gua?', opsiA: 'Tsur', opsiB: 'Hira', opsiC: 'Uhud', opsiD: 'Badr', kunci: 'B', pembahasan: 'Wahyu Al-Quran pertama kali diturunkan kepada Nabi Muhammad SAW di Gua Hira, Jabal Nur, Mekkah.', status: 'aktif' },
    { pertanyaan: 'Kota Madinah dahulu bernama?', opsiA: 'Yatsrib', opsiB: 'Thaif', opsiC: 'Khaibar', opsiD: 'Fadak', kunci: 'A', pembahasan: 'Kota Madinah sebelumnya bernama Yatsrib, kemudian diubah menjadi Madinah an-Nabi (Kota Nabi) setelah Hijrah.', status: 'nonaktif' },
  ]

  for (const quiz of quizzes) {
    await prisma.quiz.upsert({
      where: { pertanyaan: quiz.pertanyaan },
      update: {},
      create: { ...quiz },
    })
  }
  console.log('✅ Quiz questions created')

  console.log('🌱 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })