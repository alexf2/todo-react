import escapeEx from 'escape-string-regexp';
import {BadRequestError} from '../helpers';

enum Grouping {
    ByDomain = 'domain',
    ByPriority = 'priority',
}
export enum Ordering {
    ByPriority ='priority', // desc
    ByDueDate = 'duedate', // asc
    ByPriorityAndDueDate = 'priorityandduedate', // desc, asc
    ByCreatedAt = 'createdate', // desc
    ByFinishedOn = 'finishedon', // desc
}

export const getTodoFilter = (searchString?: string|null, showArchived?: boolean|null, onlyArchived?: boolean|null) => {
    if (typeof searchString === 'string') {
        searchString = searchString.trim();
    }
    
    const needsSearch = !!searchString;
    const hideArchived = !showArchived;

    if (!needsSearch && !hideArchived) {
        return;
    }
    
    const needsAnd = needsSearch && hideArchived;
    let res = {};
    let searchFilter;
    let archiveFilter;
    if (needsSearch) {
        searchFilter = {description: {$regex: escapeEx(searchString!)}};
    }
    if (onlyArchived) {
        archiveFilter = {$and: [{isArchived: true}]};
    } else if (hideArchived) {
        archiveFilter = {$or: [{isArchived: {$exists: false}}, {isArchived: false}]};
    }

    if (needsSearch) {
        res = searchFilter;
    }
    if (hideArchived) {
        res = {...res, ...archiveFilter};
    }
    if (needsAnd) {
        res = {$and: Object.entries(res).map(([k, v]) => ({[k]: v}))};
    }

    return res;
}

export const getOrdering = (order: string|null) => {
    if (!order) {
        return;
    }

    const ord = order.toLocaleLowerCase();
    switch(ord) {
        case Ordering.ByPriority:
            return {'priority.code': -1};

        case Ordering.ByDueDate:
            return {dueDate: 1};

        case Ordering.ByPriorityAndDueDate:
            return {'priority.code': -1, dueDate: 1};

        case Ordering.ByCreatedAt:
            return {createdAt: -1};

        case Ordering.ByFinishedOn:
            return {finishedOn: -1};

        default:
            throw new BadRequestError('GET filtering', `Illegal sorting order ${order}`, {order});
    }
}

export const getGrouping = (grouping: string) => {
    if (!grouping) {
        return;
    }

    switch(grouping.toLocaleLowerCase()) {
        case Grouping.ByDomain:
            return 'domainArea';
        case Grouping.ByPriority:
            return 'priority';
        default:
            throw new BadRequestError('GET grouping', `Illegal grouping ${grouping}`, {grouping});
    }
}

export const getGroupSortingSign = (grouping: string) => {
    if (!grouping) {
        return;
    }

    switch(grouping.toLocaleLowerCase()) {
        case Grouping.ByDomain:
            return 1;
        case Grouping.ByPriority:
            return -1;
        default:
            throw new BadRequestError('GET grouping sign', `Illegal grouping ${grouping}`, {grouping});
    }
}

export const getGroupSortingField = (grouping: string) => {
    if (!grouping) {
        return;
    }

    switch(grouping.toLocaleLowerCase()) {
        case Grouping.ByDomain:
            return 'name';
        case Grouping.ByPriority:
            return 'code';
        default:
            throw new BadRequestError('GET group sorting field', `Illegal grouping ${grouping}`, {grouping});
    }
}
