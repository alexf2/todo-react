import React, {FC, useMemo} from 'react';
import * as cn from 'classname';
import moment from 'moment';
import {FileZipOutlined} from '@ant-design/icons';
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

const formatDueDays = days => {
    if (days === 0)
        return '';
    if (days < 0)
        return ` / ${-days}D later`;
    return ` / ${days}D before`;
}

export const TodoItem: FC<TodoItemProps> = React.memo((props: TodoItemProps) => {
    const {domainArea: {name}, priority: {code, name: priority}, isArchived,
        dueDate, estimationHours, finishedOn, dueDays, isOnTime, isFinished} = props;
    const stat = useMemo(() => priorityToStatusColor(code), [code]);

    return <div className={cn(styles.item, {[styles.itemFinished]: isFinished})}>
         <div className={styles.head}>
            <div className={styles.headGroup}>
                <Tooltip placement='top' title={priority} overlayClassName={styles.tooltip}>
                    <Badge className={styles.priority} color={stat} />
                </Tooltip>
                {isArchived && <FileZipOutlined className={styles.icon} style={{color: 'burlywood'}} title='Archived' />}
                <span className={styles.headGroupName}>{name}</span>
            </div>

            <div className={styles.headDate}>
                {estimationHours && <span>H: {estimationHours}&nbsp;</span>}
                <span>Due: {moment(dueDate).format(moment.HTML5_FMT.DATE)}&nbsp;</span>
                {!isFinished && <span className={cn({[styles.headDateHighlight]: !isOnTime})}>Days to: {dueDays}&nbsp;</span>}
                {isFinished && <span className={cn({[styles.headDateHighlight]: !isOnTime})}>Finished on: {moment(finishedOn).format(moment.HTML5_FMT.DATE)}{formatDueDays(dueDays)}</span>}
            </div>

            <div className={styles.headControl}>
                <span>done&nbsp;</span>
                <span>edit&nbsp;</span>
                <span>archive&nbsp;</span>
                <span>remove&nbsp;</span>
            </div>

         </div>
        <div className={styles.descr}>{props.description}</div>
    </div>;
});

TodoItem.displayName = 'TodoItem';
