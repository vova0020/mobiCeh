import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();

// Обработчик POST-запросов для обновления данных о выполненной работе
export async function POST(req: NextRequest) {
    try {
        const { orderId, workstationName, doneToday } = await req.json();
        console.log(doneToday);
        

        // // Проверяем корректность данных
        // if (typeof orderId !== 'number' || typeof workstationName !== 'string' || typeof doneToday !== 'number') {
        //     return NextResponse.json({ message: 'Неверные данные' }, { status: 400 });
        // }

        // // Обновляем данные о выполненной работе
        const updatedTask = await prisma.updateWorkDone(orderId, workstationName, doneToday);

        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении данных' }, { status: 500 });
    }
}