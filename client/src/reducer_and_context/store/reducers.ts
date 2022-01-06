/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import produce from "immer";
import { Id } from "react-toastify";
import {Storage, initialState} from '../../typings/storage';
import {
    BaseAction,
    ActionType,
    LoadingTodosAction,
    GotTodosAction,
    ErrorTodosAction,
    LoadingOneTodoAction,
    GotOneTodoAction,
    ErrorOneTodoAction,
    AddingTodoAction,
    AddedTodoAction,
    ErrorAddingTodoAction,
    UpdatingTodoAction,
    UpdatedTodoAction,
    ErrorUpdatingTodoAction,
    RemovingTodoAction,
    RemovedTodoAction,
    ErrorRemovingTodoAction,
    LoadingDomainAreasAction,
    GotDomainAreasAction,
    ErrorGotDomainAreasAction,
    LoadingPrioritiesAction,
    GotPrioritiesAction,
    ErrorPrioritiesAction,
} from './actions';

type Transits = Storage['transits'];
type LoadingKey = 'todosIsLoading' | 'addingTodo' | 'domainAreasIsLoading' | 'prioritiesIsloading';
type ErrorKey = 'todosError' | 'addingTodoError' | 'domainError' | 'priorityError';
type LoadingKeyId = 'oneTodoIsLoading' | 'updatingTodo' | 'removingTodo';
type ErrorKeyId = 'oneTodoError' | 'updatingTodoError' | 'removingTodoError';

const updateLoading = (
    transits: Transits,
    loadingKey: LoadingKey,
    errorKey: ErrorKey,
    isLoading: boolean) => {

    transits[loadingKey] = isLoading;
    if (isLoading)
        transits[errorKey] = undefined;
}

const updateLoadingId = (
    transits: Transits,
    loadingKey: LoadingKeyId,
    errorKey: ErrorKeyId,
    _id: Id,
    isLoading: boolean) => {
        transits[loadingKey][_id] = isLoading;
        if (isLoading)
            transits[errorKey][_id] = undefined;
    }

export const mainReducer = (state: Storage = initialState, action: BaseAction<ActionType>): Storage => {
    switch (action.type) {
        // load todos
        case ActionType.LoadingTodos:
            return produce(state, draft => {
                const {isLoading} = action as LoadingTodosAction;
                updateLoading(draft.transits, 'todosIsLoading', 'todosError', isLoading);
            });
        case ActionType.GotTodos:
                return produce(state, draft => {
                    draft.todos = (action as GotTodosAction).todos;
                    draft.groupedTodos = (action as GotTodosAction).groupedTodos;
                });
        case ActionType.ErrorTodos:
            return produce(state, draft => {
                draft.transits.todosError = (action as ErrorTodosAction).message;
            });

        // load oneTodo
        case ActionType.LoadingOneTodo:
            return produce(state, draft => {
                const {_id, isLoading} = (action as LoadingOneTodoAction);
                updateLoadingId(draft.transits, 'oneTodoIsLoading', 'oneTodoError', _id, isLoading);
            });

        case ActionType.GotOneTodo:
            return produce(state, draft => {
                const {todo} = action as GotOneTodoAction;
                const i = draft.todos.findIndex(item => item._id === todo._id);
                if (i > -1)
                    draft.todos[i] = todo;
            });
        case ActionType.ErrorOneTodo:
            return produce(state, draft => {
                const {_id, message} = action as ErrorOneTodoAction;
                draft.transits.oneTodoError[_id] = message;
            });

        // add todo
        case ActionType.AddingTodo:
            return produce(state, draft => {
                const {isLoading} = action as AddingTodoAction;
                updateLoading(draft.transits, 'addingTodo', 'addingTodoError', isLoading);
            });
        case ActionType.AddedTodo:
                return produce(state, draft => {
                    draft.todos.push((action as AddedTodoAction).todo);
                });
        case ActionType.ErrorAddTodo:
            return produce(state, draft => {
                draft.transits.addingTodoError = (action as ErrorAddingTodoAction).message;
            });

        // update todo
        case ActionType.UpdatingTodo:
            return produce(state, draft => {
                const {_id, isLoading} = (action as UpdatingTodoAction);
                updateLoadingId(draft.transits, 'updatingTodo', 'updatingTodoError', _id, isLoading);
            });

        case ActionType.UpdatedTodo:
            return produce(state, draft => {
                const {todo} = action as UpdatedTodoAction;
                const i = draft.todos.findIndex(item => item._id === todo._id);
                if (i > -1)
                    draft.todos[i] = todo;
            });
        case ActionType.ErrorUpdateTodo:
            return produce(state, draft => {
                const {_id, message} = action as ErrorUpdatingTodoAction;
                draft.transits.updatingTodoError[_id] = message;
            });

        // remove tod
        case ActionType.RemovingTodo:
            return produce(state, draft => {
                const {_id, isLoading} = (action as RemovingTodoAction);
                updateLoadingId(draft.transits, 'removingTodo', 'removingTodoError', _id, isLoading);
            });

        case ActionType.RemovedTodo:
            return produce(state, draft => {
                const {todo} = action as RemovedTodoAction;
                const i = draft.todos.findIndex(item => item._id === todo._id);
                if (i > -1)
                draft.todos.splice(i, 1);
            });
        case ActionType.ErrorRemoveTodo:
            return produce(state, draft => {
                const {_id, message} = action as ErrorRemovingTodoAction;
                draft.transits.removingTodoError[_id] = message;
            });

        // load domain
        case ActionType.LoadingDomainAreas:
            return produce(state, draft => {
                const {isLoading} = action as LoadingDomainAreasAction;
                updateLoading(draft.transits, 'domainAreasIsLoading', 'domainError', isLoading);
            });
        case ActionType.GotDomainAreas:
                return produce(state, draft => {
                    draft.references.domains = (action as GotDomainAreasAction).reference;
                });
        case ActionType.ErrorDomainAreas:
            return produce(state, draft => {
                draft.transits.domainError = (action as ErrorGotDomainAreasAction).message;
            });

        // load priorities
        case ActionType.LoadingPriorities:
            return produce(state, draft => {
                const {isLoading} = action as LoadingPrioritiesAction;
                updateLoading(draft.transits, 'prioritiesIsloading', 'priorityError', isLoading);
            });
        case ActionType.GotPriorities:
                return produce(state, draft => {
                    draft.references.priorities = (action as GotPrioritiesAction).reference;
                });
        case ActionType.ErrorPriorities:
            return produce(state, draft => {
                draft.transits.priorityError = (action as ErrorPrioritiesAction).message;
            });

        default:
            return state;
    }
}
