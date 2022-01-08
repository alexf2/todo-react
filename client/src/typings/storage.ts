import {TodoExt, Priority, DomainArea, Id} from './dto';
import {Group, Grouping, Ordering} from '../utils/api';

export type ErrInfo = Record<Id, string | undefined>;
export type LoadingInfo = Record<Id, boolean>;

export type Storage = {
    todos: TodoExt[];
    groupedTodos: Group<TodoExt>[];
    references: {
        priorities: Priority[];
        domains: DomainArea[];
    };
    transits: {
        todosIsLoading: boolean;
        oneTodoIsLoading: LoadingInfo;
        addingTodo: boolean;
        updatingTodo: LoadingInfo;
        removingTodo: LoadingInfo;
        domainAreasIsLoading: boolean;
        prioritiesIsloading: boolean;

        // Todo errors
        todosError?: string;
        oneTodoError: ErrInfo;
        addingTodoError?: string;
        updatingTodoError: ErrInfo;
        removingTodoError: ErrInfo;

        // Refs errors
        domainError?: string;
        priorityError?: string;

        // Filtering and presenting
        grouping?: Grouping;
        ordering?: Ordering;
        search?: string;
        showArchived?: boolean;
        onlyArchived?: boolean;

        editingNewTodo?: boolean;
        editingTodo?: Id;
    };
};

export const initialState: Storage = {
    todos: [],
    groupedTodos: [],
    references: {
        priorities: [],
        domains: [],
    },
    transits: {
        todosIsLoading: false,
        oneTodoIsLoading: {},
        addingTodo: false,
        updatingTodo: {},
        removingTodo: {},
        domainAreasIsLoading: false,
        prioritiesIsloading: false,

        oneTodoError: {},
        updatingTodoError: {},
        removingTodoError: {},

        grouping: Grouping.ByDomain,
        ordering: Ordering.ByPriorityAndDueDate,
    }
};
