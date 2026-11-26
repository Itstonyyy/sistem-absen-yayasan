import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

async function main() {
  try {
    // Hash password
    const password = 'admin123';
    const passwordHash = await hashPassword(password);

    // Create admin user
    const admin = await db.employee.create({
      data: {
        nip: 'ADMIN-001',
        name: 'Admin Utama',
        email: 'almaghfirah@bpjsketenagakerjaan.go.id',
        passwordHash,
        role: 'admin',
        jabatan: 'Administrator',
        isActive: true,
        avatarColor: 'blue',
      },
    });

    console.log('✅ Admin account created:');
    console.log('  Email: almaghfirah@bpjsketenagakerjaan.go.id');
    console.log('  Password: admin123');
    console.log('  Role: admin');
    console.log('  NIP: ADMIN-001');
    console.log('  ID: ' + admin.id);

    // Create default schedule
    await db.workSchedule.create({
      data: {
        namaJadwal: 'Jadwal Kerja Default',
        jamMasuk: '08:00',
        jamPulang: '17:00',
        toleransiTerlambat: 15,
        hariKerja: 'Senin - Jumat',
        isDefault: true,
      },
    });

    console.log('✅ Default work schedule created');

    // Create GPS location for office
    await db.gpsLocation.create({
      data: {
        nama: 'Kantor Pusat',
        latitude: -6.2087634,
        longitude: 106.8455984,
        radius: 100,
        isActive: true,
      },
    });

    console.log('✅ Office GPS location created');

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log('Seeding completed');
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });