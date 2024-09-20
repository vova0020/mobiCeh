'use client'
import React, {  } from 'react'
import TableWorkplace from '@/components/ui/tableWorkplace';
import NavbarEx from '@/components/ui/navbarEx';



export default function Prisadka() {
    const workData = 'Присадка'
    

    return (
        <div>
            <NavbarEx/>
           <TableWorkplace workData={workData} />
        </div>
    );
}