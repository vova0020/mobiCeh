'use client'
import Link from "next/link";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function Home() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
       <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link href="/pages/generalCeh">Основное производство</Link>
      
       
      <Link href="/pages/auth">Авторизация</Link>
    </div>
    </LocalizationProvider>
   
  );
}
