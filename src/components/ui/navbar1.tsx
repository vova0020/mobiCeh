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
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu'; // Иконка для меню

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
  const [mobileOpen, setMobileOpen] = useState(false); // Для мобильного меню
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {/* Элементы для Руководства */}
        {role === 'Руководство' && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/general_list" sx={linkStyle('/pages/general_list')}>
                <ListItemIcon>
                  
                </ListItemIcon>
                <ListItemText primary="Создание заказа" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/adminka" sx={linkStyle('/pages/adminka')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Админка" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/statistik2" sx={linkStyle('/pages/statistik2')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Статистика 2" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={(event) => handleMenuClick(event, 'manufacturing')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Основное производство" />
              </ListItemButton>
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
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/Сетки" sx={linkStyle('/pages/Сетки')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Сетки" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/Направляющие" sx={linkStyle('/pages/Направляющие')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Направляющие" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={(event) => handleMenuClick(event, 'finishing')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="ХВА" />
              </ListItemButton>
              <Menu anchorEl={anchorEl} open={openMenu === 'finishing'} onClose={handleMenuClose}>
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
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/createUsers" sx={linkStyle('/pages/createUsers')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Создание пользователя" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {role === 'Мастер участка' && (sector === 'Конвеер' || sector === 'Сборка') ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href={`/pages/Конвеер`} sx={linkStyle('/pages/Конвеер')}>
                <ListItemIcon>
                  
                </ListItemIcon>
                <ListItemText primary="Конвеер" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href={`/pages/Сборка`} sx={linkStyle('/pages/Сборка')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Сборка" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href={`/pages/${sector}`} sx={linkStyle(`/pages/${sector}`)}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary={sector} />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {/* Элементы для всех ролей кроме Руководства */}
        {/* 'Мастер Нестинг-Присадка', 'Мастер Кромки-Присадки', ' Мастер ХВА' */}
        {role === 'Мастер Нестинг-Присадка' && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/Нестинг" sx={linkStyle('/pages/Нестинг')}>
                <ListItemIcon>
                  
                </ListItemIcon>
                <ListItemText primary="Нестинг" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/Присадка" sx={linkStyle('/pages/Присадка')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Присадка" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {role === 'Технолог' && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/general_list" sx={linkStyle('/pages/general_list')}>
                <ListItemIcon>
                  
                </ListItemIcon>
                <ListItemText primary="Создание заказа" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {role === 'Менеджер' && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/general_list" sx={linkStyle('/pages/general_list')}>
                <ListItemIcon>
                  
                </ListItemIcon>
                <ListItemText primary="Создание заказа" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {role === 'Мастер Кромки-Присадки' && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/Кромка" sx={linkStyle('/pages/Кромка')}>
                <ListItemIcon>
                  
                </ListItemIcon>
                <ListItemText primary="Кромка" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/Присадка" sx={linkStyle('/pages/Присадка')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Присадка" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {role === ' Мастер ХВА' && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={(event) => handleMenuClick(event, 'finishing')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="ХВА" />
              </ListItemButton>
              <Menu anchorEl={anchorEl} open={openMenu === 'finishing'} onClose={handleMenuClose}>
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
            </ListItem>
          </>
        )}

        {role === 'Мастер Кромки-Присадки' && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/Кромка" sx={linkStyle('/pages/Кромка')}>
                <ListItemIcon>
                  
                </ListItemIcon>
                <ListItemText primary="Кромка" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/Присадка" sx={linkStyle('/pages/Присадка')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Присадка" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {role && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/pages/statistik" sx={linkStyle('/pages/statistik')}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Статистика" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                 
                </ListItemIcon>
                <ListItemText primary="Выйти" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <AppBar position="static" sx={{ backgroundColor: '#cbc8c8', borderRadius: 5, width: '99%' }}>
        <Toolbar sx={{ color: 'black' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* MyApp */}
          </Typography>

          <Button onClick={handleDrawerToggle} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <MenuIcon />
          </Button>

          {/* Общие элементы для всех пользователей */}
          {/* {role && (
          <Link href="/" passHref>
            <Button sx={linkStyle('/')} color="inherit">Главная</Button>
          </Link>
        )} */}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
         anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </div>
  );
};

export default Navbar1;