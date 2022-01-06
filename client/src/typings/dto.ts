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

export type Id = string;

export type Entity = {
    _id: Id;
    createdAt?: Date;
    updatedAt?: Date;
}

export type Reference<T> = Entity & {
    code: T;
    name: string;
    deactivatedOn?: Date;
}

export type DomainArea = Reference<AreaEnum>;

export type Priority = Reference<PriorityEnum>;

export type Todo = Entity & {
    description: string;
    dueDate?: Date;
    estimationHours?: number;
    finishedOn?: Date;
    priority: Priority;
    domainArea: DomainArea;
    isArchived: boolean;
}

export type TodoExt = Todo & {
    dueDays?: number;
    isOnTime?: boolean;
    isFinished?: boolean;
};
