import StatistikTable from '@/components/statistiksTable';
import NavbarEx from '@/components/ui/navbarEx';

import React from 'react'



export default function Statistik() {
   const sektorsName1 = 'Раскрой'

    


    return (
        <div> <NavbarEx />
            
            <div>
                <StatistikTable sektorsName={sektorsName1}/>
            </div>
        </div>
    )
}