// components/Navbar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from 'next/link';

const NavbarEx: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" passHref>
          <Button color="inherit">Главная</Button>
        </Link>
              
      </Toolbar>
    </AppBar>
  );
};

export default NavbarEx;
