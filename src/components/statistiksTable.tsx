'use client'
import { Paper } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface OrderRow {
    id: number;
    launchNumber: string;
    orderName: string;
    nomenclature: string;
    quantity: number;
    pdDate: string;
    raskroiStat: number;
    zerkaloStat: number;
    nestingStat: number;
    kromkaStat: number;
    prisadkaStat: number;
    pokraskaStat: number;
    furnituraStat: number;
    konveerStat: number;
    sborkaStat: number;

}

export default function StatistikTable({ sektorsName }: { sektorsName: string }) {

    const [rows, setRows] = useState<OrderRow[]>([]);


    const columns: GridColDef[] = [
        { field: 'launchNumber', headerName: '№ запуска', editable: true, width: 70, filterable: true, headerAlign: 'center',headerClassName: 'super-app-theme--header' },
        { field: 'orderName', headerName: 'Заказ', editable: true, width: 130, filterable: true, headerAlign: 'center',headerClassName: 'super-app-theme--header' },
        { field: 'nomenclature', headerName: 'Номенклатура', editable: true, width: 130, filterable: true, headerAlign: 'center',headerClassName: 'super-app-theme--header' },
        { field: 'quantity', headerName: 'Количество', editable: false, width: 130, type: 'number', filterable: true, headerAlign: 'center',headerClassName: 'super-app-theme--header' },
        { field: 'pdDate', headerName: 'ПД', editable: false, width: 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'raskroiStat', headerName: 'Раскрой', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'zerkaloStat', headerName: 'Зеркала', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'nestingStat', headerName: 'Нестинг', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'kromkaStat', headerName: 'Кромка', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'prisadkaStat', headerName: 'Присадка', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'pokraskaStat', headerName: 'Покраска', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'furnituraStat', headerName: 'Фурнитура', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'konveerStat', headerName: 'Конвеер', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'sborkaStat', headerName: 'Сборка', width: 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', },


    ];
    const fetchData = () => {
        const params = { workstationName: sektorsName };

        axios.get('/api/statistiks', { params })
            .then(response => {
                const updatedRows = response.data.map((order: any) => {
                    // Инициализируем значения статусов
                    
                    
                    const statusMap: { [key: number]: string } = {
                        1: 'raskroiStat',
                        2: 'zerkaloStat',
                        3: 'nestingStat',
                        4: 'kromkaStat',
                        5: 'prisadkaStat',
                        6: 'pokraskaStat',
                        7: 'furnituraStat',
                        8: 'konveerStat',
                        9: 'sborkaStat',
                    };

                    // Инициализируем объект для статусов
                    const statuses = {
                        raskroiStat: '',
                        zerkaloStat: '',
                        nestingStat: '',
                        kromkaStat: '',
                        prisadkaStat: '',
                        pokraskaStat: '',
                        furnituraStat: '',
                        konveerStat: '',
                        sborkaStat: '',
                    };

                    // Проходим по всем заданиям
                    order.tasks.forEach((task: any) => {
                        const statusKey = statusMap[task.workstationId];
                        if (statusKey) {
                            statuses[statusKey] = `${task.completedPros} %`; // Заполняем статус
                        }
                    });

                    return {
                        id: order.id,
                        launchNumber: order.launchNumber,
                        orderName: order.orderName,
                        nomenclature: order.nomenclature,
                        quantity: order.quantity,
                        pdDate: order.pdDate,
                        ...statuses, // Распространяем статусы в объект
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
    }, []);

    return (
        <div>
            <div>
                <Paper style={{ height: '400px', width: '100%', margin: '20px 0' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}

                        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}

                        onProcessRowUpdateError={(error) => console.error('Ошибка при обновлении строки:', error)}
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
                           

                        }}
                    />
                </Paper>
            </div>
        </div>
    )
}