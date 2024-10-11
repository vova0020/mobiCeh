import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const workstationName = searchParams.get('workstationName') || ''; // Если 'work' будет null, то назначится пустая строка
        console.log(workstationName);
        
        // Используем параметр для фильтрации
        const orders = await prisma.getStatistics2();

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        return NextResponse.json({ message: 'Ошибка при получении заказов' }, { status: 500 });
    }
}