import StatistikTable from '@/components/statistiksTable';
import Navbar1 from '@/components/ui/navbar1';


import React from 'react'



export default function Statistik() {
   const sektorsName1 = 'Раскрой'

    


    return (
        <div> <Navbar1 />
            
            <div>
                <StatistikTable sektorsName={sektorsName1}/>
            </div>
        </div>
    )
}