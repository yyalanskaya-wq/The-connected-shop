import { faker } from '@faker-js/faker';

export function generateUniqueEmail() {
     const randomString = faker.string.alphanumeric(10);
        return `yuliatester+${randomString}@gmail.com`;};

export function generateUkrainianFullName() {
    const ukrainianNames = [
    'Олег', 'Іван', 'Петро', 'Андрій', 'Михайло', 'Василь', 'Сергій', 'Юрій', 
    'Тарас', 'Богдан', 'Роман', 'Дмитро', 'Максим', 'Олексій', 'Володимир'
        ];

    const ukrainianSurnames = [
    'Ляшко', 'Шевченко', 'Франко', 'Коваленко', 'Бондаренко', 'Ткаченко', 
    'Кравченко', 'Олійник', 'Шевчук', 'Поліщук', 'Савченко', 'Петренко',
    'Кличко', 'Порошенко', 'Зеленський'
    ];
    const randomName = ukrainianNames[Math.floor(Math.random() * ukrainianNames.length)];
    const randomSurname = ukrainianSurnames[Math.floor(Math.random() * ukrainianSurnames.length)];
    return `${randomName} ${randomSurname}`;
    }