'use client';
/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridFilterModel, GridLogicOperator, GridRowModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import { Box, Button, FormControlLabel, Checkbox } from '@mui/material';
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
    const [editedRowIds, setEditedRowIds] = useState<Set<number>>(new Set());
    const [rows, setRows] = useState<OrderRow[]>([]);
    const [newRowId, setNewRowId] = useState<number>(0);
    const [newRows, setNewRows] = useState([]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
        logicOperator: GridLogicOperator.And,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isNewRowAdded, setIsNewRowAdded] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);
    const [columnState, setColumnState] = useState<any>({});

    useEffect(() => {
        axios.get('/api/adminka')
            .then(response => {
                const ordersWithStatuses = response.data.map(order => ({
                    ...order,
                    pdDateNesting: order.pdDateNesting === 'NaN.NaN.NaN' ? '' : order.pdDateNesting,
                    pdDateRaskroi: order.pdDateRaskroi === 'NaN.NaN.NaN' ? '' : order.pdDateRaskroi,
                    completionRate: `${Math.round(order.completionRate)}%`,
                    raskroi: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'раскрой' && task.workDone.length > 0),
                    nesting: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'нестинг' && task.workDone.length > 0),
                    zerkala: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'зеркала' && task.workDone.length > 0),
                    kromka: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'кромка' && task.workDone.length > 0),
                    prisadka: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'присадка' && task.workDone.length > 0),
                    pokraska: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'покраска' && task.workDonePokraska.length > 0),
                    furnitura: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'фурнитура' && task.workDone.length > 0),
                    konveer: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'конвеер' && task.workDone.length > 0),
                    sborka: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'сборка' && task.workDone.length > 0),
                    setki: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'сетки' && task.workDone.length > 0),
                    guides: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'направляющие' && task.workDone.length > 0),
                    metal: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'метал' && task.workDone.length > 0),
                    provolka: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'Подготовка' && task.workDone.length > 0),
                    xba: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'хва' && task.workDone.length > 0),
                    moika: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'мойка' && task.workDone.length > 0),
                    galivanika: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'гальваника' && task.workDone.length > 0),
                    termoplast: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'термопласт' && task.workDone.length > 0),
                    ypakovka: order.tasks.some(task => task.workstation.name.trim().toLowerCase() === 'упаковка' && task.workDone.length > 0),
                }));

                const sortedOrders = ordersWithStatuses.sort((a, b) => a.id - b.id);
                setRows(sortedOrders);
                const maxId = sortedOrders.length > 0 ? Math.max(...sortedOrders.map(order => order.id)) : 0;
                setNewRowId(maxId + 1);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }, []);
    console.log(rows);


    const filteredRows = showCompleted ? rows.filter(row => row.isCompleted === false) : rows;

    const handleRowEdit = (newRow: GridRowModel) => {
        const updatedRows = rows.map(row => (row.id === newRow.id ? { ...row, ...newRow } : row));
        setRows(updatedRows);

        if (newRows.find(row => row.id === newRow.id)) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }

        setEditedRowIds(prevIds => {
            const newIds = new Set(prevIds);
            newIds.add(newRow.id);
            return newIds;
        });

        setNewRows(prevNewRows => {
            return prevNewRows.map(row => (row.id === newRow.id ? { ...row, ...newRow } : row));
        });

        return newRow;
    };

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
                        await axios.post('/api/orderUpdate', rowToSend);
                        console.log(`Данные строки с id ${row.id} успешно обновлены`);
                        alert(`Данные № Заказа ${row.id} успешно обновлены`);
                    }
                })
            );
            setIsEditing(false);
            setEditedRowIds(new Set());
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
            alert('Ошибка при сохранении изменений:', error);
        }
    };

    const clearStatus = (rowId: number, field: keyof OrderRow) => {
        setRows(prevRows => prevRows.map(row => {
            if (row.id === rowId) {
                // return { ...row, [field]: false };
                console.log(row);

            }
            return row;
        }));
    };

    const getRowClassName = (params) => {
        switch (params.row.status) {
            case 'В работе':
                return 'cell-status-work';
            case 'Завершен':
                return 'cell-status-complete';
            default:
                return '';
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: '№ запуска', editable: true, width: columnState['id'] || 70 },
        { field: 'orderName', headerName: 'Наименование заказа', editable: true, width: columnState['orderName'] || 150 },
        { field: 'article', headerName: 'Артикул', editable: true, width: columnState['article'] || 100 },
        { field: 'receivedDate', headerName: 'Дата получения', editable: true, width: columnState['receivedDate'] || 190 },
        { field: 'status', headerName: 'Статус', editable: true, width: columnState['status'] || 90 },
        { field: 'isCompleted', headerName: 'Завершен', editable: true, type: 'boolean', width: columnState['isCompleted'] || 80 },
        { field: 'completionRate', headerName: '% Выполнения', editable: true, type: 'number', width: columnState['completionRate']  },
        { field: 'nomenclature', headerName: 'Номенклатура', editable: true, width: columnState['nomenclature']  },
        { field: 'quantity', headerName: 'Количество', editable: true, type: 'number', width: columnState['quantity'] || 90 },
        { field: 'pdDate', headerName: 'План. дата', editable: true, width: columnState['pdDate']  },
        {
            field: 'raskroi',
            headerName: 'Раскрой',
            width: columnState['raskroi'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.raskroi !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'raskroi')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'nesting',
            headerName: 'Нестинг',
            width: columnState['nesting'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.nesting !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'nesting')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'zerkala',
            headerName: 'Зеркала',
            width: columnState['zerkala'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.zerkala !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'zerkala')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'kromka',
            headerName: 'Кромка',
            width: columnState['kromka'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.kromka !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'kromka')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'prisadka',
            headerName: 'Присадка',
            width: columnState['prisadka'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.prisadka !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'prisadka')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'metal',
            headerName: 'Метал',
            width: columnState['metal'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.metal !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'metal')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'pokraska',
            headerName: 'Покраска',
            width: columnState['pokraska'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.pokraska !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'pokraska')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        }, {
            field: 'furnitura',
            headerName: 'Фурнитура',
            width: columnState['furnitura'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.furnitura !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'furnitura')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'konveer',
            headerName: 'Конвеер',
            width: columnState['konveer'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.konveer !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'konveer')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'sborka',
            headerName: 'Сборка',
            width: columnState['sborka'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.sborka !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'sborka')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'setki',
            headerName: 'Сетки',
            width: columnState['setki'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.setki !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'setki')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'provolka',
            headerName: 'Подготовка',
            width: columnState['provolka'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.provolka !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'provolka')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'xba',
            headerName: 'ХВА',
            width: columnState['xba'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.xba !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'xba')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'moika',
            headerName: 'Мойка',
            width: columnState['moika'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.moika !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'moika')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'galivanika',
            headerName: 'Гальваника',
            width: columnState['galivanika'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.galivanika !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'galivanika')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'termoplast',
            headerName: 'Термопласт',
            width: columnState['termoplast'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.termoplast !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'termoplast')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'ypakovka',
            headerName: 'Упаковка',
            width: columnState['ypakovka'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.ypakovka !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'ypakovka')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
        {
            field: 'guides',
            headerName: 'Направляющие',
            width: columnState['guides'] || 190,
            renderCell: (params) => {
                const isDisabled = params.row.guides !== true; // Условие, если zerkala не true, кнопка отключена

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clearStatus(params.row.id, 'guides')}
                        disabled={isDisabled}  // Используем значение isDisabled для активации/деактивации
                    >
                        Удалить данные
                    </Button>
                );
            },
        },
    
    ];

    return (
        <Paper sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <Navbar1 />
            <FormControlLabel
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
            </Box>
        </Paper>
    );
}
