/* eslint-disable no-underscore-dangle */
import {Todo, TodoExt, Id, DomainArea, Priority} from '../../typings/dto';
import {
    TodoRequest,
    ReferenceRequest,
    AddTodoParams,
    getTodos,
    getTodoById,
    addTodo,
    updateTodo,
    deleteTodo,
    getDomainAreas,
    getPriorities,
    Group} from '../../utils/api';

export enum ActionType {
    LoadingTodos,
    GotTodos,
    ErrorTodos,

    LoadingOneTodo,
    GotOneTodo,
    ErrorOneTodo,

    AddingTodo,
    AddedTodo,
    ErrorAddTodo,

    UpdatingTodo,
    UpdatedTodo,
    ErrorUpdateTodo,

    RemovingTodo,
    RemovedTodo,
    ErrorRemoveTodo,

    LoadingDomainAreas,
    GotDomainAreas,
    ErrorDomainAreas,

    LoadingPriorities,
    GotPriorities,
    ErrorPriorities,
}

export type Dispatch = <A extends BaseAction<ActionType>>(action: A, ...extraArgs: any[]) => A;

export type BaseAction<T> = {
    type: T;
}
export type BaseErrorAction<T> = BaseAction<T> & {
    message: string;
}
export type BaseErrorActionWithId<T> = BaseErrorAction<T> & {
    _id: Id;
}
export type BaseLoadingAction<T> = BaseAction<T> & {
    isLoading: boolean;
};
export type BaseLoadingActionWithId<T> = BaseLoadingAction<T> & {
    _id: Id;
};

const createErrorDescription = (err: Error, descr?: string) => {
    const {message} = err;
    return descr ? `${descr}: ${message}` : message;
}

const createAction = <T extends ActionType>(type: T, data: Record<string, unknown>) => ({type, ...data});
export const beginLoading = <T extends ActionType>(type: T, data?: Record<string, unknown>): BaseLoadingAction<T> => ({type, isLoading: true, ...data});
export const endLoading = <T extends ActionType>(type: T, data?: Record<string, unknown>): BaseLoadingAction<T> => ({type, isLoading: false, ...data});
const createErrorAction = <T extends ActionType>(type: T, err: Error, descr?: string, data?: Record<string, unknown>) =>
    ({type, message: createErrorDescription(err, descr), ...data});

// getTodos begin
export const getTodosAction = (req: TodoRequest) => async (dispatch: Dispatch): Promise<void> => {
    try {
        dispatch(beginLoading(ActionType.LoadingTodos));

        const todos = (await getTodos(req)).data;
        const result = req.grouping === undefined ?
            {todos, groupedTodos: []} : {todos: [], groupedTodos: todos};

        console.log(result);

        dispatch(createAction(ActionType.GotTodos, result));
    } catch (error) {
        console.error(error);
        dispatch(createErrorAction(ActionType.ErrorTodos, error as Error, 'Loading todos'));
    } finally {
        dispatch(endLoading(ActionType.LoadingTodos));
    }
}
export type LoadingTodosAction = BaseLoadingAction<ActionType.LoadingTodos>;
export type GotTodosAction = BaseAction<ActionType.GotTodos> & {
    todos: TodoExt[];
    groupedTodos: Group<TodoExt>[];
}
export type ErrorTodosAction = BaseErrorAction<ActionType.ErrorTodos>;
// getTodos end


// getOneTodo begin
export const getOneTodoAction = (id: Id) => async (dispatch: Dispatch): Promise<void> => {
    try {
        dispatch(beginLoading(ActionType.LoadingOneTodo, {id}));

        const todo = (await getTodoById(id)).data;

        dispatch(createAction(ActionType.GotOneTodo, {todo}));
    } catch (error) {
        dispatch(createErrorAction(ActionType.ErrorOneTodo, error as Error, `Loading todo ${id}`));
    } finally {
        dispatch(endLoading(ActionType.LoadingOneTodo, {id}));
    }
}
export type LoadingOneTodoAction = BaseLoadingActionWithId<ActionType.LoadingOneTodo>;
export type GotOneTodoAction = BaseAction<ActionType.GotOneTodo> & {
    todo: TodoExt;
}
export type ErrorOneTodoAction = BaseErrorActionWithId<ActionType.ErrorOneTodo>;
// getOneTodo end


