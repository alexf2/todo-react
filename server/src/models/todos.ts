import moment from 'moment'
import {getModelForClass, prop, modelOptions, defaultClasses, Ref} from '@typegoose/typegoose';

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
}

interface Reference extends defaultClasses.Base {
}
class Reference extends defaultClasses.TimeStamps
{
    @prop({type: () => String, required: true, unique: true, index: true})
    public code!: string;

    @prop({type: () => String, required: true})
    public name!: string;

    @prop({type: () => Date})
    public deactivatedOn?: Date;
}

@modelOptions({options: {customName: 'domainAreas'}, schemaOptions: {collection: 'domainAreas'}})
export class DomainArea extends Reference {
}

@modelOptions({options: {customName: 'priorities'}, schemaOptions: {collection: 'priorities'}})
export class Priority extends Reference {
}

export interface Todo extends defaultClasses.Base {
}
@modelOptions({options: {customName: 'todos'}, schemaOptions: {collection: 'todos'}})
export class Todo extends defaultClasses.TimeStamps {
    @prop({type: () => String, required: true, index: true})
    public description!: string;

    @prop({type: () => Date})
    public dueDate?: Date;

    @prop({type: () => Number})
    public estimationHours?: number;

    @prop({type: () => Date})
    public finishedOn?: Date;

    @prop({ref: () => Priority, required: true})
    public priority!: Ref<Priority>;

    @prop({ref: () => DomainArea})
    public domainArea?: Ref<DomainArea>;

    @prop({type: () => Boolean})
    public isArchived?: boolean;
}

export const addCalculatedTodo = (item: Todo) => {
    const {dueDate} = item;
    const now = moment();

    const dueDays = dueDate ? moment(dueDate).diff(now, 'days') : null;
    const isOnTime = dueDate ? now.isSameOrBefore(dueDate) : true;

    return {...item, dueDays, isOnTime, isFinished: !!item.finishedOn};
};

export const addCalculatedTodos = (items: Todo[]) => items.map(addCalculatedTodo);

// on grouping items are wrapped
export const addCalculatedTodosGroup = (items: any[]) => items.map(item => ({...item, items: addCalculatedTodos(item.items)}));

export const DomainAreaModel = getModelForClass(DomainArea);
export const PriorityModel = getModelForClass(Priority);
export const TodoModel = getModelForClass(Todo);
