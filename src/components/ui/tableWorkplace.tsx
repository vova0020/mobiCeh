'use client'

/* eslint-disable */
import React, { useEffect, useState } from 'react'
// import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import axios from 'axios';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel, gridExpandedSortedRowIdsSelector, useGridApiRef } from '@mui/x-data-grid'
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    const apiRef = useGridApiRef();

    const [completedData, setCompletedData] = useState(0)
    const [editableStatus, setEditableStatus] = useState(false);
    const [rows, setRows] = useState<OrderRow[]>([]);
    const [columnState, setColumnState] = useState<any>({}); // Состояние для ширины колонок


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
        { field: 'id', headerName: '№ запуска', editable: editableStatus, width: columnState['id'] || 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'actual', headerName: 'Актуальный', editable: editableStatus, width: columnState['actual'] || 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'orderName', headerName: 'Заказ', editable: editableStatus, width: columnState['orderName'] || 250, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'article', headerName: 'Артикул', editable: editableStatus, width: columnState['article'] || 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'nomenclature', headerName: 'Номенклатура', editable: editableStatus, width: columnState['nomenclature'] || 350, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'pd', headerName: 'ПД', editable: editableStatus, width: columnState['pd'] || 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'quantity', headerName: 'План', editable: editableStatus, width: columnState['quantity'] || 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'complete', headerName: 'Выполнено', width: columnState['complete'] || 130, editable: editableStatus, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'ostatok', headerName: 'Остаток', width: columnState['ostatok'] || 130, editable: editableStatus, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'completionRate', headerName: 'Выполнено %', width: columnState['completionRate'] || 130, editable: editableStatus, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'status', headerName: 'Статус', width: columnState['status'] || 130, editable: editableStatus, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', cellClassName: (params) => params.value === 'Просрочен' ? 'cell-status-overdue' : '', },
        {
            field: 'prosrok', headerName: 'Дней просрочки', width: columnState['prosrok'] || 130, editable: editableStatus, type: 'number', headerClassName: 'super-app-theme--header', headerAlign: 'center', cellClassName: (params) =>
                params.value > 0 ? 'cell-status-overdue' : '',
        },
        { field: 'relevant', headerName: 'Актуальных', width: columnState['relevant'] || 130, editable: editableStatus, type: 'number', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        {
            field: 'sdel', headerName: 'Сделано', width: columnState['sdel'] || 130, type: 'number', headerAlign: 'center', editable: true, //(params) => params.row.ostatok > 0, // Ячейка редактируется только если остаток > 0
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
            }
        }

        return { status, prosrok };
    };

    const fetchData = () => {
        const params = { work: workData };


        axios.get('/api/workplace', { params })
            .then(response => {
                const updatedRows = response.data.map((order: any) => {
                    
                    // if (order.tasks.length <1) {
                    //     console.log(order.id);
                    // }

                    const receivedDateParts = order.tasks[0].pd.split('.');
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
                        status: order.tasks[0].status,
                        prosrok: prosrok,
                        actual: actual,
                        relevant: relevant,
                        sdel: todayWorkDone,
                        complete: totalWorkDone,
                        ostatok: order.tasks[0].ostatok,
                        completionRate: `${completionRate}%`,
                        ostatokInpt: order.ostatokInpt,
                    };
                });
                const sortedOrders = updatedRows.sort((a, b) => a.id - b.id);
                // setRows(sortedOrders);


                setRows(sortedOrders);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    useEffect(() => {
        fetchData(); // Первоначальная загрузка данных

        const interval = setInterval(fetchData, 5000); // Обновление данных каждые 3 секунды

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


    // Функция для обработки изменения ширины колонок
    const handleColumnResize = (params) => {
        setColumnState((prevState) => ({
            ...prevState,
            [params.colDef.field]: params.width,
        }));
    };


    const [columnVisibilityModel, setColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            article: false,
            complete: false,
            status: false,
            prosrok: false,
            relevant: false,

        });


    const exportToExcel = () => {
        // Проверка на существование apiRef и его current
        if (!apiRef.current) {
            console.error('apiRef is not initialized');
            return;
        }

        // Получаем идентификаторы развернутых строк
        const expandedRowIds = gridExpandedSortedRowIdsSelector(apiRef);

        // Получаем видимые колонки
        const visibleColumns = columns.filter(column => columnVisibilityModel[column.field] !== false);
        const columnHeaders = visibleColumns.map(column => column.headerName);

        // Фильтруем строки по id из expandedRowIds
        const filteredRows = rows
            .filter(row => expandedRowIds.includes(row.id)) // Оставляем только развернутые строки
            .sort((a, b) => expandedRowIds.indexOf(a.id) - expandedRowIds.indexOf(b.id)); // Сортируем по порядку из expandedRowIds

        // Формируем строки данных только с видимыми колонками для отфильтрованных строк
        const formattedRows = filteredRows.map(row => {
            const formattedRow = {};
            visibleColumns.forEach(column => {
                formattedRow[column.headerName] = row[column.field];
            });
            return formattedRow;
        });

        // Преобразуем данные в формат Excel
        const worksheet = XLSX.utils.json_to_sheet(formattedRows, { header: columnHeaders });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

        // Сохраняем Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'data.xlsx');
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

            <Paper style={{ height: '100%', width: '100%', margin: '20px 0' }}>
                <Box sx={{ height: 'calc(100vh - 200px)', width: '100%', overflow: 'auto' }}>
                    {/* Кнопка для экспорта */}
                    <button
                            onClick={exportToExcel}
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
                                marginBottom: '10px',
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
                            Экспорт в Excel
                        </button>
                    <DataGridPro
                        rows={rows}
                        columns={columns}
                        // pageSize={100}
                        apiRef={apiRef}
                        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                        processRowUpdate={handleProcessRowUpdate}
                        onProcessRowUpdateError={(error) => console.error('Ошибка при обновлении строки:', error)}
                        getRowClassName={getRowClassName}
                        onColumnWidthChange={handleColumnResize}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={(newModel) =>
                            setColumnVisibilityModel(newModel)
                        }
                        sx={{
                            '& .super-app-theme--header': {
                                backgroundColor: '#a43434',
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
                                backgroundColor: '#58ff1b !important',  // Зеленый цвет
                                // pointerEvents: 'none',  // Делаем ячейку неактивной
                                opacity: 0.4,
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: 'black'
                            },
                            '& .cell-ostatok-active': {
                                backgroundColor: '#8a8adc !important', // Синий цвет для активной ячейки
                                // opacity: 0.7,
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: 'black'
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
                </Box>
            </Paper>
        </div>
    );
}
