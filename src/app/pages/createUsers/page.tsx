'use client';

/* eslint-disable */
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Alert } from '@mui/material';
import Navbar1 from '@/components/ui/navbar1';

const theme = createTheme();

type RegisterFormInputs = {
    login: string;
    password: string;
    confirmPassword: string;
    sector: string;
    role: string;
};

export default function Register() {
    const sectors = ['Раскрой', 'Нестинг', 'Зеркала', 'Кромка', 'Присадка', 'Металлокаркасы', 'Покраска', 'Фурнитура', 'Конвеер', 'Сборка', 'Сетки', 'Проволка', 'ХВА', 'Мойка', 'Гальваника', 'Термопласт', 'Упаковка'];
    const roles = ['Менеджер', 'Технолог', 'Мастер участка', 'Руководство'];

    const { register, handleSubmit, formState: { errors }, watch, setValue, clearErrors, reset } = useForm<RegisterFormInputs>();
    const [showSector, setShowSector] = useState(false);

    // Следим за значением поля "Роль"
    const selectedRole = watch('role');

    const [notification, setNotification] = useState<{ message: string; severity: "success" | "error" } | null>(null);

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        try {
            await axios.post('/api/register', data);
            setNotification({ message: "Пользователь успешно зарегистрирован", severity: "success" });

            // Очищаем поля формы после успешной регистрации
            reset();
        } catch (error: any) {
            console.error("Ошибка при регистрации:", error);
            if (error.response && error.response.status === 409) {
                setNotification({ message: "Пользователь с таким логином уже существует", severity: "error" });
            } else {
                setNotification({ message: "Произошла ошибка при регистрации пользователя", severity: "error" });
            }
        }
    };

    // Логика показа/валидации сектора в зависимости от выбранной роли
    React.useEffect(() => {
        if (selectedRole === 'Мастер участка') {
            setShowSector(true);  // Показываем поле "Сектор"
        } else {
            setShowSector(false); // Скрываем поле "Сектор" и очищаем значение
            setValue('sector', ''); // Сбрасываем значение сектора
            clearErrors('sector');  // Убираем ошибку валидации
        }
    }, [selectedRole, setValue, clearErrors]);

    const password = watch("password");




    return (
        <div> <Navbar1 />
            <div>
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
                                <PersonAddIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Регистрация нового пользователя
                            </Typography>
                            {/* Показываем уведомление, если оно есть */}
                            {notification && (
                                <Alert severity={notification.severity} sx={{ mt: 2 }}>
                                    {notification.message}
                                </Alert>
                            )}
                            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="login"
                                    label="Логин"
                                    autoComplete="login"
                                    autoFocus
                                    {...register("login", { required: "Укажите логин" })}
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
                                    autoComplete="new-password"
                                    {...register("password", { required: "Требуется ввести пароль", minLength: { value: 6, message: "Длина пароля должна составлять не менее 6 символов" } })}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Подтвердите пароль"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    {...register("confirmPassword", {
                                        required: "Пожалуйста, подтвердите свой пароль",
                                        validate: (value) => value === password || "Пароли не совпадают"
                                    })}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                />

                                {/* Выпадающий список для роли */}
                                <TextField
                                    select
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="role"
                                    label="Роль"
                                    {...register("role", { required: "Выберите роль" })}
                                    error={!!errors.role}
                                    helperText={errors.role?.message}
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role || ''}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {/* Поле для выбора сектора отображается только для роли "Мастер участка" */}
                                {showSector && (
                                    <TextField
                                        select
                                        margin="normal"
                                        fullWidth
                                        id="sector"
                                        label="Сектор"
                                        {...register("sector", { required: "Выберите сектор" })}
                                        error={!!errors.sector}
                                        helperText={errors.sector?.message}
                                    >
                                        {sectors.map((sector) => (
                                            <MenuItem key={sector} value={sector || ''}>
                                                {sector}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Зарегистрироваться
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        {/* Возможно, сюда можно добавить ссылку на страницу авторизации */}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </div>
        </div>

    );
}
