'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridFilterModel, GridLogicOperator, GridRowModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import { Button } from '@mui/material';
import axios from 'axios';
import NavbarEx from '@/components/ui/navbarEx';

// Определяем тип для строки таблицы
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
    raskroi: boolean;
    nesting: boolean;
    zerkala: boolean;
    kromka: boolean;
    prisadka: boolean;
    pokraska: boolean;
    furnitura: boolean;
    metall: boolean;
    setki: boolean;
    konveer: boolean;
    sborka: boolean;
    quantity: number;
    pdDate: string;
}

export default function GeneralList() {
    const [rows, setRows] = useState<OrderRow[]>([]);
    const [newRowId, setNewRowId] = useState<number>(0);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
        logicOperator: GridLogicOperator.And,
    });
    const [isEditing, setIsEditing] = useState(false); // Отслеживаем, редактируется ли сейчас строка

    // Получение данных из базы данных при загрузке компонента
    useEffect(() => {
        axios.get('/api/createOrder')
            .then(response => {
                // Преобразуем данные, чтобы из workStatuses взять нужные поля и включить в строки таблицы
                const ordersWithStatuses = response.data.map(order => ({
                    ...order,
                    raskroi: order.workStatuses[0]?.raskroi || false,
                    nesting: order.workStatuses[0]?.nesting || false,
                    zerkala: order.workStatuses[0]?.zerkala || false,
                    kromka: order.workStatuses[0]?.kromka || false,
                    prisadka: order.workStatuses[0]?.prisadka || false,
                    pokraska: order.workStatuses[0]?.pokraska || false,
                    furnitura: order.workStatuses[0]?.furnitura || false,
                    metall: order.workStatuses[0]?.metall || false,
                    setki: order.workStatuses[0]?.setki || false,
                    konveer: order.workStatuses[0]?.konveer || false,
                    sborka: order.workStatuses[0]?.sborka || false,
                }));
                setRows(ordersWithStatuses);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }, []);

    // Добавление новой строки
    const handleAddRow = () => {
        const newRow: OrderRow = {
            id: Date.now(), // Используем уникальный id на основе текущего времени
            launchNumber: '',
            orderName: '',
            article: '',
            receivedDate: '',
            status: '',
            isCompleted: false,
            completionRate: 0,
            nomenclature: '',
            raskroi: false,
            nesting: false,
            zerkala: false,
            kromka: false,
            prisadka: false,
            pokraska: false,
            furnitura: false,
            metall: false,
            setki: false,
            konveer: false,
            sborka: false,
            quantity: 0,
            pdDate: ''
        };
        setRows((prevRows) => [...prevRows, newRow]);
        setNewRowId(newRow.id);
    };

    // Обработчик изменения строки
    const handleRowEdit = (newRow: GridRowModel, oldRow: GridRowModel) => {
        setIsEditing(true); // Запоминаем, что редактирование идет
        const updatedRows = rows.map(row => (row.id === newRow.id ? { ...row, ...newRow } : row));
        setRows(updatedRows);
        return newRow; // Возвращаем новую строку для обновления DataGrid
    };

    // Отправка данных новой строки в базу данных
    const handleSaveNew = async () => {
        try {
            const newRow = rows.find(row => row.id === newRowId);
            if (newRow) {
                const rowToSend = {
                    ...newRow,
                    quantity: Number(newRow.quantity) // Преобразуем в число
                };
                await axios.post('/api/createOrder', rowToSend);
                console.log('Данные успешно сохранены');
                const updatedRows = rows.filter(row => row.id !== newRowId);
                setRows([...updatedRows, rowToSend]);
                setNewRowId(0); // Сбрасываем newRowId после сохранения
            }
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    };

    // Сохранение изменений измененных строк в базу данных
    // Сохранение изменений измененных строк в базу данных
    const handleSaveChanges = async () => {
        if (!isEditing) return; // Если нет изменений, выходим

        try {
            await Promise.all(
                rows.map(async (row) => {
                    if (row.id !== newRowId) { // Не отправляем новую строку
                        const rowToSend = {
                            ...row,
                            orders: {
                                launchNumber:row.launchNumber,
                                orderName:row.orderName,
                                article:row.article,
                                receivedDate:row.receivedDate,
                                status:row.status,
                                isCompleted:row.isCompleted,
                                completionRate:row.completionRate,
                                nomenclature:row.nomenclature,
                                quantity:row.quantity,
                                pdDate:row.pdDate,
                            },
                            id: row.id, // Передаем id для идентификации
                            workStatuses: { // Отправляем связанные статусы участков
                                raskroi: row.raskroi,
                                nesting: row.nesting,
                                zerkala: row.zerkala,
                                kromka: row.kromka,
                                prisadka: row.prisadka,
                                pokraska: row.pokraska,
                                furnitura: row.furnitura,
                                metall: row.metall,
                                setki: row.setki,
                                konveer: row.konveer,
                                sborka: row.sborka,
                            }
                        };
                        await axios.post(`/api/orderUpdate`, rowToSend); // Используем POST для обновления
                        console.log(`Данные строки с id ${row.id} успешно обновлены`);
                    }
                })
            );
            setIsEditing(false); // Сбрасываем флаг редактирования
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };


    const columns: GridColDef[] = [
        { field: 'launchNumber', headerName: '№ запуска', editable: true, width: 70, filterable: true },
        { field: 'orderName', headerName: 'Заказ', editable: true, width: 130, filterable: true },
        { field: 'article', headerName: 'Артикул', editable: true, width: 130, filterable: true },
        { field: 'receivedDate', headerName: 'Дата поступления', editable: true, width: 130, filterable: true },
        { field: 'status', headerName: 'Статус', editable: true, width: 130, filterable: true },
        { field: 'isCompleted', headerName: 'Завершен', editable: true, width: 130, type: 'boolean', filterable: true },
        { field: 'completionRate', headerName: 'Выполнено,%', editable: true, width: 130, filterable: true },
        { field: 'nomenclature', headerName: 'Номенклатура', editable: true, width: 130, filterable: true },
        { field: 'raskroi', headerName: 'Раскрой', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'nesting', headerName: 'Нестинг', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'zerkala', headerName: 'Зеркала', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'kromka', headerName: 'Кромка', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'prisadka', headerName: 'Присадка', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'pokraska', headerName: 'Покраска', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'furnitura', headerName: 'Фурнитура', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'metall', headerName: 'Металл', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'setki', headerName: 'Сетки', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'konveer', headerName: 'Конвейер', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'sborka', headerName: 'Сборка', width: 130, editable: true, type: 'boolean', filterable: true },
        { field: 'quantity', headerName: 'Количество', editable: true, width: 130, type: 'number', filterable: true },
        { field: 'pdDate', headerName: 'ПД покупателя', editable: true, width: 130, filterable: true },
    ];

    return (
        <div>
            <NavbarEx />

            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                    rows={rows}
                    columns={columns}
                    filterModel={filterModel}
                    onFilterModelChange={(newFilterModel) => {
                        setFilterModel({
                            ...newFilterModel,
                            logicOperator: newFilterModel.logicOperator || GridLogicOperator.And,
                        });
                    }}
                    processRowUpdate={handleRowEdit} // Используем handleRowEdit для редактирования
                    sx={{ border: 0 }}
                />
            </Paper>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button variant="contained" onClick={handleAddRow} style={{ marginTop: '10px' }}>
                    Добавить новую строку
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveNew} style={{ marginTop: '10px' }}>
                    Сохранить новую строку
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveChanges} style={{ marginTop: '10px' }}>
                    Сохранить изменения
                </Button>
            </div>
        </div>
    );
}