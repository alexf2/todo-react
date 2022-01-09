import React, {useCallback} from "react";
import {TodoExt} from '../../typings/dto';

type TodoItemProps = TodoExt & {
    disabled?: boolean;
    loading?: boolean;
};

export const TodoItem = (props: TodoItemProps) => {
    return <span>{props.description}</span>;
}
