'use client'
import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import axios from 'axios';

interface OrderRow {
    id: number;
    launchNumber: string;
    actual: string;
    orderName: string;
    article: string;
    nomenclature: string;
    pd: string;
    quantity: number;
    complete: number;
    ostatok: number;
    ostatokInpt: number;
    completionRate: number;
    status: string;
    prosrok: number;
    relevant: number;
    sdel: number;
}

export default function TableWorkplace({ workData }: { workData: string }) {

    const [completedData, setCompletedData] = useState(0)
    const [editableStatus, setEditableStatus] = useState(false);
    const [rows, setRows] = useState<OrderRow[]>([]);

    const getRowClassName = (params) => {
        const completionRate = parseFloat(params.row.completionRate.replace('%', ''));

        if (completionRate > 0 && completionRate < 99) {
            return 'cell-status-work'; // Класс для желтого цвета
        } else if (completionRate >= 99) {
            return 'cell-status-complete'; // Класс для зеленого цвета
        }

        return ''; // Без дополнительных стилей для остальных случаев
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: '№ запуска', editable: editableStatus, width: 70, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'actual', headerName: 'Актуальный', editable: editableStatus, width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'orderName', headerName: 'Заказ', editable: editableStatus, width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'article', headerName: 'Артикул', editable: editableStatus, width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'nomenclature', headerName: 'Номенклатура', editable: editableStatus, width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'pd', headerName: 'ПД', editable: editableStatus, width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'quantity', headerName: 'План', editable: editableStatus, width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'complete', headerName: 'Выполнено', width: 130, editable: editableStatus, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'ostatok', headerName: 'Остаток', width: 130, editable: editableStatus, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'completionRate', headerName: 'Выполнено %', width: 130, editable: editableStatus, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'status', headerName: 'Статус', width: 130, editable: editableStatus, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', cellClassName: (params) => params.value === 'Просрочен' ? 'cell-status-overdue' : '', },
        { field: 'prosrok', headerName: 'Дней просрочки', width: 130, editable: editableStatus, type: 'number', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'relevant', headerName: 'Актуальных', width: 130, editable: editableStatus, type: 'number', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        {
            field: 'sdel', headerName: 'Сделано', width: 130, type: 'number', headerAlign: 'center', editable: true, //(params) => params.row.ostatok > 0, // Ячейка редактируется только если остаток > 0
            cellClassName: (params) =>
                params.row.ostatok === 0 ? 'cell-ostatok-zero' : 'cell-ostatok-active', headerClassName: 'super-app-theme--header'
        },
    ];

    const getCurrentDate = (): Date => {
        return new Date();
    };

    const getStatus = (completionRate: number, pdDate: Date, currentDate: Date): { status: string, prosrok: number } => {
        let status = 'Невыполнен';
        let prosrok = 0;

        if (completionRate > 99) {
            status = 'ОК';
        } else {
            if (pdDate < currentDate) {
                status = 'Просрочен';
                const diffTime = Math.abs(currentDate.getTime() - pdDate.getTime());
                prosrok = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                console.log(prosrok);
                
            }
        }

        return { status, prosrok };
    };

    const fetchData = () => {
        const params = { work: workData };

        axios.get('/api/workplace', { params })
            .then(response => {
                const updatedRows = response.data.map((order: any) => {
                    const receivedDateParts = order.receivedDate.split('.');
                    const receivedDate = new Date(
                        parseInt(receivedDateParts[2], 10),
                        parseInt(receivedDateParts[1], 10) - 1,
                        parseInt(receivedDateParts[0], 10)
                    );

                    const pdDate = new Date(receivedDate);
                    pdDate.setDate(pdDate.getDate() + 1);

                    // const pdDateStr = `${String(pdDate.getDate()).padStart(2, '0')}.${String(pdDate.getMonth() + 1).padStart(2, '0')}.${pdDate.getFullYear()}`;

                    const { status, prosrok } = getStatus(order.completionRate, pdDate, getCurrentDate());

                    const actual = order.tasks[0]?.completedPros < 100 ? 'Да' : 'Нет';
                    const relevant = actual === 'Да' ? 1 : 0;

                    const today = getCurrentDate().toLocaleDateString('en-CA');

                    const todayWorkDone = order.tasks[0]?.workDone
                        .filter((work: any) => new Date(work.date).toLocaleDateString('en-CA') === today)
                        .reduce((acc: number, work: any) => acc + work.quantity, 0) || 0;

                    const totalWorkDone = order.tasks[0]?.workDone
                        .reduce((acc: number, work: any) => acc + work.quantity, 0) || 0;

                    const ostatok = order.quantity - totalWorkDone;
                    const completionRate = order.tasks[0]?.completedPros || 0;
                    // console.log(order.tasks[0].pd);

                    return {
                        ...order,
                        pd: order.tasks[0].pd,
                        status: status,
                        prosrok: prosrok,
                        actual: actual,
                        relevant: relevant,
                        sdel: todayWorkDone,
                        complete: totalWorkDone,
                        ostatok: ostatok >= 0 ? ostatok : 0,
                        completionRate: `${completionRate}%`,
                        ostatokInpt: order.ostatokInpt,
                    };
                });

                setRows(updatedRows);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    useEffect(() => {
        fetchData(); // Первоначальная загрузка данных

        const interval = setInterval(fetchData, 10000); // Обновление данных каждые 3 секунды

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, [workData]);



    const handleProcessRowUpdate = async (newRow: any) => {
        try {
            const { id, sdel, complete } = newRow;
            const ostatokInpt = newRow.tasks[0].ostatokInpt


            if (sdel > ostatokInpt) { // Используем ostatokInpt вместо quantity
                alert(`Максимальное количество для выполнения сегодня: ${ostatokInpt}. Пожалуйста, обратитесь к менеджеру.`);
                throw new Error(`Превышение допустимого значения выполнения. Максимум для сегодняшнего дня: ${ostatokInpt}`);
            }


            await axios.post('/api/workplace', {
                orderId: id,
                workstationName: workData,
                doneToday: sdel
            });

            fetchData();

            return newRow;
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
            throw new Error('Ошибка при обновлении данных');
        }
    };





    const getCurrentDate2 = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${day}.${month}.${year}`;
    };

    return (
        <div>
            <div
                style={{
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                    width: '200px',
                    margin: '20px auto',
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: '1.5',
                }}
            >
                <div style={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
                    <h1 style={{ marginRight: 10, color: 'black' }}>{workData}</h1>
                </div>
                <div style={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
                    <h1 style={{ marginRight: 10, color: 'black' }}>Сегодня</h1>
                    <h1>{getCurrentDate2()}</h1>
                </div>
            </div>

            <Paper style={{ height: '400px', width: '100%', margin: '20px 0' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={100}
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                    processRowUpdate={handleProcessRowUpdate}
                    onProcessRowUpdateError={(error) => console.error('Ошибка при обновлении строки:', error)}
                    getRowClassName={getRowClassName}
                    sx={{
                        '& .super-app-theme--header': {
                            backgroundColor: '#bceaff',
                            fontWeight: 'bold',
                            // color: '#333',
                            border: '1px solid #ccc',
                        },
                        '& .cell-sdel': {
                            backgroundColor: '#3e7afc',
                            fontWeight: 'bold',
                            fontSize: 16,
                            // color: '#000',
                        },
                        '& .MuiDataGrid-cell': {
                            border: '1px solid #ccc',
                            textAlign: 'center'
                        },
                        '& .cell-ostatok-zero': {
                            backgroundColor: '#58ff1b !important',  // Синий цвет
                            // pointerEvents: 'none',  // Делаем ячейку неактивной
                            opacity: 0.7,
                        },
                        '& .cell-ostatok-active': {
                            backgroundColor: '#0000ff !important', // Зелёный цвет для активной ячейки
                        },
                        '& .cell-status-overdue': {
                            backgroundColor: 'red', // Красный цвет для статуса просрочен
                            color: 'black',
                            opacity: 0.9,// Белый текст для лучшей видимости
                        },
                        '& .cell-status-work': {
                            backgroundColor: '#f9ff7e !important', // Зелёный цвет для активной ячейки
                        },
                        '& .cell-status-complete': {
                            backgroundColor: '#5bfa22 !important', // Красный цвет для статуса просрочен
                            // color: 'black', 
                            // opacity: 0.9,// Белый текст для лучшей видимости
                        },

                    }}
                />
            </Paper>
        </div>
    );
}
