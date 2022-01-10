import React, {FC, useMemo} from 'react';
import {Badge, Tooltip} from 'antd';
import {TodoExt, PriorityEnum} from '../../typings/dto';
import styles from './todoItem.less';

type TodoItemProps = TodoExt & {
    disabled?: boolean;
    loading?: boolean;
    editing?: boolean;
    error?: string;
};

const priorityToStatusColor = (code: PriorityEnum) => {
    switch (code) {
        case PriorityEnum.Normal:
            return 'blue';
        case PriorityEnum.High:
            return 'yellow';
        case PriorityEnum.Critical:
            return 'red';
        default: // Low
            return 'green';
    }
}

export const TodoItem: FC<TodoItemProps> = React.memo((props: TodoItemProps) => {
    const {domainArea: {name}, priority: {code, name: priority}} = props;
    const stat = useMemo(() => priorityToStatusColor(code), [code]);

    return <div className={styles.item}>
         <div className={styles.head}>
            <Tooltip placement='top' title={priority} overlayClassName={styles.tooltip}>
                <Badge className={styles.priority} color={stat} />
            </Tooltip>
            {name}
         </div>
        <div className={styles.descr}>{props.description}</div>
    </div>;
});

TodoItem.displayName = 'TodoItem';
