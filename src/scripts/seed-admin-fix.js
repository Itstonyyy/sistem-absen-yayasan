// Fixed seed script - doesn't use path aliases
// Run with: node src/scripts/seed-admin-fix.js

const path = require('path');

// Resolve absolute paths
const dbPath = path.resolve(__dirname, '../lib/db');
const authPath = path.resolve(__dirname, '../lib/auth');

const db = require(dbPath);
const { hashPassword } = require(authPath);

async function main() {
  try {
    console.log('🔧 Seeding admin account...');
    
    const password = 'admin123';
    const passwordHash = await hashPassword(password);

    // Check if admin already exists
    const existingAdmin = await db.employee.findUnique({
      where: { email: 'almaghfirah@bpjsketenagakerjaan.go.id' },
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists:', existingAdmin.email);
    } else {
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
      console.log('✅ Admin created:', admin.id);
    }

    // Create sample employee if not exists
    const existingEmployee = await db.employee.findUnique({
      where: { email: 'karyawan@ym.org.au' },
    });
    
    if (!existingEmployee) {
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
    }

    console.log('🎉 Seeding completed!');
    console.log('Login with: almaghfirah@bpjsketenagakerjaan.go.id / admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main().finally(() => db.$disconnect());