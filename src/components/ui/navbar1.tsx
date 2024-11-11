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
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Импортируем библиотеку для декодирования токена
import { Box } from '@mui/material'; // Для контейнера кнопок

interface DecodedToken {
  role: string;
  sector: string;
}

const Navbar1: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sector, setSector] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: DecodedToken = jwtDecode(storedToken);
        setRole(decoded.role);
        setSector(decoded.sector);
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
      }
    }
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/pages/auth');
  };

  // Стили для активной ссылки
  const linkStyle = (path: string) => ({
    color: pathname === path ? '#007eff' : 'inherit',
    fontWeight: pathname === path ? 'bold' : 'normal',
    textDecoration: 'none'
  });

  return (
    <div style={{display:'flex', justifyContent:'center'}}>
      <AppBar position="static" sx={{ backgroundColor: '#cbc8c8', borderRadius: 5, width: '99%' }}>
        <Toolbar sx={{ color: 'black' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* MyApp */}
          </Typography>
          {/* Общие элементы для всех пользователей */}
          {/* {role && (
          <Link href="/" passHref>
            <Button sx={linkStyle('/')} color="inherit">Главная</Button>
          </Link>
        )} */}

          {/* Элементы для Руководства */}
          {role === 'Руководство' && (
            <>
              <Link href="/pages/general_list" passHref>
                <Button sx={linkStyle('/pages/general_list')} color="inherit">Создание заказа</Button>
              </Link>
              <Link href="/pages/adminka" passHref>
                <Button sx={linkStyle('/pages/adminka')} color="inherit">Админка</Button>
              </Link>
              <Link href="/pages/statistik2" passHref>
                <Button sx={linkStyle('/pages/statistik2')} color="inherit">Статистика 2</Button>
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
                <Button sx={linkStyle('/pages/Сетки')} color="inherit">Сетки</Button>
              </Link>
              <Link href="/pages/Направляющие" passHref>
                <Button sx={linkStyle('/pages/Направляющие')} color="inherit">Направляющие</Button>
              </Link>

              <Button
                color="inherit"
                onClick={(event) => handleMenuClick(event, 'finishing')}>
                ХВА
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openMenu === 'finishing'}
                onClose={handleMenuClose}
              >
                {/* ХВА */}
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
                <Button sx={linkStyle('/pages/createUsers')} color="inherit">Создание пользователя</Button>
              </Link>
            </>

          )}

          {role === 'Мастер участка' && (sector === 'Конвеер' || sector === 'Сборка') ? (
            <>
              <Link href={`/pages/Конвеер`} passHref>
                <Button sx={linkStyle('/pages/Конвеер')} color="inherit">Конвеер</Button>
              </Link>
              <Link href={`/pages/Сборка`} passHref>
                <Button sx={linkStyle('/pages/Сборка')} color="inherit">Сборка</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/pages/${sector}`} passHref>
                <Button sx={linkStyle(`/pages/${sector}`)} color="inherit">{sector}</Button>
              </Link>
            </>
          )}

          {/* Элементы для всех ролей кроме Руководства */}
          {/* 'Мастер Нестинг-Присадка', 'Мастер Кромки-Присадки', ' Мастер ХВА' */}
          {role === 'Мастер Нестинг-Присадка' && (
            <>
              <Link href="/pages/Нестинг" passHref>
                <Button sx={linkStyle('/pages/Нестинг')} color="inherit">Нестинг</Button>
              </Link>
              <Link href="/pages/Присадка" passHref>
                <Button sx={linkStyle('/pages/Присадка')} color="inherit">Присадка</Button>
              </Link>

            </>
          )}

          {role === 'Технолог' && (
            <>
              <Link href="/pages/general_list" passHref>
                <Button sx={linkStyle('/pages/general_list')} color="inherit">Создание заказа</Button>
              </Link>
            </>
          )}
          {role === 'Менеджер' && (
            <>
              <Link href="/pages/general_list" passHref>
                <Button sx={linkStyle('/pages/general_list')} color="inherit">Создание заказа</Button>
              </Link>
            </>
          )}

          {role === 'Мастер Кромки-Присадки' && (
            <>
              <Link href="/pages/Кромка" passHref>
                <Button sx={linkStyle('/pages/Кромка')} color="inherit">Кромка</Button>
              </Link>
              <Link href="/pages/Присадка" passHref>
                <Button sx={linkStyle('/pages/Присадка')} color="inherit">Присадка</Button>
              </Link>
            </>
          )}
          {role === ' Мастер ХВА' && (
            <>
              <Button
                color="inherit"
                onClick={(event) => handleMenuClick(event, 'finishing')}>
                ХВА
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openMenu === 'finishing'}
                onClose={handleMenuClose}
              >
                {/* ХВА */}
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
            </>
          )}

          {role === 'Мастер Кромки-Присадки' && (
            <>
              <Link href="/pages/Кромка" passHref>
                <Button sx={linkStyle('/pages/Кромка')} color="inherit">Кромка</Button>
              </Link>
              <Link href="/pages/Присадка" passHref>
                <Button sx={linkStyle('/pages/Присадка')} color="inherit">Присадка</Button>
              </Link>
            </>
          )}

          {/* Кнопка Выйти */}
          {role && (
            <>
              <Link href="/pages/statistik" passHref>
                <Button sx={linkStyle('/pages/statistik')} color="inherit">Статистика</Button>
              </Link>
              <Button color="inherit" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>

  );
};

export default Navbar1;
