import escapeEx from 'escape-string-regexp';
import {BadRequestError} from '../helpers';

enum Grouping {
    None,
    ByDomain = 'domain',
    ByPriority = 'priority',
}
enum Ordering {
    ByPriority ='priority',
    ByDueDate = 'duedate',
    ByPriorityAndDueDate = 'priorityandduedate',
    ByCreatedAt = 'createdat',
    ByFinishedOn = 'finishedon',
}

export const getTodoFilter = (searchString?: string|null, showArchived?: boolean|null) => {
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
    if (hideArchived) {
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

export const getOrdering = (order: string) => {
    if (!order) {
        return;
    }

    let field;
    switch(order.toLocaleLowerCase()) {
        case Ordering.ByPriority:
            return {'priority.code': -1};

        case Ordering.ByDueDate:
            return {dueDate: -1};

        case Ordering.ByPriorityAndDueDate:
            return {'priority.code': -1, dueDate: -1};

        case Ordering.ByCreatedAt:
            field = 'createdAt';
            break;

        case Ordering.ByFinishedOn:
            return {finishedOn: -1};

        default:
            throw new BadRequestError('GET filtering', `Illegal sorting order ${order}`, {order});
    }
    return {[field]: 1};
}

export const getGrouping = (grouping: string) => {
    if (!grouping) {
        return;
    }

    switch(grouping.toLocaleLowerCase()) {
        case Grouping.None:
            return;
        case Grouping.ByDomain:
            return 'domainArea.code';
        case Grouping.ByPriority:
            return 'priority.code';
        default:
            throw new BadRequestError('GET grouping', `Illegal grouping ${grouping}`, {grouping});
    }
}
