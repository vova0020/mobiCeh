import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();

export async function POST(req: NextRequest) {

    try {
        // const rowToSend = await req.json();
        const {id,orders, workStatuses} = await req.json();
        console.log(id);
        console.log(orders);
        // console.log(workStatuses);
        
        
            
        // });
        // Проверяем корректность данных
        // if (typeof orderId !== 'number' || typeof workstationName !== 'string' || typeof doneToday !== 'number') {
        //     return NextResponse.json({ message: 'Неверные данные' }, { status: 400 });
        // }

        // Обновляем данные о выполненной работе
        const updatedOrder = await prisma.updateOrder(id,orders, workStatuses);

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении данных' }, { status: 500 });
    }

}
