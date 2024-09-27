'use client'
// components/Navbar.tsx
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Navbar1: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

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

        {/* Выпадающий список для Раскрой и Нестинг */}
        <Button
          color="inherit"
          onClick={(event) => handleMenuClick(event, 'manufacturing')}
        >
          Основное производство
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={openMenu === 'manufacturing'}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Раскрой" passHref>
              Раскрой
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Нестинг" passHref>
              Нестинг
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Зеркала" passHref>
              Зеркала
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Кромка" passHref>
              Кромка
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Присадка" passHref>
              Присадка
            </Link>
          </MenuItem>

          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Металлокаркасы" passHref>
            Металлокаркасы
            </Link>
          </MenuItem>

          {/* создать Металлокаркас */}
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/pokraska" passHref>
              Покраска
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Фурнитура" passHref>
              Фурнитура
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Сборка" passHref>
              Сборка
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Конвеер" passHref>
              Конвеер
            </Link>
          </MenuItem>
        </Menu>

        <Link href="/pages/Сетки" passHref>
          <Button color="inherit">Сетки</Button>
        </Link>

        {/* Выпадающий список для Мойка и Гальваника */}
        <Button
          color="inherit"
          onClick={(event) => handleMenuClick(event, 'finishing')}
        >
          ХВА
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={openMenu === 'finishing'}
          onClose={handleMenuClose}
        >
          {/* Передалать в подготовку */}
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Подготовка" passHref> 
              Подготовка
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/ХВА" passHref>
              ХВА
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Мойка" passHref>
              Мойка
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Гальваника" passHref>
              Гальваника
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Термопласт" passHref>
              Термопласт
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/pages/Упаковка" passHref>
              Упаковка крепеж
            </Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar1;
