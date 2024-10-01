'use client';

/* eslint-disable */
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'

const theme = createTheme();

type AuthFormInputs = {
  login: string;
  password: string;
};

// Интерфейс для декодированного токена
interface DecodedToken {
  role: string;    // Поле для роли пользователя
  sector?: string; // Поле для сектора (доступно, если пользователь — мастер участка)
}

export default function Auth() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormInputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<AuthFormInputs> = async (data) => {
    try {
        const response = await axios.post('/api/auth', data);
        const token = response.data.token; // Получаем токен из ответа

        if (token) {
            localStorage.setItem('token', token); // Сохраняем токен в localStorage

            // Декодируем токен с помощью jwtDecode
            const decoded: DecodedToken = jwtDecode(token);

            // Редиректим на разные страницы в зависимости от роли
            if (decoded.role === 'Мастер участка') {
                switch (decoded.sector) {
                    case 'Раскрой':
                        router.push('/pages/Раскрой');
                        break;
                    case 'Нестинг':
                        router.push('/pages/Нестинг');
                        break;
                    case 'Зеркала':
                        router.push('/pages/Зеркала');
                        break;
                    case 'Кромка':
                        router.push('/pages/Кромка');
                        break;
                    case 'Присадка':
                        router.push('/pages/Присадка');
                        break;
                    case 'Металлокаркасы':
                        router.push('/pages/Металлокаркасы');
                        break;
                    case 'Покраска':
                        router.push('/pages/pokraska');
                        break;
                    case 'Фурнитура':
                        router.push('/pages/Фурнитура');
                        break;
                    case 'Конвеер':
                        router.push('/pages/Конвеер');
                        break;
                    case 'Сборка':
                        router.push('/pages/Сборка');
                        break;
                    case 'Сетки':
                        router.push('/pages/Сетки');
                        break;
                    case 'Проволка':
                        router.push('/pages/Проволка');
                        break;
                    case 'ХВА':
                        router.push('/pages/ХВА');
                        break;
                    case 'Мойка':
                        router.push('/pages/Мойка');
                        break;
                    case 'Гальваника':
                        router.push('/pages/Гальваника');
                        break;
                    case 'Термопласт':
                        router.push('/pages/Термопласт');
                        break;
                    case 'Упаковка':
                        router.push('/pages/Упаковка');
                        break;
                    default:
                        alert("Неизвестный сектор");
                        break;
                }
            } else if (decoded.role === 'Менеджер') {
                router.push('/pages/general_list');
            } else if (decoded.role === 'Технолог') {
                router.push('/pages/general_list');
            } else if (decoded.role === 'Руководство') {
                router.push('/pages/general_list');
            } else {
                alert("Неизвестная роль");
            }

            reset(); // Сбросить форму
        } else {
            alert("Ошибка авторизации: не удалось получить токен");
        }
    } catch (error: any) {
        alert(error.response?.data?.message || "Ошибка авторизации");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Войти в систему
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="login"
                    label="Логин"
                    autoComplete="login"
                    autoFocus
                    {...register("login", { required: "Введите логин" })}
                    error={!!errors.login}
                    helperText={errors.login?.message}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    {...register("password", { required: "Введите пароль" })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Войти
                </Button>
                <Grid container>
                    <Grid item xs>
                        {/* Возможно, сюда можно добавить ссылку на страницу восстановления пароля */}
                    </Grid>
                    <Grid item>
                        {/* Возможно, сюда можно добавить ссылку на страницу регистрации */}
                    </Grid>
                </Grid>
            </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
