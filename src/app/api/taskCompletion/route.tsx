import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();


export async function POST(req: NextRequest) {
    // const data = await req.json(); // Парсинг тела запроса
    //     const newOrder = await prisma.createOrder(data);
    //     return NextResponse.json(newOrder, { status: 201 });
    try {
        const data = await req.json(); // Парсинг тела запроса
        const newOrder = await prisma.createOrder(data);
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        return NextResponse.json({ message: 'Ошибка при создании заказа' }, { status: 500 });
    }
}