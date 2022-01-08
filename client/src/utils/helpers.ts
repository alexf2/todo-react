import {ArchiveFiltering} from './api';
import {Storage} from '../typings/storage';

export const storageToFilteringValue = (stg: Storage): ArchiveFiltering => {
    const {showArchived, onlyArchived} = stg.transits;

    if (onlyArchived)
        return ArchiveFiltering.OnlyArchive;
    if (showArchived)
        return ArchiveFiltering.All;
    return ArchiveFiltering.Active;
}

export const filteringValuesToStorage = (flt: ArchiveFiltering) => {
    switch (flt) {
        case ArchiveFiltering.Active: // 0
            return {showArchived: undefined, onlyArchived: undefined};
        case ArchiveFiltering.All: // 1
            return {showArchived: true, onlyArchived: undefined};
        default: // 2
            return {showArchived: true, onlyArchived: true};
    }
}

export const hasActivity = (stg: Storage) => {
    const {transits: {todosIsLoading, addingTodo, domainAreasIsLoading, prioritiesIsloading}} = stg;

    return todosIsLoading || addingTodo || domainAreasIsLoading || prioritiesIsloading || false;
}
