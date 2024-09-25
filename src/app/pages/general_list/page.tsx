'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridFilterModel, GridLogicOperator, GridRowModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import { Button } from '@mui/material';
import axios from 'axios';
import NavbarEx from '@/components/ui/navbarEx';
import * as XLSX from 'xlsx';  // Импортируем библиотеку для работы с Excel

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

// Функция для преобразования числового формата Excel в формат ДД.ММ.ГГГГ
const formatDateFromExcel = (excelDate) => {
    if (!excelDate) return '';

    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000)); // Преобразование числа в дату
    const day = date.getDate().toString().padStart(2, '0');  // Получаем день с ведущим нулём
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Получаем месяц с ведущим нулём
    const year = date.getFullYear();  // Получаем год

    return `${day}.${month}.${year}`;  // Возвращаем форматированную строку ДД.ММ.ГГГГ
};


export default function GeneralList() {
    const [editedRowIds, setEditedRowIds] = useState<Set<number>>(new Set());

    const [rows, setRows] = useState<OrderRow[]>([]);
    const [newRowId, setNewRowId] = useState<number>(0);
    // Создайте состояние для хранения новых строк
    const [newRows, setNewRows] = useState([]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
        logicOperator: GridLogicOperator.And,
    });
    const [isEditing, setIsEditing] = useState(false); // Редактирование существующих строк
    const [isNewRowAdded, setIsNewRowAdded] = useState(false); // Новая строка добавлена

    // Получение данных при загрузке компонента
    useEffect(() => {
        axios.get('/api/createOrder')
            .then(response => {
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
    
                // Сортировка по id перед установкой в состояние
                const sortedOrders = ordersWithStatuses.sort((a, b) => a.id - b.id);
                setRows(sortedOrders);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }, []);
    

    // Обработчик загрузки Excel файла
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            const loadedRows = worksheet.slice(1).map((row, index) => {
                if (row[0]) {
                    return {
                        id: index + 1,
                        launchNumber: row[0] || '',
                        orderName: row[1] || '',
                        article: row[2] || '',
                        receivedDate: formatDateFromExcel(row[3]),
                        status: row[4] || '',
                        isCompleted: row[5] === 'да',
                        completionRate: row[6] || 0,
                        nomenclature: row[7] || '',
                        quantity: row[8] || 0,
                        pdDate: formatDateFromExcel(row[9]),
                        raskroi: row[10] === 'да',
                        nesting: row[11] === 'да',
                        zerkala: row[12] === 'да',
                        kromka: row[13] === 'да',
                        prisadka: row[14] === 'да',
                        pokraska: row[15] === 'да',
                        furnitura: row[16] === 'да',
                        konveer: row[17] === 'да',
                        sborka: row[18] === 'да'
                    };
                }
                return null;
            }).filter(row => row !== null);

            setRows(prevRows => [...prevRows, ...loadedRows]);
            setNewRows(loadedRows); // Сохраните загруженные строки в новом состоянии
            setIsNewRowAdded(true);
        };
        reader.readAsArrayBuffer(file);
    };

    // Добавление новой строки
    const handleAddRow = () => {
        const newRow: OrderRow = {
            id: Date.now(),
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
        setNewRows((prevNewRows) => [...prevNewRows, newRow]);
        setIsNewRowAdded(true); // Показать кнопку "Сохранить новую строку"
    };

    // Обработчик изменения строки
// Обработчик изменения строки
const handleRowEdit = (newRow: GridRowModel) => {
    const updatedRows = rows.map(row => (row.id === newRow.id ? { ...row, ...newRow } : row));
    setRows(updatedRows);

    // Установите isEditing в true, только если редактируем существующую строку
    if (newRows.find(row => row.id === newRow.id)) {
        // Если это новая строка, не меняем isEditing
        setIsEditing(false);
    } else {
        setIsEditing(true); // Устанавливаем isEditing в true для существующих строк
    }

    // Добавление ID изменённой строки в состояние
    setEditedRowIds(prevIds => {
        const newIds = new Set(prevIds);
        newIds.add(newRow.id);
        return newIds;
    });

    // Если строка новая, обновите newRows
    setNewRows(prevNewRows => {
        return prevNewRows.map(row => (row.id === newRow.id ? { ...row, ...newRow } : row));
    });

    return newRow;
};


    

    // Сохранение новых строк в базу данных
    const handleSaveNew = async () => {
        try {
            await Promise.all(
                newRows.map(async (newRow) => {
                    const rowToSend = {
                        ...newRow,
                        launchNumber: String(newRow.launchNumber), // Преобразуем в строку
                        quantity: Number(newRow.quantity),
                        metall: false, // Убедитесь, что здесь есть значение (true или false)
                        setki: false,
                    };
                    await axios.post('/api/createOrder', rowToSend);
                    console.log('Данные строки успешно сохранены');
                })
            );
            setIsNewRowAdded(false); // Скрыть кнопку "Сохранить новую строку"
            setNewRows([]); // Очистить состояние новых строк после сохранения
        } catch (error) {
            console.error('Ошибка при сохранении новых строк:', error);
        }
    };
    // Сохранение изменений в существующих строках
    const handleSaveChanges = async () => {
        if (!isEditing) return;
    
        try {
            await Promise.all(
                Array.from(editedRowIds).map(async (id) => {
                    const row = rows.find(row => row.id === id);
                    if (row) {
                        const rowToSend = {
                            ...row,
                            orders: {
                                launchNumber: row.launchNumber,
                                orderName: row.orderName,
                                article: row.article,
                                receivedDate: row.receivedDate,
                                status: row.status,
                                isCompleted: row.isCompleted,
                                completionRate: row.completionRate,
                                nomenclature: row.nomenclature,
                                quantity: row.quantity,
                                pdDate: row.pdDate,
                            },
                            id: row.id,
                            workStatuses: {
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
                        await axios.post(`/api/orderUpdate`, rowToSend);
                        console.log(`Данные строки с id ${row.id} успешно обновлены`);
                    }
                })
            );
            setIsEditing(false); // Скрыть кнопку "Сохранить изменения"
            setEditedRowIds(new Set()); // Очистить состояние изменённых строк
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };
    

    const columns: GridColDef[] = [
        { field: 'launchNumber', headerName: '№ запуска', editable: true, width: 70 },
        { field: 'orderName', headerName: 'Наименование заказа', editable: true, width: 150 },
        { field: 'article', headerName: 'Артикул', editable: true, width: 100 },
        { field: 'receivedDate', headerName: 'Дата получения', editable: true, width: 130 },
        { field: 'status', headerName: 'Статус', editable: true, width: 90 },
        { field: 'isCompleted', headerName: 'Завершен', editable: true, type: 'boolean', width: 80 },
        { field: 'completionRate', headerName: '% Выполнения', editable: true, type: 'number', width: 130 },
        { field: 'nomenclature', headerName: 'Номенклатура', editable: true, width: 150 },
        { field: 'quantity', headerName: 'Количество', editable: true, type: 'number', width: 90 },
        { field: 'pdDate', headerName: 'План. дата', editable: true, width: 130 },
        { field: 'raskroi', headerName: 'Раскрой', editable: true, type: 'boolean' },
        { field: 'nesting', headerName: 'Нестинг', editable: true, type: 'boolean' },
        { field: 'zerkala', headerName: 'Зеркала', editable: true, type: 'boolean' },
        { field: 'kromka', headerName: 'Кромка', editable: true, type: 'boolean' },
        { field: 'prisadka', headerName: 'Присадка', editable: true, type: 'boolean' },
        { field: 'pokraska', headerName: 'Покраска', editable: true, type: 'boolean' },
        { field: 'furnitura', headerName: 'Фурнитура', editable: true, type: 'boolean' },
        { field: 'metall', headerName: 'Металл', editable: true, type: 'boolean' },
        { field: 'setki', headerName: 'Сетки', editable: true, type: 'boolean' },
        { field: 'konveer', headerName: 'Конвейер', editable: true, type: 'boolean' },
        { field: 'sborka', headerName: 'Сборка', editable: true, type: 'boolean' }
    ];

    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <NavbarEx />
            <Button onClick={handleAddRow}>Добавить строку</Button>
            <Button component="label">
                Загрузить Excel файл
                <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
            </Button>
            {isEditing && <Button onClick={handleSaveChanges}>Сохранить изменения</Button>}
            {isNewRowAdded && <Button onClick={handleSaveNew}>Сохранить новую строку</Button>}
            <DataGrid
                rows={rows}
                columns={columns}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                pageSize={5}
                rowsPerPageOptions={[5]}
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={handleRowEdit}
            />
        </Paper>
    );
}
