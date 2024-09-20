'use client'
import NavbarEx from '@/components/ui/navbarEx';
import TableWorkplace from '@/components/ui/tableWorkplace';
import React, {  } from 'react'

// Определяем тип для строки таблицы


export default function Kromka() {
    const workData = 'Кромка'
    

    return (
        <div>
            <NavbarEx/>
           <TableWorkplace workData={workData} />
        </div>
    );
}