import Navbar1 from '@/components/ui/navbar1'
import TablePokraska from '@/components/ui/tablePokraska'
import React from 'react'



export default function Pokraska() {
    const work = 'Покраска'
  return (
    <div>
        <Navbar1/>
     

        <TablePokraska workData={work}/>
    </div>
  )
}