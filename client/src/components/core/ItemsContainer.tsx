import React, {useCallback} from "react";
import {TodoExt, Id} from '../../typings/dto';
import {Group, Grouping} from '../../utils/api';
import {ErrInfo} from '../../typings/storage';

type ItemsContainerProps = {
    disabled?: boolean;
    loading?: boolean;
    
    items: TodoExt[] | Group<TodoExt>[];
    
    oneTodoError: ErrInfo;
    updatingTodoError: ErrInfo;
    removingTodoError: ErrInfo;

    grouping?: Grouping;
    editingTodo?: Id;
};

export const ItemsContainer = (props: ItemsContainerProps) => {
    const {items} = props;
    return <span>{items.length}</span>;
}
