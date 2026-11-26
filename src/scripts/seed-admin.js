// Seed admin account script (fixed version)
// Run with: node -r ./src/lib/db.js src/scripts/seed-admin.js

const db = require('./src/lib/db');
const { hashPassword } = require('./src/lib/auth');

async function main() {
  try {
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
      },
    });

    console.log('✅ Admin created:', admin.id);
    console.log('Login with: almaghfirah@bpjsketenagakerjaan.go.id / admin123');

    // Create sample employee
    await db.employee.create({
      data: {
        nip: 'KRY-001',
        name: 'Karyawan Satu',
        email: 'karyawan@ym.org.au',
        passwordHash: await hashPassword('karyawan123'),
        role: 'karyawan',
        jabatan: 'Staf Program',
        isActive: true,
      },
    });

    console.log('✅ Sample employee created');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().finally(() => db.$disconnect());