// addTodo begin
export const addTodoAction = (todo: AddTodoParams) => async (dispatch: Dispatch): Promise<void> => {
    try {
        dispatch(beginLoading(ActionType.AddingTodo));

        const resTodo = (await addTodo(todo)).data;

        dispatch(createAction(ActionType.AddedTodo, {todo: resTodo}));
    } catch (error) {
        dispatch(createErrorAction(ActionType.ErrorAddTodo, error as Error, `Adding todo "${todo.description}"`));
    } finally {
        dispatch(endLoading(ActionType.AddingTodo));
    }
}
export type AddingTodoAction = BaseLoadingActionWithId<ActionType.AddingTodo>;
export type AddedTodoAction = BaseAction<ActionType.AddedTodo> & {
    todo: Todo;
}
export type ErrorAddingTodoAction = BaseErrorActionWithId<ActionType.ErrorAddTodo>;
// addTodo end

// updateTodo begin
export const updateTodoAction = (todo: Todo) => async (dispatch: Dispatch): Promise<void> => {
    try {
        dispatch(beginLoading(ActionType.UpdatingTodo, {id: todo._id}));

        const resTodo = (await updateTodo(todo)).data;

        dispatch(createAction(ActionType.UpdatedTodo, {todo: resTodo}));
    } catch (error) {
        dispatch(createErrorAction(ActionType.ErrorUpdateTodo, error as Error, `Updating todo ${todo._id}`));
    } finally {
        dispatch(endLoading(ActionType.UpdatingTodo, {id: todo._id}));
    }
}
export type UpdatingTodoAction = BaseLoadingActionWithId<ActionType.UpdatingTodo>;
export type UpdatedTodoAction = BaseAction<ActionType.UpdatedTodo> & {
    todo: Todo;
}
export type ErrorUpdatingTodoAction = BaseErrorActionWithId<ActionType.ErrorUpdateTodo>;
// updateTodo end

// deleteTodo begin
export const deleteTodoAction = (id: Id) => async (dispatch: Dispatch): Promise<void> => {
    try {
        dispatch(beginLoading(ActionType.RemovingTodo, {id}));

        const resTodo = (await deleteTodo(id)).data;

        dispatch(createAction(ActionType.RemovedTodo, {todo: resTodo}));
    } catch (error) {
        dispatch(createErrorAction(ActionType.ErrorRemoveTodo, error as Error, `Removing todo "${id}"`));
    } finally {
        dispatch(endLoading(ActionType.RemovingTodo, {id}));
    }
}
export type RemovingTodoAction = BaseLoadingActionWithId<ActionType.RemovingTodo>;
export type RemovedTodoAction = BaseAction<ActionType.RemovedTodo> & {
    todo: Todo;
}
export type ErrorRemovingTodoAction = BaseErrorActionWithId<ActionType.ErrorRemoveTodo>;
// deleteTodo end

// getDomains begin
export const getDomainAreasAction = (req: ReferenceRequest) => async (dispatch: Dispatch): Promise<void> => {
    try {
        dispatch(beginLoading(ActionType.LoadingDomainAreas));

        const reference = (await getDomainAreas(req)).data;

        dispatch(createAction(ActionType.GotDomainAreas, {reference}));
    } catch (error) {
        dispatch(createErrorAction(ActionType.ErrorDomainAreas, error as Error, 'Loading domain areas ref'));
    } finally {
        dispatch(endLoading(ActionType.LoadingDomainAreas));
    }
}
export type LoadingDomainAreasAction = BaseLoadingAction<ActionType.LoadingDomainAreas>;
export type GotDomainAreasAction = BaseAction<ActionType.GotDomainAreas> & {
    reference: DomainArea[];
}
export type ErrorGotDomainAreasAction = BaseErrorAction<ActionType.ErrorDomainAreas>;
// getDomains end

// getPriorities begin
export const getPrioritiesAction = (req: ReferenceRequest) => async (dispatch: Dispatch): Promise<void> => {
    try {
        dispatch(beginLoading(ActionType.LoadingPriorities));

        const reference = (await getPriorities(req)).data;

        dispatch(createAction(ActionType.GotPriorities, {reference}));
    } catch (error) {
        dispatch(createErrorAction(ActionType.ErrorPriorities, error as Error, 'Loading priorities ref'));
    } finally {
        dispatch(endLoading(ActionType.LoadingPriorities));
    }
}
export type LoadingPrioritiesAction = BaseLoadingAction<ActionType.LoadingPriorities>;
export type GotPrioritiesAction = BaseAction<ActionType.GotPriorities> & {
    reference: Priority[];
}
export type ErrorPrioritiesAction = BaseErrorAction<ActionType.ErrorPriorities>;
// getPriorities end

