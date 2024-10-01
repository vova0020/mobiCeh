
/* eslint-disable */
'use client';

import Navbar1 from '@/components/ui/navbar1';
import TableWorkplace from '@/components/ui/tableWorkplace';
import withAuth from '@/components/withAuth';
import { useParams } from 'next/navigation'; // импортируем хук для получения параметров из URL
import React from 'react';

const WorkplacePage = () => {
  const params = useParams();
  const { sektor } = params;

  return (
    <div>
       {/* <h1>Параметр из URL: {decodeURIComponent(sektor)}</h1> */}
      <Navbar1 />
      <TableWorkplace workData={decodeURIComponent(sektor)} />
    </div>
  );
};

export default withAuth(WorkplacePage);
