import {Grouping, Ordering, ArchiveFiltering} from './api';

export type RefBase<T> = {
    code: T;
    name: string;
}

export type GroupingRef = RefBase<Grouping>[];
export type OrderingRef = RefBase<Ordering>[];
export type FilteringRef = RefBase<ArchiveFiltering>[];

export const GROUPING_REF: GroupingRef = [
    {code: Grouping.ByDomain, name: 'By Domain Area'},
    {code: Grouping.ByPriority, name: 'By Priority'},
];
export const ORDERING_REF: OrderingRef = [
    {code: Ordering.ByPriority, name: 'Priority Desc'},
    {code: Ordering.ByDueDate, name: 'Due date Asc'},
    {code: Ordering.ByPriorityAndDueDate, name: 'Priority and Due date Desc Asc'},
    {code: Ordering.ByCreatedAt, name: 'Created date Desc'},
    {code: Ordering.ByFinishedOn, name: 'Finished date Desc'},
];

export const FILTERING_REF: FilteringRef = [
    {code: ArchiveFiltering.Active, name: 'Only active Todos'},
    {code: ArchiveFiltering.All, name: 'All Todos'},
    {code: ArchiveFiltering.OnlyArchive, name: 'Only archive Todos'},
];
