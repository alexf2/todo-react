import React, {FC, useCallback, ChangeEvent} from 'react';
import {PageHeader, Input, Space, Select, Badge} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {Grouping, Ordering, ArchiveFiltering} from '../../utils/api';
import {GROUPING_REF, ORDERING_REF, FILTERING_REF, GroupingRef, OrderingRef, FilteringRef} from '../../utils/references';
import {ArrayElement} from '../../typings/ts-helpers';
import styles from './header.less';


const REFERENCE_MAPPING = {
    label: 'name',
    value: 'code',
    options: 'options',
};

const EMPTY_REF_ITEM = {code: undefined, name: ''};

type HeaderProps = {
    title: string;
    disabled?: boolean;
    filtering?: ArchiveFiltering;
    grouping?: Grouping;
    ordering?: Ordering;
    search?: string;
    onFilterArchive?: (option: ArrayElement<FilteringRef>) => void;
    onGrouping?: (option: Partial<ArrayElement<GroupingRef>>) => void;
    onSorting?: (option: Partial<ArrayElement<OrderingRef>>) => void;
    onSearch?: (value: string) => void;
    count: number;
};

export const Header: FC<HeaderProps> = React.memo(props => {
    const {title, disabled, filtering, grouping, ordering, search, count} = props;
    const {onFilterArchive, onGrouping, onSorting, onSearch} = props;

    const archiveFilteringHandler = useCallback((value: ArchiveFiltering, option: /*ArrayElement<FilteringRef>*/any) => {
        onFilterArchive && onFilterArchive(option);
    }, [onFilterArchive]);

    const groupingHandler = useCallback((value: Grouping, option: /*ArrayElement<GroupingRef>*/any) => {
        onGrouping && onGrouping(option);
    }, [onGrouping]);
    const clearGrouping = useCallback(() => {
        onGrouping && onGrouping(EMPTY_REF_ITEM);
    }, [onGrouping]);

    const sortingHandler = useCallback((value: Ordering, option: /*ArrayElement<OrderingRef>*/any) => {
        onSorting && onSorting(option);
    }, [onSorting]);
    const clearSorting = useCallback(() => {
        onSorting && onSorting(EMPTY_REF_ITEM);
    }, [onGrouping]);

    const searchingHandler = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault();
        onSearch && onSearch(ev.target.value as any as string);
    }, [onSearch]);

    return <PageHeader
            title={title} 
            tags={<Badge style={{backgroundColor: '#52c41a'}} count={count} overflowCount={1000} />}
            >
        <div className={styles.container}>
            <Space>
                <Select<ArchiveFiltering, ArrayElement<FilteringRef>>
                    className='global__field'
                    labelInValue={false}
                    options={FILTERING_REF}
                    filterOption={false}
                    fieldNames={REFERENCE_MAPPING}
                    disabled={disabled}
                    placeholder='Show active or/and archive Todos'
                    defaultValue={ArchiveFiltering.Active}
                    value={filtering}
                    onChange={archiveFilteringHandler}
                />
                <Select<Grouping, ArrayElement<GroupingRef>>
                    className='global__field'
                    labelInValue={false}
                    options={GROUPING_REF}
                    filterOption={false}
                    fieldNames={REFERENCE_MAPPING}
                    disabled={disabled}
                    allowClear
                    placeholder='Grouping Todos by Domain'
                    value={grouping}
                    onChange={groupingHandler}
                    onClear={clearGrouping}
                />
                <Select<Ordering, ArrayElement<OrderingRef>>
                    className='global__field'
                    labelInValue={false}
                    options={ORDERING_REF}
                    filterOption={false}
                    fieldNames={REFERENCE_MAPPING}
                    disabled={disabled}
                    allowClear
                    placeholder='Sorting Todos by...'
                    value = {ordering}
                    onChange={sortingHandler}
                    onClear={clearSorting}
                />
            </Space>
            <Input
                className={styles.search}
                disabled={disabled}
                placeholder='Filter by description'
                allowClear
                onChange={searchingHandler}
                suffix={<SearchOutlined />}
                value = {search}
            />
        </div>
    </PageHeader>
});

Header.displayName = 'Header';
