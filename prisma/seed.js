
/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const adminLogin = 'Admin';
    const existingAdmin = await prisma.users.findUnique({
        where: { login: adminLogin },
    });

    if (!existingAdmin) {
        const adminPassword = await bcrypt.hash('Admin311', 10);

        await prisma.users.create({
            data: {
                login: adminLogin,
                password: adminPassword,
                role: 'Руководство',
                sector: null,
            },
        });
        console.log('Администратор создан.');
    } else {
        console.log('Учетная запись администратора уже существует.');
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
