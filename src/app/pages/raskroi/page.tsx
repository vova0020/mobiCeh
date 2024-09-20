'use client'
import NavbarEx from '@/components/ui/navbarEx';
import TableWorkplace from '@/components/ui/tableWorkplace';
import React, {  } from 'react'



export default function Raskroi() {
    const workData = 'Раскрой'
 
    

    return (
        <div>
            <NavbarEx/>
           <TableWorkplace workData={workData} />
        </div>
    );
}