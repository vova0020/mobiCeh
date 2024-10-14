'use client'

/* eslint-disable */
import { Box, Paper } from '@mui/material'
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
    status: string;
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
    metalStat: number;
    setkiStat: number;
    provolkaStat: number;
    hvaStat: number;
    moikaStat: number;
    galvanikaStat: number;
    termoplastStat: number;
    upakovkaStat: number;
    guidesStat: number;
    raskroiCompl: number;
    zerkaloCompl: number;
    nestingCompl: number;
    kromkaCompl: number;
    prisadkaCompl: number;
    pokraskaCompl: number;
    furnituraCompl: number;
    konveerCompl: number;
    sborkaCompl: number;
    metalCompl: number;
    setkiCompl: number;
    provolkaCompl: number;
    hvaCompl: number;
    moikaCompl: number;
    galvanikaCompl: number;
    termoplastCompl: number;
    upakovkaCompl: number;
    guidesCompl: number;

}

export default function StatistikTable() {

    const [rows, setRows] = useState<OrderRow[]>([]);
    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; value: number | null; quantity: number | null } | null>(null);
    const [columnState, setColumnState] = useState<any>({}); // Состояние для ширины колонок


    const handleContextMenu = (event: React.MouseEvent, value: number, quantity: number) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            value: value,
            quantity: quantity
        });
    };

    const handleClose = () => {
        setContextMenu(null);
    };


    const columns: GridColDef[] = [
        { field: 'launchNumber', headerName: '№ запуска', editable: true, width: columnState['launchNumber'] || 70, filterable: true, headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'orderName', headerName: 'Заказ', editable: true, width: columnState['orderName'] || 130, filterable: true, headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'nomenclature', headerName: 'Номенклатура', editable: true, width: columnState['nomenclature'] || 130, filterable: true, headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'article', headerName: 'Артикул', editable: true, width: columnState['article'] || 100, filterable: true, headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'quantity', headerName: 'Количество', editable: false, width: columnState['quantity'] || 130, type: 'number', filterable: true, headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'pdDate', headerName: 'ПД', editable: false, width: columnState['pdDate'] || 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'status', headerName: 'Статус', editable: true, width: columnState['status'] || 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'isCompleted', headerName: 'Завершен', editable: true, type: 'boolean', width: columnState['isCompleted'] || 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        { field: 'completionRate', headerName: '% Выполнения', editable: true, type: 'number', width: columnState['completionRate'] || 130, headerClassName: 'super-app-theme--header', headerAlign: 'center', },
        {
            field: 'raskroiStat', headerName: 'Раскрой', width: columnState['raskroiStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.raskroiCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'zerkaloStat', headerName: 'Зеркала', width: columnState['zerkaloStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.zerkaloCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'nestingStat', headerName: 'Нестинг', width: columnState['nestingStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.nestingCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'kromkaStat', headerName: 'Кромка', width: columnState['kromkaStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.kromkaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'prisadkaStat', headerName: 'Присадка', width: columnState['prisadkaStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.prisadkaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'metalStat', headerName: 'Металлокаркасы', width: columnState['metalStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.metalCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'pokraskaStat', headerName: 'Покраска', width: columnState['pokraskaStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.pokraskaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'furnituraStat', headerName: 'Фурнитура', width: columnState['furnituraStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.furnituraCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'konveerStat', headerName: 'Конвеер', width: columnState['konveerStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.konveerCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'sborkaStat', headerName: 'Сборка', width: columnState['sborkaStat'] || 130, editable: false, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.sborkaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'setkiStat', headerName: 'Сетки', width: columnState['setkiStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.setkiCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'provolkaStat', headerName: 'Подготовка', width: columnState['provolkaStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.provolkaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'hvaStat', headerName: 'ХВА', width: columnState['hvaStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.hvaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'moikaStat', headerName: 'Мойка', width: columnState['moikaStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.moikaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'galvanikaStat', headerName: 'Гальваника', width: columnState['galvanikaStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.galvanikaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'termoplastStat', headerName: 'Термопласт', width: columnState['termoplastStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.termoplastCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'upakovkaStat', headerName: 'Упаковка крепеж', width: columnState['upakovkaStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.upakovkaCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },
        {
            field: 'guidesStat', headerName: 'Направляющие', width: columnState['guidesStat'] || 130, editable: true, type: 'string', headerClassName: 'super-app-theme--header', headerAlign: 'center', renderCell: (params) => (
                <div onContextMenu={(event) => handleContextMenu(event, params.row.guidesCompl, params.row.quantity)}>
                    {params.value}
                    {params.quantity}
                </div>
            ),
        },


    ];
    const fetchData = () => {


        axios.get('/api/statistiks')
            .then(response => {
                const updatedRows = response.data.map((order: any) => {




                    // Сопоставление названия участка с соответствующими статусами
                    const statusMap: { [key: string]: { stat: string, compl: string } } = {
                        'Раскрой': { stat: 'raskroiStat', compl: 'raskroiCompl' },
                        'Нестинг': { stat: 'nestingStat', compl: 'nestingCompl' },
                        'Зеркала': { stat: 'zerkaloStat', compl: 'zerkaloCompl' },
                        'Кромка': { stat: 'kromkaStat', compl: 'kromkaCompl' },
                        'Присадка': { stat: 'prisadkaStat', compl: 'prisadkaCompl' },
                        'Металлокаркасы': { stat: 'metalStat', compl: 'metalCompl' },
                        'Покраска': { stat: 'pokraskaStat', compl: 'pokraskaCompl' },
                        'Фурнитура': { stat: 'furnituraStat', compl: 'furnituraCompl' },
                        'Конвеер': { stat: 'konveerStat', compl: 'konveerCompl' },
                        'Сборка': { stat: 'sborkaStat', compl: 'sborkaCompl' },
                        'Сетки': { stat: 'setkiStat', compl: 'setkiCompl' },
                        'Подготовка': { stat: 'provolkaStat', compl: 'provolkaCompl' },
                        'ХВА': { stat: 'hvaStat', compl: 'hvaCompl' },
                        'Мойка': { stat: 'moikaStat', compl: 'moikaCompl' },
                        'Гальваника': { stat: 'galvanikaStat', compl: 'galvanikaCompl' },
                        'Термопласт': { stat: 'termoplastStat', compl: 'termoplastCompl' },
                        'Упаковка': { stat: 'upakovkaStat', compl: 'upakovkaCompl' },
                        'Направляющие': { stat: 'guidesStat', compl: 'guidesCompl' },
                    };

                    // Инициализируем объект для статусов
                    const statuses = {
                        raskroiStat: '', raskroiCompl: '',
                        nestingStat: '', nestingCompl: '',
                        zerkaloStat: '', zerkaloCompl: '',
                        kromkaStat: '', kromkaCompl: '',
                        prisadkaStat: '', prisadkaCompl: '',
                        metalStat: '', metalCompl: '',
                        pokraskaStat: '', pokraskaCompl: '',
                        furnituraStat: '', furnituraCompl: '',
                        konveerStat: '', konveerCompl: '',
                        sborkaStat: '', sborkaCompl: '',
                        setkiStat: '', setkiCompl: '',
                        provolkaStat: '', provolkaCompl: '',
                        hvaStat: '', hvaCompl: '',
                        moikaStat: '', moikaCompl: '',
                        galvanikaStat: '', galvanikaCompl: '',
                        termoplastStat: '', termoplastCompl: '',
                        upakovkaStat: '', upakovkaCompl: '',
                        guidesStat: '', guidesCompl: '',
                    };

                    // Проходим по всем заданиям
                    order.tasks.forEach((task: any) => {
                        const statusKeys = statusMap[task.workstation.name];
               

                        if (statusKeys) {
                            statuses[statusKeys.stat] = `${task.completedPros} %`;   // Заполняем Stat процентами
                            statuses[statusKeys.compl] = task.completedAll; // Заполняем Compl числовым значением
                        }
                       
                    });



                    return {
                        id: order.id,
                        launchNumber: order.id,
                        orderName: order.orderName,
                        nomenclature: order.nomenclature,
                        article: order.article,
                        quantity: order.quantity,
                        status: order.status,
                        pdDate: order.pdDate,
                        isCompleted: order.isCompleted,
                        completionRate: `${Math.round(order.completionRate)} %`,
                        ...statuses, // Распространяем статусы в объект
                    };
                });
                const sortedOrders = updatedRows.sort((a, b) => a.id - b.id);
                // setRows(sortedOrders);

                setRows(sortedOrders);



                // setRows(updatedRows);

            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });


    };

    useEffect(() => {
        fetchData(); // Первоначальная загрузка данных

        const interval = setInterval(fetchData, 6000); // Обновление данных каждые 3 секунды

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, []);


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


    // Функция для обработки изменения ширины колонок
    const handleColumnResize = (params) => {
        setColumnState((prevState) => ({
            ...prevState,
            [params.colDef.field]: params.width,
        }));
    };
    return (
        <div>
            <div>
                <Paper style={{ height: '100%', width: '100%', margin: '20px 0' }}>
                    <Box sx={{ height: 'calc(115vh - 200px)', width: '100%', overflow: 'auto' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}

                            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                            getRowClassName={getRowClassName}
                            onProcessRowUpdateError={(error) => console.error('Ошибка при обновлении строки:', error)}
                            onColumnWidthChange={handleColumnResize}
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
                {contextMenu && (
                    <Paper
                        style={{
                            position: 'absolute',
                            top: contextMenu.mouseY,
                            left: contextMenu.mouseX,
                            zIndex: 1000,
                            padding: '10px',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                        }}
                        onMouseLeave={handleClose}
                    >   <div>
                            Количество : {contextMenu.quantity}
                        </div>
                        <div>
                            Выполнено : {contextMenu.value}
                        </div>


                    </Paper>
                )}
            </div>
        </div>
    )
}