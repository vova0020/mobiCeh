'use client';
/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridFilterModel, GridLogicOperator, GridRowModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import { Box, Button, FormControlLabel, Checkbox, Alert, AlertTitle, Snackbar } from '@mui/material';
import axios from 'axios';
import Navbar1 from '@/components/ui/navbar1';

interface OrderRow {
    id: number;
    launchNumber: string;
    orderName: string;
    article: string;
    receivedDate: string;
    status: string;
    isCompleted: boolean;
    completionRate: number;
    nomenclature: string;
    pdDateRaskroi: string,
    pdDateNesting: string,
    raskroi: boolean;
    nesting: boolean;
    zerkala: boolean;
    kromka: boolean;
    prisadka: boolean;
    pokraska: boolean;
    furnitura: boolean;
    konveer: boolean;
    sborka: boolean;
    quantity: number;
    pdDate: string;
    setki: boolean;
    guides: boolean;
    metal: boolean;
    provolka: boolean;
    xba: boolean;
    moika: boolean;
    galivanika: boolean;
    termoplast: boolean;
    ypakovka: boolean;
}

export default function GeneralList() {

    // Алерт кастомный 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning'>('success');



    async function remOrder() {
        try {
            const response = await axios.get('/api/adminka');

            // Проверка статуса ответа
            if (response.status === 200) {
                console.log('Запрос успешен:', response.data);
                setSnackbarMessage('Запрос успешен, база исправлена');
                setSnackbarSeverity('success');
                setOpenSnackbar(true); // Показать Snackbar 
            } else {
                console.log('Ошибка: получен статус', response.status);
                setSnackbarMessage(`Ошибка: получен статус, ${response.status}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true); // Показать Snackbar 
            }
        } catch (error) {
            // Проверка и обработка ошибки как AxiosError
            if (axios.isAxiosError(error)) {
                console.log('Ошибка:', error.response?.status, error.response?.data);
                setSnackbarMessage(`Ошибка: ${error.response?.status}, ${error.response?.data}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true); // Показать Snackbar 
            } else {
                console.log('Неизвестная ошибка:', error);
                setSnackbarMessage(`Неизвестная ошибка: ${error}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true); // Показать Snackbar 

            }
        }
    }


    return (
        <Paper sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <Navbar1 />

            <Box sx={{ height: 'calc(110vh - 200px)', width: '100%', overflow: 'auto' }}>

                {/* Кнопка для экспорта */}
                <button
                    onClick={remOrder}
                    style={{
                        padding: '5px 10px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#fff',
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        marginTop: '10px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #66BB6A, #AED581)';
                        e.currentTarget.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(45deg, #4CAF50, #8BC34A)';
                        e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    Исправить базу
                </button>
            </Box>






            {/* Snackbar для отображения уведомлений */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={10000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Позиционирование
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                    <AlertTitle>Внимание!!!</AlertTitle>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {/* <FormControlLabel
                control={<Checkbox checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />}
                label="Показать только незавершенные"
            />
            <Box sx={{ height: 'calc(110vh - 200px)', width: '100%', overflow: 'auto' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={20}
                    rowsPerPageOptions={[5]}
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                    onCellEditCommit={(params) => handleRowEdit(params)}
                    sx={{
                        '& .cell-status-work': {
                            backgroundColor: '#f9ff7e !important',
                        },
                        '& .cell-status-complete': {
                            backgroundColor: '#5bfa22 !important',
                        },
                    }}
                />
            </Box> */}
        </Paper>
    );
}
