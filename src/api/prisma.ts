
/* eslint-disable */


import { PrismaClient } from '@prisma/client';
// import { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();


export default class prismaInteraction {



    // Получение всех заказов
    async getOrders() {
        try {
            const orders = await prisma.order.findMany({
                include: {
                    workStatuses: true,  // Включаем связь со статусами участков
                    tasks: true          // Включаем задания для участков
                }
            });

            // Логика для обновления статусов заказа, вычисления completionRate и isCompleted
            for (const order of orders) {
                if (order.tasks.length > 0) {
                    let totalCompletedPros = 0;
                    let hasWorkInProgress = false;

                    // Считаем общую сумму прогресса
                    order.tasks.forEach(task => {
                        const completedPros = task.completedPros || 0;
                        totalCompletedPros += completedPros;

                        // Если хотя бы одно задание имеет прогресс > 0, то статус "В работе"
                        if (completedPros > 0) {
                            hasWorkInProgress = true;
                        }
                    });

                    const averageCompletedPros = totalCompletedPros / order.tasks.length;

                    // Определяем статус заказа
                    if (averageCompletedPros > 99) {
                        order.status = "Завершен";
                    } else if (hasWorkInProgress) {
                        order.status = "В работе";
                    } else {
                        order.status = "Ожидание";
                    }

                    // Рассчитываем completionRate как среднее значение completedPros по всем участкам
                    order.completionRate = averageCompletedPros;

                    // Устанавливаем isCompleted в true, если completionRate > 99
                    order.isCompleted = order.completionRate > 99;
                } else {
                    order.status = "Ожидание";  // Если нет заданий, то статус "Ожидание"
                    order.completionRate = 0;   // Если нет заданий, то completionRate = 0
                    order.isCompleted = false;  // Если нет заданий, то заказ не завершен
                }

                // Сохранение обновленных данных в базу
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: order.status,
                        completionRate: order.completionRate,
                        isCompleted: order.isCompleted
                    }
                });
            }

            return orders;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            await prisma.$disconnect();
        }
    }

    // Метод для обновления заказа 
    async updateOrder(id: number, orders: any, workStatuses: any) {
        try {
            // Найти соответствующий участок по названию
            const order = await prisma.order.findFirst({
                where: { id: id },
            });
            if (order) {
                // Если запись есть, обновляем ее
                await prisma.order.update({
                    where: { id: id },
                    data: {
                        launchNumber: orders.launchNumber,
                        orderName: orders.orderName,
                        article: orders.article,
                        receivedDate: orders.receivedDate,
                        status: orders.status,
                        isCompleted: orders.isCompleted,
                        completionRate: parseFloat(orders.completionRate.replace('%', '')),
                        nomenclature: orders.nomenclature,
                        quantity: orders.quantity,
                        pdDate: orders.pdDate,
                        pdDateRaskroi: orders.pdDateRaskroi,
                        pdDateNesting: orders.pdDateNesting,
                    },
                });
            } else {
                throw new Error('Заказ не найден');
            }
            const workStatus = await prisma.orderWorkstationStatus.findFirst({
                where: {
                    orderId: id,
                },
            });
            if (workStatus) {
                // Если запись есть, обновляем ее
                await prisma.orderWorkstationStatus.update({
                    where: { id: workStatus.id },
                    data: {
                        raskroi: workStatuses.raskroi,
                        nesting: workStatuses.nesting,
                        zerkala: workStatuses.zerkala,
                        kromka: workStatuses.kromka,
                        prisadka: workStatuses.prisadka,
                        pokraska: workStatuses.pokraska,
                        furnitura: workStatuses.furnitura,
                        setki: workStatuses.setki,
                        guides: workStatuses.guides,
                        metal: workStatuses.metal,
                        konveer: workStatuses.konveer,
                        sborka: workStatuses.sborka,
                        provolka: workStatuses.provolka,
                        xba: workStatuses.xba,
                        moika: workStatuses.moika,
                        galivanika: workStatuses.galivanika,
                        termoplast: workStatuses.termoplast,
                        ypakovka: workStatuses.ypakovka,
                    },
                });
            } else {
                throw new Error('Заказ не найден');
            }
            const allWorkstations = await prisma.workstation.findMany();
            const tasks = [];

            // Функция для обработки добавления или удаления заданий
            const handleTaskUpdate = async (workstationName: string, isActive: boolean, pd: Date) => {
                const workstation = allWorkstations.find(ws => ws.name === workstationName);
            
                if (!workstation) return;
            
                const existingTask = await prisma.workstationTask.findFirst({
                    where: {
                        orderId: id,
                        workstationId: workstation.id,
                    },
                });
            
                if (isActive) {
                    if (!existingTask) {
                        // Если участок активен, но задания нет, создаем его
                        tasks.push({
                            orderId: id,
                            workstationId: workstation.id,
                            ostatok: orders.quantity,
                            ostatokInpt: orders.quantity,
                            completedAll: 0,
                            completedPros: 0,
                            completedTask: false,
                            pd: formatDate(pd), // Преобразуем дату в ISO-формат
                        });
                    } else {
                        // Если участок активен и задание уже существует, обновляем дату PD
                        await prisma.workstationTask.update({
                            where: { id: existingTask.id },
                            data: {
                                pd: formatDate(pd), // Обновляем дату PD
                            },
                        });
                    }
                } else if (!isActive && existingTask) {
                    // Если участок неактивен, а задание существует, удаляем его
                    await prisma.workstationTask.delete({
                        where: { id: existingTask.id },
                    });
                }
            };
            
            // Функция для разбора даты из строки формата DD.MM.YYYY
            const parseDate = (dateString: string) => {
                const parts = dateString.split('.');
                return new Date(
                    parseInt(parts[2], 10), // Год
                    parseInt(parts[1], 10) - 1, // Месяц (0-11)
                    parseInt(parts[0], 10) // День
                );
            };

            // Функция для форматирования даты в формат DD.MM.YYYY
            const formatDate = (date: Date) => {
                const day = String(date.getDate()).padStart(2, '0'); // День с ведущим нулем
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц с ведущим нулем
                const year = date.getFullYear(); // Год
                return `${day}.${month}.${year}`;
            };
            // console.log(orders);
            // console.log(orders.pdDateRaskroi);
            // console.log(orders.pdDateNesting);


            // Преобразуем строки дат в объекты Date
            const receivedDate = parseDate(orders.receivedDate);
            const pdDate = parseDate(orders.pdDate);
            const pdDateRaskroi = parseDate(orders.pdDateRaskroi);
            const pdDateNesting = parseDate(orders.pdDateNesting);

            // Рассчитываем pd для каждого участка с учетом смещений
            const pdKromka = new Date(pdDateRaskroi);
            pdKromka.setDate(pdKromka.getDate() + 1); // Смещение на 1 день

            const pdPrisadka = new Date(pdKromka);
            pdPrisadka.setDate(pdPrisadka.getDate() + 1); // Смещение на 1 день после кромки

            const pdPokraska = new Date(pdDate);
            pdPokraska.setDate(pdPokraska.getDate() - 7); // Смещение за 7 дней до общей PD

            const pdFurnitura = new Date(pdDate);
            pdFurnitura.setDate(pdFurnitura.getDate() - 4); // Смещение за 4 дня до PD

            const pdKonveerSborka = new Date(pdDate);
            pdKonveerSborka.setDate(pdKonveerSborka.getDate() - 3); // Смещение за 3 дня до PD

            const pdKonveerSetki = new Date(pdDate);
            pdKonveerSetki.setDate(pdKonveerSetki.getDate() - 3); // Смещение за 3 дня до PD

            const pdGuides = new Date(pdDate);
            pdGuides.setDate(pdGuides.getDate() - 3); // Смещение за 3 дня до PD

            const pdKonveerProvolka = new Date(pdDate);
            pdKonveerProvolka.setDate(pdKonveerProvolka.getDate() - 12); // Смещение за 12 дня до PD

            const pdKonveerXba = new Date(pdDate);
            pdKonveerXba.setDate(pdKonveerXba.getDate() - 10); // Смещение за 10 дня до PD

            const pdKonveerMoika = new Date(pdDate);
            pdKonveerMoika.setDate(pdKonveerMoika.getDate() - 7); // Смещение за 7 дня до PD

            const pdKonveerGalivanika = new Date(pdDate);
            pdKonveerGalivanika.setDate(pdKonveerGalivanika.getDate() - 6); // Смещение за 6 дня до PD

            const pdKonveerTermoplast = new Date(pdDate);
            pdKonveerTermoplast.setDate(pdKonveerTermoplast.getDate() - 4); // Смещение за 4 дня до PD

            const pdKonveerYpakovka = new Date(pdDate);
            pdKonveerYpakovka.setDate(pdKonveerYpakovka.getDate() - 2); // Смещение за 2 дня до PD

            const pdKonveerMetal = new Date(pdDate);
            pdKonveerMetal.setDate(pdKonveerMetal.getDate() - 2); // Смещение за 2 дня до PD

            // Обрабатываем задания для каждого участка
            await handleTaskUpdate('Раскрой', workStatuses.raskroi, pdDateRaskroi);
            await handleTaskUpdate('Нестинг', workStatuses.nesting, pdDateNesting);
            await handleTaskUpdate('Зеркала', workStatuses.zerkala, receivedDate);
            await handleTaskUpdate('Кромка', workStatuses.kromka, pdKromka);
            await handleTaskUpdate('Присадка', workStatuses.prisadka, pdPrisadka);
            await handleTaskUpdate('Покраска', workStatuses.pokraska, pdPokraska);
            await handleTaskUpdate('Фурнитура', workStatuses.furnitura, pdFurnitura);
            await handleTaskUpdate('Конвеер', workStatuses.konveer, pdKonveerSborka);
            await handleTaskUpdate('Сборка', workStatuses.sborka, pdKonveerSborka);

            await handleTaskUpdate('Сетки', workStatuses.setki, pdKonveerSetki);
            await handleTaskUpdate('Направляющие', workStatuses.guides, pdGuides);
            await handleTaskUpdate('Проволка', workStatuses.provolka, pdKonveerProvolka);
            await handleTaskUpdate('ХВА', workStatuses.xba, pdKonveerXba);
            await handleTaskUpdate('Мойка', workStatuses.moika, pdKonveerMoika);
            await handleTaskUpdate('Гальваника', workStatuses.galivanika, pdKonveerGalivanika);
            await handleTaskUpdate('Термопласт', workStatuses.termoplast, pdKonveerTermoplast);
            await handleTaskUpdate('Упаковка', workStatuses.ypakovka, pdKonveerYpakovka);
            await handleTaskUpdate('Металлокаркасы', workStatuses.metal, pdKonveerMetal);

            // Если есть задания, создаем их
            if (tasks.length > 0) {
                await prisma.workstationTask.createMany({ data: tasks });
            }

            return order;
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
            throw error;
        } finally {
            await prisma.$disconnect();
        }
    }

    // Добавление нового заказа
    async createOrder(data: {
        launchNumber: string,
        orderName: string,
        article: string,
        receivedDate: string,
        status: string,
        isCompleted: boolean,
        completionRate: number,
        nomenclature: string,
        quantity: number,
        pdDate: string,
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
        setki: boolean;
        guides: boolean;
        metal: boolean;
        provolka: boolean;
        xba: boolean;
        moika: boolean;
        galivanika: boolean;
        termoplast: boolean;
        ypakovka: boolean;
    }) {
        try {
            // Функция для разбора даты из строки формата DD.MM.YYYY
            const parseDate = (dateString: string) => {
                const parts = dateString.split('.');
                return new Date(
                    parseInt(parts[2], 10), // Год
                    parseInt(parts[1], 10) - 1, // Месяц (0-11)
                    parseInt(parts[0], 10) // День
                );
            };

            // Функция для форматирования даты в формат DD.MM.YYYY
            const formatDate = (date: Date) => {
                const day = String(date.getDate()).padStart(2, '0'); // День с ведущим нулем
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц с ведущим нулем
                const year = date.getFullYear(); // Год
                return `${day}.${month}.${year}`;
            };

            // Преобразуем строки дат в объекты Date
            const receivedDate = parseDate(data.receivedDate);
            const pdDate = parseDate(data.pdDate);
            const pdDateRaskroi = parseDate(data.pdDateRaskroi);
            const pdDateNesting = parseDate(data.pdDateNesting);

            // Рассчитываем pd для каждого участка с учетом смещений
            const pdKromka = new Date(pdDateRaskroi);
            pdKromka.setDate(pdKromka.getDate() + 1); // Смещение на 1 день

            const pdPrisadka = new Date(pdKromka);
            pdPrisadka.setDate(pdPrisadka.getDate() + 1); // Смещение на 1 день после кромки

            const pdPokraska = new Date(pdDate);
            pdPokraska.setDate(pdPokraska.getDate() - 7); // Смещение за 7 дней до общей PD

            const pdFurnitura = new Date(pdDate);
            pdFurnitura.setDate(pdFurnitura.getDate() - 4); // Смещение за 4 дня до PD

            const pdKonveerSborka = new Date(pdDate);
            pdKonveerSborka.setDate(pdKonveerSborka.getDate() - 3); // Смещение за 3 дня до PD

            const pdKonveerSetki = new Date(pdDate);
            pdKonveerSetki.setDate(pdKonveerSetki.getDate() - 3); // Смещение за 3 дня до PD
            
            const pdGuides = new Date(pdDate);
            pdGuides.setDate(pdGuides.getDate() - 3); // Смещение за 3 дня до PD

            const pdKonveerProvolka = new Date(pdDate);
            pdKonveerProvolka.setDate(pdKonveerProvolka.getDate() - 12); // Смещение за 3 дня до PD

            const pdKonveerXba = new Date(pdDate);
            pdKonveerXba.setDate(pdKonveerXba.getDate() - 10); // Смещение за 3 дня до PD

            const pdKonveerMoika = new Date(pdDate);
            pdKonveerMoika.setDate(pdKonveerMoika.getDate() - 7); // Смещение за 3 дня до PD

            const pdKonveerGalivanika = new Date(pdDate);
            pdKonveerGalivanika.setDate(pdKonveerGalivanika.getDate() - 6); // Смещение за 3 дня до PD

            const pdKonveerTermoplast = new Date(pdDate);
            pdKonveerTermoplast.setDate(pdKonveerTermoplast.getDate() - 4); // Смещение за 3 дня до PD

            const pdKonveerYpakovka = new Date(pdDate);
            pdKonveerYpakovka.setDate(pdKonveerYpakovka.getDate() - 2); // Смещение за 3 дня до PD

            const pdKonveerMetal = new Date(pdDate);
            pdKonveerMetal.setDate(pdKonveerMetal.getDate() - 2); // Смещение за 3 дня до PD

            const newOrder = await prisma.order.create({
                data: {
                    launchNumber: data.launchNumber,
                    orderName: data.orderName,
                    article: data.article,
                    receivedDate: formatDate(receivedDate), // Форматируем дату
                    status: data.status,
                    isCompleted: data.isCompleted,
                    completionRate: data.completionRate,
                    nomenclature: data.nomenclature,
                    quantity: data.quantity,
                    pdDate: formatDate(pdDate),
                    pdDateRaskroi: formatDate(pdDateRaskroi),
                    pdDateNesting: formatDate(pdDateNesting),
                    workStatuses: {
                        create: {
                            raskroi: data.raskroi,
                            nesting: data.nesting,
                            zerkala: data.zerkala,
                            kromka: data.kromka,
                            prisadka: data.prisadka,
                            pokraska: data.pokraska,
                            furnitura: data.furnitura,
                            konveer: data.konveer,
                            sborka: data.sborka,
                            metal: data.metal,
                            setki: data.setki,
                            guides: data.guides,
                            provolka: data.provolka,
                            xba: data.xba,
                            moika: data.moika,
                            galivanika: data.galivanika,
                            termoplast: data.termoplast,
                            ypakovka: data.ypakovka,
                        }
                    }
                },
                include: {
                    workStatuses: true,
                },
            });

            const allWorkstations = await prisma.workstation.findMany();
            const tasks = [];

            const addTask = (workstationName: string, pd: Date) => {
                const workstation = allWorkstations.find(ws => ws.name === workstationName);
                if (workstation) {
                    tasks.push({
                        orderId: newOrder.id,
                        workstationId: workstation.id,
                        ostatok: data.quantity,
                        ostatokInpt: data.quantity,
                        completedAll: 0,
                        completedPros: 0,
                        completedTask: false,
                        pd: formatDate(pd) // Используем формат DD.MM.YYYY для сохранения
                    });
                }
            };

            // Создаем задания для каждого участка с учетом рассчитанного pd
            if (data.raskroi) addTask('Раскрой', pdDateRaskroi);
            if (data.nesting) addTask('Нестинг', pdDateNesting);
            if (data.zerkala) addTask('Зеркала', receivedDate);
            if (data.kromka) addTask('Кромка', pdKromka);
            if (data.prisadka) addTask('Присадка', pdPrisadka);
            if (data.pokraska) addTask('Покраска', pdPokraska);
            if (data.furnitura) addTask('Фурнитура', pdFurnitura);
            if (data.konveer) addTask('Конвеер', pdKonveerSborka);
            if (data.sborka) addTask('Сборка', pdKonveerSborka);

            if (data.setki) addTask('Сетки', pdKonveerSetki);
            if (data.guides) addTask('Направляющие', pdGuides);
            if (data.provolka) addTask('Проволка', pdKonveerProvolka);
            if (data.xba) addTask('ХВА', pdKonveerXba);
            if (data.moika) addTask('Мойка', pdKonveerMoika);
            if (data.galivanika) addTask('Гальваника', pdKonveerGalivanika);
            if (data.termoplast) addTask('Термопласт', pdKonveerTermoplast);
            if (data.ypakovka) addTask('Упаковка', pdKonveerYpakovka);
            if (data.metal) addTask('Металлокаркасы', pdKonveerMetal);

            await prisma.workstationTask.createMany({
                data: tasks,
            });

            return newOrder;
        } catch (error) {
            console.error('Ошибка при добавлении нового заказа:', error);
        } finally {
            await prisma.$disconnect();
        }
    }


    async getOrdersWorkplace(work: string) {
        const workstationField = {
            'Раскрой': 'raskroi',
            'Нестинг': 'nesting',
            'Зеркала': 'zerkala',
            'Кромка': 'kromka',
            'Присадка': 'prisadka',
            'Покраска': 'pokraska',
            'Фурнитура': 'furnitura',
            'Конвеер': 'konveer',
            'Сборка': 'sborka',
            'Металлокаркасы': 'metal',
            'Сетки': 'setki',
            'Направляющие': 'guides',
            'Подготовка': 'provolka',
            'ХВА': 'xba',
            'Мойка': 'moika',
            'Гальваника': 'galivanika',
            'Термопласт': 'termoplast',
            'Упаковка': 'ypakovka',
        }[work];

        if (workstationField) {
            try {
                const orders = await prisma.order.findMany({
                    where: {
                        workStatuses: {
                            some: { [workstationField]: true }
                        }
                    },
                    include: {
                        workStatuses: true,
                        tasks: {
                            where: {
                                workstation: {
                                    name: work // Фильтруем задачи по названию участка
                                }
                            },
                            include: {
                                workstation: true, // Включаем данные по участку
                                workDone: work !== 'Покраска' ? true : undefined, // Включаем workDone, если не "Покраска"
                                workDonePokraska: work === 'Покраска' ? true : undefined // Включаем workDonePokraska, если "Покраска"
                            }
                        }
                    }
                });

                // Текущая дата
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Убираем время для сравнения по дате

                // Обрабатываем заказы
                const updatedOrders = await Promise.all(orders.map(async (order) => {
                    const tasks = order.tasks.map(async (task) => {
                        let previousWorkDoneRecords;

                        // Разделяем логику для запроса к workDone и workDonePokraska
                        if (work === 'Покраска') {
                            previousWorkDoneRecords = await prisma.workDonePokraska.findMany({
                                where: {
                                    workstationTaskId: task.id,
                                    dateWork: {
                                        lt: today, // Только даты до сегодняшнего дня
                                    },
                                },
                            });
                            // Подсчитываем общее количество выполненной работы за предыдущие дни
                            const totalPreviousWorkDone = previousWorkDoneRecords.reduce((sum, work) => sum + work.enamel, 0);

                            // Рассчитываем остаток для ввода (ostatokInpt)
                            const ostatokInpt = order.quantity - totalPreviousWorkDone;

                            // Обновляем поле ostatokInpt в базе данных
                            await prisma.workstationTask.update({
                                where: { id: task.id },
                                data: {
                                    ostatokInpt: ostatokInpt, // Обновляем значение ostatokInpt
                                }
                            });

                            return {
                                ...task,
                                ostatokInpt, // Добавляем значение в ответ
                            };
                        } else {
                            previousWorkDoneRecords = await prisma.workDone.findMany({
                                where: {
                                    taskId: task.id,
                                    date: {
                                        lt: today, // Только даты до сегодняшнего дня
                                    },
                                },
                            });
                            // Подсчитываем общее количество выполненной работы за предыдущие дни
                            const totalPreviousWorkDone = previousWorkDoneRecords.reduce((sum, work) => sum + work.quantity, 0);

                            // Рассчитываем остаток для ввода (ostatokInpt)
                            const ostatokInpt = order.quantity - totalPreviousWorkDone;

                            // Обновляем поле ostatokInpt в базе данных
                            await prisma.workstationTask.update({
                                where: { id: task.id },
                                data: {
                                    ostatokInpt: ostatokInpt, // Обновляем значение ostatokInpt
                                }
                            });

                            return {
                                ...task,
                                ostatokInpt, // Добавляем значение в ответ
                            };
                        }



                    });

                    return {
                        ...order,
                        tasks: await Promise.all(tasks) // Обновляем задачи с рассчитанным ostatokInpt
                    };
                }));

                return updatedOrders;
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            } finally {
                await prisma.$disconnect();
            }
        }
    }

    async updateWorkDone(orderId: number, workstationName: string, doneToday: any) {
        console.log(doneToday);

        try {
            // Найти соответствующий участок по названию
            const workstation = await prisma.workstation.findFirst({
                where: { name: workstationName },
            });

            if (!workstation) {
                throw new Error('Участок не найден');
            }

            // Найти задание по участку и заказу
            let task = await prisma.workstationTask.findFirst({
                where: {
                    orderId: orderId,
                    workstationId: workstation.id,
                },
            });

            // Если задания нет, создаем его
            if (!task) {
                task = await prisma.workstationTask.create({
                    data: {
                        orderId: orderId,
                        workstationId: workstation.id,
                    },
                });
            }

            // Проверка, существует ли запись работы на сегодняшний день
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Убираем время, чтобы сравнивать только дату

            let totalPreviousWorkDone = 0;
            let totalWorkDone = 0;
            let ostatokInpt = 0;
            let ostatok = 0;

            if (workstationName === 'Покраска') {
                // Логика для участка "Покраска"

                if (doneToday.shlif1Fakt) {
                    const workDonePokraska = await prisma.workDonePokraska.findFirst({
                        where: {
                            workstationTaskId: task.id,
                            dateWork: today,
                        },
                    });
                    if (workDonePokraska) {
                        // Если запись есть, обновляем ее
                        await prisma.workDonePokraska.update({
                            where: { id: workDonePokraska.id },
                            data: { grinding1Fakt: doneToday.shlif1Fakt, dateWork: today },
                        });
                    } else {
                        // Иначе создаем новую запись
                        await prisma.workDonePokraska.create({
                            data: {
                                workstationTaskId: task.id,
                                grinding1Fakt: doneToday.shlif1Fakt,
                                dateWork: today,
                            },
                        });
                    }
                }
                if (doneToday.grunt1Fakt) {
                    const workDonePokraska = await prisma.workDonePokraska.findFirst({
                        where: {
                            workstationTaskId: task.id,
                            dateWork: today,
                        },
                    });
                    if (workDonePokraska) {
                        // Если запись есть, обновляем ее
                        await prisma.workDonePokraska.update({
                            where: { id: workDonePokraska.id },
                            data: { ground1Fakt: doneToday.grunt1Fakt, dateWork: today },
                        });
                    } else {
                        // Иначе создаем новую запись
                        await prisma.workDonePokraska.create({
                            data: {
                                workstationTaskId: task.id,
                                ground1Fakt: doneToday.grunt1Fakt,
                                dateWork: today,
                            },
                        });
                    }
                }
                if (doneToday.shlif2Fakt) {
                    const workDonePokraska = await prisma.workDonePokraska.findFirst({
                        where: {
                            workstationTaskId: task.id,
                            dateWork: today,
                        },
                    });
                    if (workDonePokraska) {
                        // Если запись есть, обновляем ее
                        await prisma.workDonePokraska.update({
                            where: { id: workDonePokraska.id },
                            data: { grinding2Fakt: doneToday.shlif2Fakt, dateWork: today },
                        });
                    } else {
                        // Иначе создаем новую запись
                        await prisma.workDonePokraska.create({
                            data: {
                                workstationTaskId: task.id,
                                grinding2Fakt: doneToday.shlif2Fakt,
                                dateWork: today,
                            },
                        });
                    }
                }
                if (doneToday.grunt2Fakt) {
                    const workDonePokraska = await prisma.workDonePokraska.findFirst({
                        where: {
                            workstationTaskId: task.id,
                            dateWork: today,
                        },
                    });
                    if (workDonePokraska) {
                        // Если запись есть, обновляем ее
                        await prisma.workDonePokraska.update({
                            where: { id: workDonePokraska.id },
                            data: { ground2Fakt: doneToday.grunt2Fakt, dateWork: today },
                        });
                    } else {
                        // Иначе создаем новую запись
                        await prisma.workDonePokraska.create({
                            data: {
                                workstationTaskId: task.id,
                                ground2Fakt: doneToday.grunt2Fakt,
                                dateWork: today,
                            },
                        });
                    }
                }
                if (doneToday.shlif3Fakt) {
                    const workDonePokraska = await prisma.workDonePokraska.findFirst({
                        where: {
                            workstationTaskId: task.id,
                            dateWork: today,
                        },
                    });
                    if (workDonePokraska) {
                        // Если запись есть, обновляем ее
                        await prisma.workDonePokraska.update({
                            where: { id: workDonePokraska.id },
                            data: { grinding3Fakt: doneToday.shlif3Fakt, dateWork: today },
                        });
                    } else {
                        // Иначе создаем новую запись
                        await prisma.workDonePokraska.create({
                            data: {
                                workstationTaskId: task.id,
                                grinding3Fakt: doneToday.shlif3Fakt,
                                dateWork: today,
                            },
                        });
                    }
                }
                if (doneToday.grunt3Fakt) {
                    const workDonePokraska = await prisma.workDonePokraska.findFirst({
                        where: {
                            workstationTaskId: task.id,
                            dateWork: today,
                        },
                    });
                    if (workDonePokraska) {
                        // Если запись есть, обновляем ее
                        await prisma.workDonePokraska.update({
                            where: { id: workDonePokraska.id },
                            data: { ground3Fakt: doneToday.grunt3Fakt, dateWork: today },
                        });
                    } else {
                        // Иначе создаем новую запись
                        await prisma.workDonePokraska.create({
                            data: {
                                workstationTaskId: task.id,
                                ground3Fakt: doneToday.grunt3Fakt,
                                dateWork: today,
                            },
                        });
                    }
                }
                if (doneToday.emalFakt) {
                    const workDonePokraska = await prisma.workDonePokraska.findFirst({
                        where: {
                            workstationTaskId: task.id,
                            dateWork: today,
                        },
                    });
                    if (workDonePokraska) {
                        // Если запись есть, обновляем ее
                        await prisma.workDonePokraska.update({
                            where: { id: workDonePokraska.id },
                            data: { enamel: doneToday.emalFakt, dateWork: today },
                        });
                    } else {
                        // Иначе создаем новую запись
                        await prisma.workDonePokraska.create({
                            data: {
                                workstationTaskId: task.id,
                                enamel: doneToday.emalFakt,
                                dateWork: today,
                            },
                        });
                    }
                }



                // Выбираем записи выполненной работы до сегодняшнего дня
                const previousWorkDoneRecords = await prisma.workDonePokraska.findMany({
                    where: {
                        workstationTaskId: task.id,
                        dateWork: {
                            lt: today, // Только даты до сегодняшнего дня
                        },
                    },
                });

                // Подсчитываем общее количество выполненной работы за предыдущие дни
                totalPreviousWorkDone = previousWorkDoneRecords.reduce((sum, work) => sum + (work.enamel || 0), 0);
            } else {
                // Логика для всех остальных участков
                const workDone = await prisma.workDone.findFirst({
                    where: {
                        taskId: task.id,
                        date: today,
                    },
                });

                if (workDone) {
                    // Если запись есть, обновляем ее
                    await prisma.workDone.update({
                        where: { id: workDone.id },
                        data: { quantity: doneToday },
                    });
                } else {
                    // Иначе создаем новую запись
                    await prisma.workDone.create({
                        data: {
                            taskId: task.id,
                            quantity: doneToday,
                            date: today,
                        },
                    });
                }

                // Выбираем записи выполненной работы до сегодняшнего дня
                const previousWorkDoneRecords = await prisma.workDone.findMany({
                    where: {
                        taskId: task.id,
                        date: {
                            lt: today, // Только даты до сегодняшнего дня
                        },
                    },
                });

                // Подсчитываем общее количество выполненной работы за предыдущие дни
                totalPreviousWorkDone = previousWorkDoneRecords.reduce((sum, work) => sum + work.quantity, 0);
            }

            // Получаем заказ
            let order = await prisma.order.findFirst({
                where: { id: orderId },
            });

            // Рассчитываем остаток для ввода, основанный на работе за предыдущие дни (ostatokInpt)
            ostatokInpt = order.quantity - totalPreviousWorkDone;

            // Подсчитываем общее количество выполненной работы
            const workDoneRecords = workstationName === 'Покраска'
                ? await prisma.workDonePokraska.findMany({
                    where: { workstationTaskId: task.id },
                })
                : await prisma.workDone.findMany({
                    where: { taskId: task.id },
                });

            totalWorkDone = workDoneRecords.reduce((sum, work) => sum + (work.enamel || work.quantity || 0), 0);
            ostatok = order.quantity - totalWorkDone;

            // Пересчитываем процент выполнения
            const completionRate = (totalWorkDone / order.quantity) * 100;

            // Определяем, завершена ли задача
            const completedTask = completionRate >= 100;

            // Обновляем задание с новым процентом выполнения и статусом завершения
            const updatedTask = await prisma.workstationTask.update({
                where: { id: task.id },
                data: {
                    completedAll: totalWorkDone, // Обновляем общее количество выполненных задач
                    completedPros: completionRate, // Сохраняем новый процент выполнения
                    ostatok: ostatok, // Обновляем остаток
                    ostatokInpt: ostatokInpt, // Обновляем остаток для ввода
                    completedTask: completedTask, // Отмечаем задание как завершенное, если процент выполнения 100
                },
            });

            return updatedTask;
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
            throw error;
        } finally {
            await prisma.$disconnect();
        }
    }

    // Получение всех заказов с заданиями для каждого участка
    async getStatistics() {
        try {
            const orders = await prisma.order.findMany({
                include: {
                    workStatuses: true, // Включаем связь со статусами участков
                    tasks: {
                        include: {
                            workstation: true, // Включаем связь со станками
                        },
                    },
                },
            });

            // Логика для обновления статусов заказа, вычисления completionRate и isCompleted
            for (const order of orders) {
                if (order.tasks.length > 0) {
                    let totalCompletedPros = 0;
                    let hasWorkInProgress = false;

                    // Считаем общую сумму прогресса
                    order.tasks.forEach(task => {
                        const completedPros = task.completedPros || 0;
                        totalCompletedPros += completedPros;

                        // Если хотя бы одно задание имеет прогресс > 0, то статус "В работе"
                        if (completedPros > 0) {
                            hasWorkInProgress = true;
                        }
                    });

                    const averageCompletedPros = totalCompletedPros / order.tasks.length;

                    // Определяем статус заказа
                    if (averageCompletedPros > 99) {
                        order.status = "Завершен";
                    } else if (hasWorkInProgress) {
                        order.status = "В работе";
                    } else {
                        order.status = "Ожидание";
                    }

                    // Рассчитываем completionRate как среднее значение completedPros по всем участкам
                    order.completionRate = averageCompletedPros;

                    // Устанавливаем isCompleted в true, если completionRate > 99
                    order.isCompleted = order.completionRate > 99;
                } else {
                    order.status = "Ожидание";  // Если нет заданий, то статус "Ожидание"
                    order.completionRate = 0;   // Если нет заданий, то completionRate = 0
                    order.isCompleted = false;  // Если нет заданий, то заказ не завершен
                }

                // Сохранение обновленных данных в базу
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: order.status,
                        completionRate: order.completionRate,
                        isCompleted: order.isCompleted
                    }
                });
            }

            return orders;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            await prisma.$disconnect();
        }
    }

    async createUser(data: { login: string; password: string; role: string; sector?: string | null; }) {

        // Проверка, существует ли пользователь с таким логином
        const existingUser = await prisma.users.findUnique({
            where: { login: data.login }, // Проверяем по полю login
        });

        if (existingUser) {
            throw new Error('USER_EXISTS'); // Меняем текст ошибки на ключевое значение
        }

        // Сохранение нового пользователя
        const newUser = await prisma.users.create({
            data: {
                login: data.login, // Используем логин из переданных данных
                password: data.password, // Используем хэшированный пароль
                role: data.role, // Используем роль
                sector: data.sector || null, // Если сектор не передан, сохраняем null
            },
        });

        return newUser; // Возвращаем созданного пользователя
    }

    // prismaInteraction.ts
    async findUserByLogin(login: string) {
        return await prisma.users.findUnique({
            where: { login },
        });
    }

    // Метод для создания администратора, если его нет
    async createAdminIfNotExists() {
        const adminLogin = 'Admin';
        const adminPassword = 'Admin311'; // Пароль администратора по умолчанию
        const adminRole = 'Руководство'; // Роль администратора

        const existingAdmin = await this.findUserByLogin(adminLogin);

        if (!existingAdmin) {
            console.log('Создаем учетную запись администратора...');
            await this.createUser({
                login: adminLogin,
                password: adminPassword,
                role: adminRole,
                sector: null,
            });
            console.log('Учетная запись администратора создана.');
        } else {
            console.log('Учетная запись администратора уже существует.');
        }
    }
}














// // =============================================
// async getOrders() {
//     try {
//       const orders = await prisma.order.findMany({
//         include: {
//           sections: { // Включаем связанные данные из SectionOrder
//             include: {
//               section: true, // Включаем информацию об участках (Section)
//             //   tasks: true,   // Включаем связанные задания (Task)
//             },
//           },
//         },
//       });
//       return orders;
//     } catch (error) {
//       console.error('Ошибка при получении данных:', error);
//     } finally {
//       await prisma.$disconnect();
//     }
//   }