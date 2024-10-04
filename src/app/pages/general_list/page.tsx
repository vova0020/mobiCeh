'use client';
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridFilterModel, GridLogicOperator, GridRowModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';  // Импортируем библиотеку для работы с Excel
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
    const [showCompleted, setShowCompleted] = useState(false); 
    const [columnState, setColumnState] = useState<any>({}); // Состояние для ширины колонок
    

    // Получение данных при загрузке компонента
    useEffect(() => {
        axios.get('/api/createOrder')
            .then(response => {
                const ordersWithStatuses = response.data.map(order => ({
                    ...order,
                    pdDateNesting: order.pdDateNesting === 'NaN.NaN.NaN' ? '' : order.pdDateNesting,
                    pdDateRaskroi: order.pdDateRaskroi === 'NaN.NaN.NaN' ? '' : order.pdDateRaskroi,
                    completionRate: `${Math.round(order.completionRate)} %`,
                    raskroi: order.workStatuses[0]?.raskroi || false,
                    nesting: order.workStatuses[0]?.nesting || false,
                    zerkala: order.workStatuses[0]?.zerkala || false,
                    kromka: order.workStatuses[0]?.kromka || false,
                    prisadka: order.workStatuses[0]?.prisadka || false,
                    pokraska: order.workStatuses[0]?.pokraska || false,
                    furnitura: order.workStatuses[0]?.furnitura || false,
                    konveer: order.workStatuses[0]?.konveer || false,
                    sborka: order.workStatuses[0]?.sborka || false,
                    setki: order.workStatuses[0]?.setki || false,
                    guides: order.workStatuses[0]?.guides || false,
                    metal: order.workStatuses[0]?.metal || false,
                    provolka: order.workStatuses[0]?.provolka || false,
                    xba: order.workStatuses[0]?.xba || false,
                    moika: order.workStatuses[0]?.moika || false,
                    galivanika: order.workStatuses[0]?.galivanika || false,
                    termoplast: order.workStatuses[0]?.termoplast || false,
                    ypakovka: order.workStatuses[0]?.ypakovka || false,
                }));

                const sortedOrders = ordersWithStatuses.sort((a, b) => a.id - b.id);
                setRows(sortedOrders);

                // Устанавливаем новый ID как максимальный ID + 1
                const maxId = sortedOrders.length > 0 ? Math.max(...sortedOrders.map(order => order.id)) : 0;
                setNewRowId(maxId + 1);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }, []);

    const filteredRows = showCompleted ? rows.filter(row => row.isCompleted === false) : rows;

    


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
                        id: newRowId + index,
                        orderName: row[0] || '',
                        article: row[1] || '',
                        receivedDate: formatDateFromExcel(row[2]),
                        nomenclature: row[3] || '',
                        quantity: row[4] || 0,
                        pdDate: formatDateFromExcel(row[5]),
                        raskroi: row[6]?.trim().toLowerCase() === 'да',
                        pdDateRaskroi: formatDateFromExcel(row[7])|| '',
                        nesting: row[8]?.trim().toLowerCase() === 'да',
                        pdDateNesting: formatDateFromExcel(row[9])|| '',
                        zerkala: row[10]?.trim().toLowerCase() === 'да',
                        kromka: row[11]?.trim().toLowerCase() === 'да',
                        prisadka: row[12]?.trim().toLowerCase() === 'да',
                        metal: row[13]?.trim().toLowerCase() === 'да',
                        pokraska: row[14]?.trim().toLowerCase() === 'да',
                        furnitura: row[15]?.trim().toLowerCase() === 'да',
                        konveer: row[16]?.trim().toLowerCase() === 'да',
                        sborka: row[17]?.trim().toLowerCase() === 'да',
                        setki: row[18]?.trim().toLowerCase() === 'да',
                        provolka: row[19]?.trim().toLowerCase() === 'да',
                        xba: row[20]?.trim().toLowerCase() === 'да',
                        moika: row[21]?.trim().toLowerCase() === 'да',
                        galivanika: row[22]?.trim().toLowerCase() === 'да',
                        termoplast: row[23]?.trim().toLowerCase() === 'да',
                        ypakovka: row[24]?.trim().toLowerCase() === 'да',
                        guides: row[25]?.trim().toLowerCase() === 'да',
                    };
                }
                return null;
            }).filter(row => row !== null);
            console.log(loadedRows);
            

            setRows(prevRows => [...prevRows, ...loadedRows]);
            setNewRows(loadedRows);
            setNewRowId(newRowId + loadedRows.length); // Обновляем следующий доступный ID
            setIsNewRowAdded(true);
        };
        reader.readAsArrayBuffer(file);
    };

    // Добавление новой строки
    const handleAddRow = () => {
        const newRow: OrderRow = {
            id: newRowId,
            launchNumber: '',
            orderName: '',
            article: '',
            receivedDate: '',
            status: '',
            isCompleted: false,
            completionRate: 0,
            nomenclature: '',
            pdDateRaskroi: '',
            pdDateNesting: '',
            raskroi: false,
            nesting: false,
            zerkala: false,
            kromka: false,
            prisadka: false,
            pokraska: false,
            furnitura: false,
            konveer: false,
            sborka: false,
            quantity: 0,
            pdDate: '',
            setki: false,
            guides: false,
            metal: false,
            provolka: false,
            xba: false,
            moika: false,
            galivanika: false,
            termoplast: false,
            ypakovka: false,
        };
        setRows((prevRows) => [...prevRows, newRow]);
        setNewRowId(newRowId + 1); // Увеличиваем newRowId на 1
        setNewRows((prevNewRows) => [...prevNewRows, newRow]);
        setIsNewRowAdded(true);
    };


    // Регулярное выражение для проверки формата даты ДД.ММ.ГГГГ
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;

    // Обработчик изменения строки
    const handleRowEdit = (newRow: GridRowModel) => {
        // Проверка, если раскрой отмечен, то поле pdDateRaskroi должно быть заполнено и в правильном формате
        if (newRow.raskroi) {
            if (!newRow.pdDateRaskroi || !dateRegex.test(newRow.pdDateRaskroi.trim())) {
                alert('Заполните корректную дату для раскроя в формате ДД.ММ.ГГГГ (например, 15.10.2024)!');
                return rows.find(row => row.id === newRow.id); // Возвращаем предыдущую строку, чтобы отменить изменение
            }
        }

        // Проверка, если нестинг отмечен, то поле pdDateNesting должно быть заполнено и в правильном формате
        if (newRow.nesting) {
            if (!newRow.pdDateNesting || !dateRegex.test(newRow.pdDateNesting.trim())) {
                alert('Заполните корректную дату для нестинга в формате ДД.ММ.ГГГГ (например, 15.10.2024)!');
                return rows.find(row => row.id === newRow.id); // Возвращаем предыдущую строку, чтобы отменить изменение
            }
        }

        const updatedRows = rows.map(row => (row.id === newRow.id ? { ...row, ...newRow } : row));
        setRows(updatedRows);

        // Установите isEditing в true, только если редактируем существующую строку
        if (newRows.find(row => row.id === newRow.id)) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
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

                    };
                    await axios.post('/api/createOrder', rowToSend);
                    console.log('Данные строки успешно сохранены');
                    alert('Добавленные строки успешно сохранены');
                })
            );
            setIsNewRowAdded(false); // Скрыть кнопку "Сохранить новую строку"
            setNewRows([]); // Очистить состояние новых строк после сохранения
        } catch (error) {
            console.error('Ошибка при сохранении новых строк:', error);
            alert('Ошибка при сохранении новых строк:', error);
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
                                pdDateRaskroi: row.pdDateRaskroi,
                                pdDateNesting: row.pdDateNesting,
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
                                konveer: row.konveer,
                                sborka: row.sborka,
                                setki: row.setki,
                                guides: row.guides,
                                metal: row.metal,
                                provolka: row.provolka,
                                xba: row.xba,
                                moika: row.moika,
                                galivanika: row.galivanika,
                                termoplast: row.termoplast,
                                ypakovka: row.ypakovka,
                            }
                        };
                        await axios.post(`/api/orderUpdate`, rowToSend);
                        console.log(`Данные строки с id ${row.id} успешно обновлены`);
                        alert(`Данные № Заказа ${row.id} успешно обновлены`);
                    }
                })
            );
            setIsEditing(false); // Скрыть кнопку "Сохранить изменения"
            setEditedRowIds(new Set()); // Очистить состояние изменённых строк
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
            alert('Ошибка при сохранении изменений:', error);
        }
    };

    const getRowClassName = (params) => {
        // console.log(params.row.status);

        switch (params.row.status) {
            case 'В работе':
                return 'cell-status-work';
            case 'Завершен':
                return 'cell-status-complete';
            default:
                return ''; // Ожидание: строка без класса
        }
    };
    const columns: GridColDef[] = [
        { field: 'id', headerName: '№ запуска', editable: true, width: columnState['id'] ||  70 },
        { field: 'orderName', headerName: 'Наименование заказа', editable: true, width: columnState['orderName'] ||  150 },
        { field: 'article', headerName: 'Артикул', editable: true, width: columnState['article'] ||  100 },
        { field: 'receivedDate', headerName: 'Дата получения', editable: true, width: columnState['receivedDate'] ||  130 },
        { field: 'status', headerName: 'Статус', editable: true, width: columnState['status'] ||  90 },
        { field: 'isCompleted', headerName: 'Завершен', editable: true, type: 'boolean', width: columnState['isCompleted'] ||  80 },
        { field: 'completionRate', headerName: '% Выполнения', editable: true, type: 'number', width: columnState['completionRate'] ||  130 },
        { field: 'nomenclature', headerName: 'Номенклатура', editable: true, width: columnState['nomenclature'] ||  150 },
        { field: 'quantity', headerName: 'Количество', editable: true, type: 'number', width: columnState['quantity'] ||  90 },
        { field: 'pdDate', headerName: 'План. дата', editable: true, width: columnState['pdDate'] ||  130 },
        { field: 'raskroi', headerName: 'Раскрой', editable: true, type: 'boolean', width: columnState['raskroi'] ||  130 },
        { field: 'pdDateRaskroi', headerName: 'Пд для Раскроя', editable: true,  width: columnState['pdDateRaskroi'] ||  130 },
        { field: 'nesting', headerName: 'Нестинг', editable: true, type: 'boolean', width: columnState['nesting'] ||  130 },
        { field: 'pdDateNesting', headerName: 'Пд для Нестинга', editable: true, width: columnState['pdDateNesting'] ||  130},
        { field: 'zerkala', headerName: 'Зеркала', editable: true, type: 'boolean', width: columnState['zerkala'] ||  130},
        { field: 'kromka', headerName: 'Кромка', editable: true, type: 'boolean', width: columnState['kromka'] ||  130 },
        { field: 'prisadka', headerName: 'Присадка', editable: true, type: 'boolean', width: columnState['prisadka'] ||  130 },
        { field: 'metal', headerName: 'Металлокаркасы', editable: true, type: 'boolean', width: columnState['metal'] ||  130 },
        { field: 'pokraska', headerName: 'Покраска', editable: true, type: 'boolean' , width: columnState['pokraska'] ||  130},
        { field: 'furnitura', headerName: 'Фурнитура', editable: true, type: 'boolean', width: columnState['furnitura'] ||  130},
        { field: 'konveer', headerName: 'Конвейер', editable: true, type: 'boolean', width: columnState['konveer'] ||  130 },
        { field: 'sborka', headerName: 'Сборка', editable: true, type: 'boolean' , width: columnState['sborka'] ||  130},
        { field: 'setki', headerName: 'Сетки', editable: true, type: 'boolean', width: columnState['setki'] ||  130 },
        { field: 'provolka', headerName: 'Подготовка', editable: true, type: 'boolean', width: columnState['provolka'] ||  130 },
        { field: 'xba', headerName: 'ХВА', editable: true, type: 'boolean', width: columnState['xba'] ||  130 },
        { field: 'moika', headerName: 'Мойка', editable: true, type: 'boolean', width: columnState['moika'] ||  130 },
        { field: 'galivanika', headerName: 'Гальваника', editable: true, type: 'boolean', width: columnState['galivanika'] ||  130 },
        { field: 'termoplast', headerName: 'Термопласт', editable: true, type: 'boolean', width: columnState['termoplast'] ||  130 },
        { field: 'ypakovka', headerName: 'Упаковка крепеж', editable: true, type: 'boolean', width: columnState['ypakovka'] ||  130 },
        { field: 'guides', headerName: 'Направляющие', editable: true, type: 'boolean', width: columnState['guides'] ||  130 },
    ];

    // Функция для обработки изменения ширины колонок
    const handleColumnResize = (params) => {
        setColumnState((prevState) => ({
            ...prevState,
            [params.colDef.field]: params.width,
        }));
    };

    return (
        <Paper sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <Navbar1 />
            <Button onClick={handleAddRow}>Добавить строку</Button>
            <Button component="label">
                Загрузить Excel файл
                <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
            </Button>
            {isEditing && <Button onClick={handleSaveChanges}>Сохранить изменения</Button>}
            {isNewRowAdded && <Button onClick={handleSaveNew}>Сохранить новые строки</Button>}
            <FormControlLabel
                control={<Checkbox checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />}
                label="Показать только незавершенные"
            />
            <Box sx={{ height: 'calc(110vh - 200px)', width: '100%', overflow: 'auto' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    filterModel={filterModel}
                    onFilterModelChange={setFilterModel}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                    experimentalFeatures={{ newEditingApi: true }}
                    processRowUpdate={handleRowEdit}
                    getRowClassName={getRowClassName}
                    onColumnWidthChange={handleColumnResize}
                    sx={{
                        '& .cell-status-work': {
                            backgroundColor: '#f9ff7e !important',
                        },
                        '& .cell-status-complete': {
                            backgroundColor: '#5bfa22 !important',
                        },
                    }}
                />
            </Box>
        </Paper>
    );
    
}
