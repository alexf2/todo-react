import axios, {AxiosResponse} from 'axios';
import {Todo, TodoExt, DomainArea, Priority, Id} from '../typings/dto';

const axInst = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export enum Grouping {
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

export type TodoRequest = {
    grouping?: Grouping;
    order?: Ordering;
    searchDescr?: string;
    showArchived?: boolean;
    onlyArchived?: boolean;
};

export type ReferenceRequest = {
    archived?: boolean;
    raw?: boolean;
};

export type Group<T> = {
    count: number;
    items: T[];
    _id: {
        code: number;
        name: string;
    }
};

export type FilterResult<T> = Group<T>[] | T[];

export type AddTodoParams = Omit<Todo, 'id' | '_id' | 'createdAt' | 'updatedAt'>;

export enum ArchiveFiltering {
    Active,
    All,
    OnlyArchive,
}


export const getTodos = (params: TodoRequest): Promise<AxiosResponse<FilterResult<TodoExt>>> =>
    axInst.get('/todos', {params});

export const getTodoById = (id: Id): Promise<AxiosResponse<TodoExt>> =>
    axInst.get(`/todos/${id}`);

export const addTodo = (todo: AddTodoParams): Promise<AxiosResponse<Todo>> =>
    axInst.post('/todos', todo);

export const updateTodo = (todo: Todo): Promise<AxiosResponse<Todo>> =>
    axInst.patch('/todos', todo);

export const deleteTodo = (id: Id): Promise<AxiosResponse<Todo>> =>
    axInst.delete(`/todos/${id}`);


export const getDomainAreas = (params: ReferenceRequest): Promise<AxiosResponse<DomainArea[]>> =>
    axInst.get('/domainAreas', {params});

export const getPriorities = (params: ReferenceRequest): Promise<AxiosResponse<Priority[]>> =>
    axInst.get('/priorities', {params});

