
// import prismaInteraction from '@/api/prisma';

// const prisma = new prismaInteraction();

// export async function GET() {
//     try {
//         const updates = await prisma.croneTable();
//         return NextResponse.json(updates, { status: 200 });
//     } catch (error) {
//         console.error('Ошибка при получении обновлений:', error);
//         return NextResponse.json({ message: 'Ошибка при получении обновлений' }, { status: 500 });
//     }
// }
// export async function startCron() {
//     // Запуск задачи каждые 3 секунд
//     // console.log('Сработал');
    
//     setInterval(async () => {
//      await prisma.croneTable();
//     }, 10000);
//     setInterval(async () => {
//      await prisma.updateOrderCrone();
//     }, 100000);
//   }