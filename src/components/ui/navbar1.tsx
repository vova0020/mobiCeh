// components/Navbar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

const Navbar1: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>
        <Link href="/" passHref>
          <Button color="inherit">Главная</Button>
        </Link>
        <Link href="/pages/general_list" passHref>
          <Button color="inherit">Создание заказа</Button>
        </Link>
        <Link href="/pages/statistik" passHref>
          <Button color="inherit">Статистика</Button>
        </Link>
        <Link href="/pages/raskroi" passHref>
          <Button color="inherit">Раскрой</Button>
        </Link>
        <Link href="/pages/nesting" passHref>
          <Button color="inherit">Нестинг</Button>
        </Link>
        <Link href="/pages/zerkala" passHref>
          <Button color="inherit">Зеркала</Button>
        </Link>
        <Link href="/pages/kromka" passHref>
          <Button color="inherit">Кромка</Button>
        </Link>
        <Link href="/pages/prisadka" passHref>
          <Button color="inherit">Присадка</Button>
        </Link>
        <Link href="/pages/pokraska" passHref>
          <Button color="inherit">Покраска</Button>
        </Link>
        <Link href="/pages/furnitura" passHref>
          <Button color="inherit">Фурнитура</Button>
        </Link>
        <Link href="/pages/sborka" passHref>
          <Button color="inherit">Сборка</Button>
        </Link>
        <Link href="/pages/konveer" passHref>
          <Button color="inherit">Конвеер</Button>
        </Link>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar1;
