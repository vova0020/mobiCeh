// axiosConfig.ts
import axios from 'axios';

// Установите токен в заголовке Authorization для всех запросов
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
    }
    return config; // Возвращаем конфигурацию запроса
  },
  (error) => {
    return Promise.reject(error); // Обрабатываем ошибку
  }
);

export default axios; // Экспортируем настроенный axios
