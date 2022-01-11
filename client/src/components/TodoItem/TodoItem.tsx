import React, {FC, useMemo, useCallback} from 'react';
import * as cn from 'classname';
import moment from 'moment';
import {Badge, Tooltip, Space, Button} from 'antd';
import {FileZipOutlined, CheckOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
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
        dueDate, estimationHours, finishedOn, dueDays, isOnTime, isFinished, disabled} = props;
    const stat = useMemo(() => priorityToStatusColor(code), [code]);

    const done = useCallback(() => alert('done'), []);
    const edit = useCallback(() => alert('edit'), []);
    const archive = useCallback(() => alert('archive'), []);
    const remove = useCallback(() => alert('remove'), []);

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
                {estimationHours && <span>H: {estimationHours},&nbsp;&nbsp;</span>}
                <span>Due: {moment(dueDate).format(moment.HTML5_FMT.DATE)},&nbsp;&nbsp;</span>
                {!isFinished && <span className={cn({[styles.headDateHighlight]: !isOnTime})}>Days to: {dueDays}&nbsp;&nbsp;</span>}
                {isFinished && <span className={cn({[styles.headDateHighlight]: !isOnTime})}>Finished on: {moment(finishedOn).format(moment.HTML5_FMT.DATE)}{formatDueDays(dueDays)}</span>}
            </div>

            <div className={styles.headControl}>
                <Space>
                    {!isArchived && !isFinished && <Button
                        disabled={disabled}
                        size='small'
                        onClick={done}
                        icon={
                            <CheckOutlined 
                                title='Done'
                                style={{color: 'green'}}
                            />
                    } />}

                    {!isArchived && !isFinished && <Button
                        disabled={disabled}
                        size='small'
                        onClick={edit}
                        icon={
                            <EditOutlined 
                                title='Edit'
                            />
                    } />}

                    {!isArchived && isFinished && <Button
                        disabled={disabled}
                        size='small'
                        onClick={archive}
                        icon={
                            <FileZipOutlined 
                                title='Archive'
                                style={{color: 'burlywood'}}
                            />
                    } />}

                    <Button
                        disabled={disabled}
                        size='small'
                        onClick={remove}
                        danger
                        icon={
                            <DeleteOutlined
                                title='Remove'
                            />
                    } />

                    {/*<span>done&nbsp;</span>
                    <span>edit&nbsp;</span>
                    <span>archive&nbsp;</span>
                    <span>remove&nbsp;</span>*/}
                </Space>
            </div>

         </div>
        <div className={styles.descr}>{props.description}</div>
    </div>;
});

TodoItem.displayName = 'TodoItem';
