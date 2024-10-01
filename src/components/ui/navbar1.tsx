
/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Импортируем библиотеку для декодирования токена

interface DecodedToken {
  role: string; // Предполагаем, что в токене есть поле 'role'
}

const Navbar1: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Состояние для хранения роли пользователя
  const router = useRouter();

  // Используем useEffect для работы с localStorage на стороне клиента
  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Получаем токен
    if (storedToken) {
      setToken(storedToken); // Сохраняем токен в стейте
      try {
        // Декодируем токен
        const decoded: DecodedToken = jwtDecode(storedToken); // Декодируем JWT
        setRole(decoded.role); // Сохраняем роль в состоянии
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
      }
    }
  }, []); // Выполняется только при первом рендере

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен при выходе
    router.push('/pages/auth'); // Перенаправление на страницу авторизации
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#cbc8c8' }}>
      <Toolbar sx={{ color: 'black' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* MyApp */}
        </Typography>

        {/* Общие элементы для всех пользователей */}
        {/* {role && (
          <Link href="/" passHref>
            <Button color="inherit">Главная</Button>
          </Link>
        )} */}

        {/* Элементы для Руководства */}
        {role === 'Руководство' && (
          <>
            <Link href="/pages/general_list" passHref>
              <Button color="inherit">Создание заказа</Button>
            </Link>
            <Link href="/pages/statistik" passHref>
              <Button color="inherit">Статистика</Button>
            </Link>
            <Button color="inherit" onClick={(event) => handleMenuClick(event, 'manufacturing')}>
              Основное производство
            </Button>
            <Menu anchorEl={anchorEl} open={openMenu === 'manufacturing'} onClose={handleMenuClose}>
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
            <Link href="/pages/Направляющие" passHref>
              <Button color="inherit">Направляющие</Button>
            </Link>

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
            <Link href="/pages/createUsers" passHref>
              <Button color="inherit">Создание пользователя</Button>
            </Link>
          </>

        )}

        {/* Элементы для всех ролей кроме Руководства
        {role !== 'Руководство' && (
          <>
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          </>
        )} */}

        {/* Кнопка Выйти */}
        {role && (
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar1;


