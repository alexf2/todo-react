import moment from 'moment'
import {DomainArea, Priority, PriorityEnum, AreaEnum} from './todos';

const START_DATE = moment('2022-02-15', moment.HTML5_FMT.DATE).utc().startOf('day');
const OLD_DATE = moment('2022-01-11', moment.HTML5_FMT.DATE).utc().startOf('day');

export const priorities = [
    {code: PriorityEnum.Low, name: 'Low', _id: '188156dc034e2bde5d2b7161'},
    {code: PriorityEnum.Normal, name: 'Normal', _id: '6188156dc034e2bde5d2b717'},
    {code: PriorityEnum.High, name: 'High', _id: '6188156dc034e2bde5d2b718'},
    {code: PriorityEnum.Critical, name: 'Critical', _id: '6188156dc034e2bde5d2b719'},
    {code: 10, name: 'SubCritical', deactivatedOn: moment('2020-07-15', moment.HTML5_FMT.DATE), _id: '5188156dc234e2bde5d2b718'},
];

export const area = [
    {code: AreaEnum.ApartmentRepairing, name: 'Apartment repairing', _id: '6187af6ad44a8de4cdb627ed'},
    {code: AreaEnum.CarMaintaining, name: 'Car maintaining', _id: '6187af6ad44a8de4cdb627ee'},
    {code: AreaEnum.CarRepairing, name: 'Car repairing', _id: '6187af6ad44a8de4cdb627ef'},
    {code: AreaEnum.CottageMaintaining, name: 'Cottage maintaining', _id: '6187af6ad44a8de4cdb627f0'},
    {code: AreaEnum.GardenMaintaining, name: 'Garden maintaining', _id: '6187af6ad44a8de4cdb627f1'},
    {code: AreaEnum.PurchasingWear, name: 'Purchasing wear', _id: '6187af6ad44a8de4cdb627f2'},
    {code: AreaEnum.PurchasingHardware, name: 'Purchasing hardware', _id: '6187af6ad44a8de4cdb627f3'},
    {code: AreaEnum.OtherPurchaing, name: 'Other purchasing', _id: '2187af6ad44a8de4cdb627f4'},
    {code: AreaEnum.Learning, name: 'Learning', _id: '6187af6ad44a8de4cdb627f5'},
    {code: AreaEnum.Travelling, name: 'Travelling', _id: '6187af6ad44a8de4cdb627f6'},
    {code: AreaEnum.PhotoProject, name: 'Photo Project', _id: '6187af6ad44a8de4cdb627f7'},
    {code: AreaEnum.ZTest, name: 'Z Activity', _id: '9999af6ad44a8de4cdb627f7'},
    {code: AreaEnum.ConfiguringSoftware, name: 'Configuring Software', _id: '6187af6ad44a8de4cdb627f8'},
    {code: AreaEnum.PayingBills, name: 'Paying Bills', _id: '6187af6ad44a8de4cdb627f9'},
    {code: AreaEnum.ECommerceProj, name: 'E-commerce project', _id: '6187af6ad44a8de4cdb627fa'},
    {code: AreaEnum.LeisureTime, name: 'Leisure time, guests', _id: '6187af6ad44a8de4cdb627fb'},
];

