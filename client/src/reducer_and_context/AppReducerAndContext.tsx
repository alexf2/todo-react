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
import {ItemsContainer} from '../components/core/ItemsContainer';
import {GroupingRef, OrderingRef, FilteringRef} from '../utils/references';
import {storageToFilteringValue, hasActivity} from '../utils/helpers';
import {ArrayElement} from '../typings/ts-helpers';
import { updateTemplateSpan } from "typescript";

const logger = (name: string) => arg => console.log(`${name}: `, arg, ` - ${typeof arg}`);

const App: React.FC = () => {
    const {state, dispatch} = useStore();
    const {transits: {grouping, ordering, search}, transits} = state;
    const flag = storageToFilteringValue(state);

    const onFilter = useCallback((value: ArrayElement<FilteringRef>) => {
        dispatch(createAction<FilterArchiveAction>(ActionType.FilterArchive, {filtering: value.code}));
        setTimeout(() => dispatch(refreshTodosAction()), 0);
    }, []);

    const onGrouping = useCallback((value: Partial<ArrayElement<GroupingRef>>) => {
        dispatch(createAction<SetGroupingAction>(ActionType.SetGrouping, {grouping: value && value.code}));
        setTimeout(() => dispatch(refreshTodosAction()), 0);
    }, []);

    const onSorting = useCallback((value: Partial<ArrayElement<OrderingRef>>) => {
        dispatch(createAction<SetOrderingAction>(ActionType.SetOrdering, {ordering: value && value.code}));
        setTimeout(() => dispatch(refreshTodosAction()), 0);
    }, []);

    const onSearching = useCallback((value: string) => {
        dispatch(createAction<FilterByDescriptionAction>(ActionType.FilterByDescription, {search: value}));
        setTimeout(() => dispatch(refreshTodosAction()), 0);
    }, []);

    const disabled = hasActivity(state);
    const items = grouping === undefined ? state.todos : state.groupedTodos;

    return <div className='global__root-node'>
        <Header
            title='React useReducer with global context'
            disabled={disabled}
            filtering={flag}
            grouping={grouping}
            ordering={ordering}
            search={search}
            onFilterArchive={onFilter}
            onGrouping={onGrouping}
            onSorting={onSorting}
            onSearch={onSearching}
            count={items.length}
        />
        <ItemsContainer
            items={items}
            disabled={disabled}
            loading={transits.todosIsLoading}
            grouping={transits.grouping}
            editingTodo={transits.editingTodo}
            oneTodoError={transits.oneTodoError}
            updatingTodoError={transits.updatingTodoError}
            removingTodoError={transits.removingTodoError}
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
