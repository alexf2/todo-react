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
    @prop({type: () => String, required: true})
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

    // dueDays, isOnTime, isFinished - calculated
}

export const domainAreaModel = getModelForClass(DomainArea);
export const priorityModel = getModelForClass(Priority);
export const todoModel = getModelForClass(Todo);
