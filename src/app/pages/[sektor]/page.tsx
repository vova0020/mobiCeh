// app/[workData]/page.tsx
'use client';

import NavbarEx from '@/components/ui/navbarEx';
import TableWorkplace from '@/components/ui/tableWorkplace';
import { useParams } from 'next/navigation'; // импортируем хук для получения параметров из URL
import React from 'react';

const WorkplacePage = () => {
  const params = useParams();
  const { sektor } = params;

  return (
    <div>
       {/* <h1>Параметр из URL: {decodeURIComponent(sektor)}</h1> */}
      <NavbarEx />
      <TableWorkplace workData={decodeURIComponent(sektor)} />
    </div>
  );
};

export default WorkplacePage;