export const getTodos = (p: Priority[], da: DomainArea[]) => {
    const getP = (priority: PriorityEnum) => p.find(item => item.code === priority);
    const getD = (domainArea: AreaEnum) => da.find(item => item.code === domainArea);

    return [
        {
            _id: '618810fac73b23b0c2bb3f8f',
            description: 'Weed the bushes in the garden',
            dueDate: START_DATE.clone().add(27, 'day').toDate(),
            estimationHours: 57,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.GardenMaintaining),
        },
        {
            _id: '618810fac73b23b0c2bb3f90',
            description: 'Dig beds to plant garlic',
            dueDate: START_DATE.clone().add(30, 'day').toDate(),
            estimationHours: 3,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.GardenMaintaining),
        },
        {
            _id: '618810fac73b23b0c2bb9999',
            description: 'Make a Z-test activity',
            dueDate: START_DATE.clone().add(55, 'day').toDate(),
            estimationHours: 8,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.ZTest),
        },
        {
            _id: '6188121d19b6e7a506b0e382',
            description: 'Replace the car\'s bumper',
            dueDate: START_DATE.clone().add(10, 'day').toDate(),
            estimationHours: 27,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.CarRepairing),
        },
        {
            _id: '6188121d19b6e7a506b0e383',
            description: 'Clean and grease car\'s door locks',
            dueDate: START_DATE.clone().add(15, 'day').toDate(),
            estimationHours: 5,
            priority: getP(PriorityEnum.Low),
            domainArea: getD(AreaEnum.CarRepairing),
        },
        {
            _id: '6188121d19b6e7a506b0e384',
            description: 'Change the car\'s engine oil',
            dueDate: START_DATE.clone().add(10, 'day').toDate(),
            estimationHours: 3,
            priority: getP(PriorityEnum.High),
            domainArea: getD(AreaEnum.CarMaintaining),
        },
        {
            _id: '6188121d19b6e7a506b0e385',
            description: 'Change the car\'s gas filter',
            dueDate: START_DATE.clone().add(10, 'day').toDate(),
            estimationHours: 1,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.CarMaintaining),
        },
        {
            _id: '6188121d19b6e7a506b0e386',
            description: 'Process Italy Toskana photos',
            dueDate: START_DATE.clone().add(30, 'day').toDate(),
            estimationHours: 40,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.PhotoProject),
        },
        {
            _id: '6188121d19b6e7a506b0e387',
            description: 'Process friend birthday photos',
            dueDate: START_DATE.clone().add(7, 'day').toDate(),
            estimationHours: 6,
            priority: getP(PriorityEnum.High),
            domainArea: getD(AreaEnum.PhotoProject),
        },
        {
            _id: '6188121d19b6e7a506b0e388',
            description: 'Process Summer Weekend trip photos',
            dueDate: START_DATE.clone().add(25, 'day').toDate(),
            estimationHours: 12,
            priority: getP(PriorityEnum.Low),
            domainArea: getD(AreaEnum.PhotoProject),
        },
        {
            _id: '61881362f566c7ea02fb8232',
            description: 'Process Kostroma trip photos',
            dueDate: OLD_DATE.clone().add(25, 'day').toDate(),
            estimationHours: 25,
            priority: getP(PriorityEnum.Low),
            domainArea: getD(AreaEnum.PhotoProject),
            isArchived: true,
        },
        {
            _id: '6188121d19b6e7a506b0e38a',
            description: 'Repair porch',
            dueDate: OLD_DATE.clone().add(12, 'day').toDate(),
            estimationHours: 20,
            priority: getP(PriorityEnum.Normal),
            domainArea: getD(AreaEnum.CottageMaintaining),
            finishedOn: OLD_DATE.clone().add(10, 'day').toDate(),
        },
        {
            _id: '6188121d19b6e7a506b0e38b',
            description: 'Wire RJ45 cable',
            dueDate: OLD_DATE.clone().add(25, 'day').toDate(),
            estimationHours: 4,
            priority: getP(PriorityEnum.High),
            domainArea: getD(AreaEnum.CottageMaintaining),
            finishedOn: OLD_DATE.clone().add(7, 'day').toDate(),
        },
        {
            _id: '6188121d19b6e7a476b0e38b',
            description: 'Wire RJ45 cable 2 long',
            dueDate: OLD_DATE.clone().add(25, 'day').toDate(),
            estimationHours: 6,
            priority: getP(PriorityEnum.Critical),
            domainArea: getD(AreaEnum.CottageMaintaining),
            finishedOn: OLD_DATE.clone().add(26, 'day').toDate(),
        },
    ];
}
