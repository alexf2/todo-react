import moment from 'moment'
import {getModelForClass, prop, modelOptions, defaultClasses, Ref} from '@typegoose/typegoose';
import {dueDateValidator, finishedOnValidator} from './validators';

export enum PriorityEnum {
    Low = 1,
    Normal,
    High,
    Critical,
}

export enum AreaEnum {
    ApartmentRepairing = 1,
    CarMaintaining,
    CarRepairing,
    CottageMaintaining,
    GardenMaintaining,
    PurchasingWear,
    PurchasingHardware,
    OtherPurchaing,
    Learning,
    Travelling,
    PhotoProject,
    ConfiguringSoftware,
    PayingBills,
    ECommerceProj,
    LeisureTime,
    ZTest,
}

interface Reference extends defaultClasses.Base {
}
class Reference extends defaultClasses.TimeStamps
{
    @prop({type: () => Number, required: true, unique: true, index: true})
    public code!: number;

    @prop({type: () => String, required: true})
    public name!: string;

    @prop({type: () => Date})
    public deactivatedOn?: Date;
}

@modelOptions({options: {customName: 'domainAreas'}, schemaOptions: {collection: 'domainAreas', versionKey: false}})
export class DomainArea extends Reference {
}

@modelOptions({options: {customName: 'priorities'}, schemaOptions: {collection: 'priorities', versionKey: false}})
export class Priority extends Reference {
}

export interface Todo extends defaultClasses.Base {
}
@modelOptions({options: {customName: 'todos'}, schemaOptions: {collection: 'todos', versionKey: false}})
export class Todo extends defaultClasses.TimeStamps {
    @prop({type: () => String, required: true, index: true})
    public description!: string;

    @prop({
        type: () => Date,
        validate: {validator: dueDateValidator},
    })
    public dueDate?: Date;

    @prop({type: () => Number, min: 0.1, default: 4})
    public estimationHours?: number;

    @prop({
        type: () => Date,
        validate: {validator: finishedOnValidator},
    })
    public finishedOn?: Date;

    @prop({ref: () => Priority, required: true})
    public priority!: Ref<Priority>;

    @prop({ref: () => DomainArea})
    public domainArea?: Ref<DomainArea>;

    @prop({type: () => Boolean})
    public isArchived?: boolean;
}

export const addCalculatedTodo = (item: Todo) => {
    const {dueDate, finishedOn} = item;
    const now = moment().utc().startOf('day');

    const dueDays = dueDate ? moment(dueDate).diff(finishedOn || now, 'days') : null;
    const isOnTime = dueDate ? now.isSameOrBefore(dueDate) : true;

    return {...item, dueDays, isOnTime, isFinished: !!item.finishedOn};
};

export const addCalculatedTodos = (items: Todo[]) => items.map(addCalculatedTodo);

// on grouping items are wrapped
export const addCalculatedTodosGroup = (items: any[]) => items.map(item => ({...item, items: addCalculatedTodos(item.items)}));

export const DomainAreaModel = getModelForClass(DomainArea);
export const PriorityModel = getModelForClass(Priority);
export const TodoModel = getModelForClass(Todo);
