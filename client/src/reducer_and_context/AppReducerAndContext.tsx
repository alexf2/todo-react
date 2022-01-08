import React, {useCallback} from "react";
import {StorageProvider, useStore} from './store/storage';
import {
    refreshTodosAction,
    createAction,
    ActionType,
    FilterArchiveAction,
    SetGroupingAction,
    SetOrderingAction,
    FilterByDescriptionAction,
} from './store/actions';
import {Header} from '../components/core/Header';
import {GroupingRef, OrderingRef, FilteringRef} from '../utils/references';
import {storageToFilteringValue, hasActivity} from '../utils/helpers';
import {ArrayElement} from '../typings/ts-helpers';

const logger = (name: string) => arg => console.log(`${name}: `, arg, ` - ${typeof arg}`);

const App: React.FC = () => {
    const {state, dispatch} = useStore();
    const {transits: {grouping, ordering, search}} = state;
    const flag = storageToFilteringValue(state);

    const onFilter = useCallback((value: ArrayElement<FilteringRef>) => {
        dispatch(createAction<FilterArchiveAction>(ActionType.FilterArchive, {filtering: value.code}));
        dispatch(refreshTodosAction());
    }, []);

    const onGrouping = useCallback((value: Partial<ArrayElement<GroupingRef>>) => {
        dispatch(createAction<SetGroupingAction>(ActionType.SetGrouping, {grouping: value.code}));
        dispatch(refreshTodosAction());
    }, []);

    const onSorting = useCallback((value: Partial<ArrayElement<OrderingRef>>) => {
        dispatch(createAction<SetOrderingAction>(ActionType.SetOrdering, {ordering: value.code}));
        dispatch(refreshTodosAction());
    }, []);

    const onSearching = useCallback((value: string) => {
        dispatch(createAction<FilterByDescriptionAction>(ActionType.FilterByDescription, {search: value}));
        dispatch(refreshTodosAction());
    }, []);

    return <div className='global__root-node'>
        <Header
            title='React useReducer with global context'
            disabled={hasActivity(state)}
            filtering={flag}
            grouping={grouping}
            ordering={ordering}
            search={search}
            onFilterArchive={onFilter}
            onGrouping={onGrouping}
            onSorting={onSorting}
            onSearch={onSearching}
        />
    </div>;
}

const AppReducerAndContext: React.FC = () => (
    <StorageProvider>
        <App />
    </StorageProvider>
);

export default AppReducerAndContext;

// https://blog.harveydelaney.com/creating-your-own-mini-redux-in-react/
// https://webformyself.com/alternativa-redux-s-pomoshhyu-react-context-i-xukov/
// https://stackoverflow.com/questions/53146795/react-usereducer-async-data-fetch
// упаковка асинхронных акций в провайдер: https://newbedev.com/react-usereducer-async-data-fetch
// или реализация своего dispatchWrapper.
// имплементация useReducer + useContext: https://github.com/danielrohers/react-context-reducer
