import NavbarEx from '@/components/ui/navbarEx'
import TablePokraska from '@/components/ui/tablePokraska'
import React from 'react'



export default function Pokraska() {
    const work = 'Покраска'
  return (
    <div>
        <NavbarEx/>
     

        <TablePokraska workData={work}/>
    </div>
  )
}