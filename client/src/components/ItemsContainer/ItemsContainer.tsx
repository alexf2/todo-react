import React, {useCallback, FC} from "react";
import {TodoExt, Id} from '../../typings/dto';
import {Group, Grouping} from '../../utils/api';
import {ErrInfo, LoadingInfo} from '../../typings/storage';
import {TodoItem} from '../TodoItem/TodoItem';
import styles from './itemsContainer.less';

type ItemsContainerProps = {
    disabled?: boolean;
    loading?: boolean;

    oneTodoIsLoading: LoadingInfo;
    updatingTodo: LoadingInfo;
    removingTodo: LoadingInfo;

    grouping?: Grouping;
    items: TodoExt[] | Group<TodoExt>[];
    
    oneTodoError: ErrInfo;
    updatingTodoError: ErrInfo;
    removingTodoError: ErrInfo;

    editingTodo?: Id;
};

type FlatViewProps = {
    disabled?: boolean;

    items: TodoExt[];
    
    oneTodoIsLoading: LoadingInfo;
    updatingTodo: LoadingInfo;
    removingTodo: LoadingInfo;
    
    oneTodoError: ErrInfo;
    updatingTodoError: ErrInfo;
    removingTodoError: ErrInfo;

    editingTodo?: Id;
};

const FlatView: FC<FlatViewProps> = (props: FlatViewProps) => {
    const {items, disabled, oneTodoIsLoading, updatingTodo, removingTodo,
        oneTodoError, updatingTodoError, removingTodoError, editingTodo,
    } = props;

    return <div>{
        items.map(it => {
            const {_id: id} = it;
            const loading = oneTodoIsLoading[id] || updatingTodo[id] || removingTodo[id];
            const dFlag = disabled || loading;
            const error = oneTodoError[id] || updatingTodoError[id] || removingTodoError[id];

            return <TodoItem key={id} {...it} disabled={dFlag} loading={loading} editing={editingTodo === id} error={error} />;
    })
    }</div>;
}

type GroupedViewProps = {
    disabled?: boolean;
    items: Group<TodoExt>[];
};

const GroupedView: FC<GroupedViewProps> = (props: GroupedViewProps) => {
    const {items} = props;
    return <div>{items.length}</div>;
}

export const ItemsContainer: FC<ItemsContainerProps> = (props: ItemsContainerProps) => {
    const {grouping, disabled, loading, items, oneTodoError, updatingTodoError,
        removingTodoError, editingTodo, oneTodoIsLoading, updatingTodo, removingTodo, 
    } = props;
    return <div className={styles.container}>
            {grouping === undefined ? 
                <FlatView
                    disabled={disabled || loading}
                    items={items as TodoExt[]}
                    oneTodoIsLoading={oneTodoIsLoading}
                    updatingTodo={updatingTodo}
                    removingTodo={removingTodo}
                    oneTodoError={oneTodoError}
                    updatingTodoError={updatingTodoError}
                    removingTodoError={removingTodoError}
                    editingTodo={editingTodo}
                />
                :
                <GroupedView
                    disabled={disabled || loading}
                    items={items as Group<TodoExt>[]}
                />
            }
        </div>
}
