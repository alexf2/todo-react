import moment from 'moment'
import {DomainArea, Priority, PriorityEnum, AreaEnum} from './todos';

const START_DATE = moment('2021-11-27', moment.HTML5_FMT.DATE);

export const priorities = [
    {code: PriorityEnum.Low, name: 'Low'},
    {code: PriorityEnum.Normal, name: 'Normal'},
    {code: PriorityEnum.High, name: 'High'},
    {code: PriorityEnum.Critical, name: 'Critical'},
];

export const area = [
    {code: AreaEnum.ApartmentRepairing, name: 'Apartment repairing'},
    {code: AreaEnum.CarMaintaining, name: 'Car maintaining'},
    {code: AreaEnum.CarRepairing, name: 'Car repairing'},
    {code: AreaEnum.CottageMaintaining, name: 'Cottage maintaining'},
    {code: AreaEnum.GardenMaintaining, name: 'Garden maintaining'},
    {code: AreaEnum.PurchasingWear, name: 'Purchasing wear'},
    {code: AreaEnum.PurchasingHardware, name: 'Purchasing hardware'},
    {code: AreaEnum.OtherPurchaing, name: 'Other purchasing'},
    {code: AreaEnum.Learning, name: 'Learning'},
    {code: AreaEnum.Travelling, name: 'Travelling'},
    {code: AreaEnum.PhotoProject, name: 'Photo Project'},
    {code: AreaEnum.ConfiguringSoftware, name: 'Configuring Software'},
    {code: AreaEnum.PayingBills, name: 'Paying Bills'},
    {code: AreaEnum.ECommerceProj, name: 'E-commerce project'},
    {code: AreaEnum.LeisureTime, name: 'Leisure time, guests'},
];

export const getTodos = (p: Priority[], da: DomainArea[]) => {
    const getP = (priority: PriorityEnum) => p.find(item => item.code === String(priority));
    const getD = (domainArea: AreaEnum) => da.find(item => item.code === String(domainArea));

    return [
        {
            description: 'Weed the bushes in the garden',
            dueDate: START_DATE.add(27, 'day'),
            estimationHours: 57,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.GardenMaintaining),
        },
        {
            description: 'Dig beds to plant garlic',
            dueDate: START_DATE.add(30, 'day'),
            estimationHours: 3,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.GardenMaintaining),
        },
        {
            description: 'Replace the car\'s bumper',
            dueDate: START_DATE.add(10, 'day'),
            estimationHours: 27,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.CarRepairing),
        },
        {
            description: 'Clean and grease car\'s door locks',
            dueDate: START_DATE.add(15, 'day'),
            estimationHours: 5,
            priority: getP(PriorityEnum.Low),
            domainArea: getD(AreaEnum.CarRepairing),
        },
        {
            description: 'Change the car\'s engine oil',
            dueDate: START_DATE.add(10, 'day'),
            estimationHours: 3,
            priority: getP(PriorityEnum.High),
            domainArea: getD(AreaEnum.CarMaintaining),
        },
        {
            description: 'Change the car\'s gas filter',
            dueDate: START_DATE.add(10, 'day'),
            estimationHours: 1,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.CarMaintaining),
        },
        {
            description: 'Process Italy Toskana photos',
            dueDate: START_DATE.add(30, 'day'),
            estimationHours: 40,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.PhotoProject),
        },
        {
            description: 'Process friend birthday photos',
            dueDate: START_DATE.add(7, 'day'),
            estimationHours: 6,
            priority: getP(PriorityEnum.High),
            domainArea: getD(AreaEnum.PhotoProject),
        },
        {
            description: 'Process Summer Weekend trip photos',
            dueDate: START_DATE.add(25, 'day'),
            estimationHours: 12,
            priority: getP(PriorityEnum.Low),
            domainArea: getD(AreaEnum.PhotoProject),
        },
    ];
}
