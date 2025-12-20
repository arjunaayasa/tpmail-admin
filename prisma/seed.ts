import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create default admin
    const existingAdmin = await prisma.admin.findUnique({
        where: { email: 'admin@example.com' },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.admin.create({
            data: {
                email: 'admin@example.com',
                password: hashedPassword,
                name: 'Admin',
            },
        });
        console.log('✅ Default admin created: admin@example.com / admin123');
    } else {
        console.log('Admin already exists');
    }

    // Create default API key
    const existingKey = await prisma.apiKey.findFirst({
        where: { name: 'Default Key' },
    });

    if (!existingKey) {
        const key = `mk_${crypto.randomBytes(24).toString('hex')}`;
        await prisma.apiKey.create({
            data: {
                name: 'Default Key',
                key,
            },
        });
        console.log(`✅ Default API key created: ${key}`);
    } else {
        console.log('Default API key already exists');
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
