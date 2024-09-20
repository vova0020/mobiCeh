'use client'
import NavbarEx from '@/components/ui/navbarEx';
import TableWorkplace from '@/components/ui/tableWorkplace';
import React, {  } from 'react'


export default function Zerkala() {
    const workData = 'Зеркала'
   
    return (
        <div>
            <NavbarEx/>
           <TableWorkplace workData={workData} />
        </div>
    );
}