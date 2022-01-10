import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import {BlockOutlined} from '@ant-design/icons';
import {routesDef} from './routes';
import {ArrayElement} from '../typings';

const {Sider} = Layout;
const {Item} = Menu;

const renderItem = (r: ArrayElement<typeof routesDef>) =>
    <Item title={r.description} key={r.path} icon={<BlockOutlined />}>
        <NavLink exact to={r.path}>{r.description}</NavLink>
    </Item>;

export const Navigation: React.FC = () => {
    const {pathname} = useLocation();
    const path = React.useMemo(() => pathname.replace(/\/$/g, ''), [pathname]);

    return <Sider width='300px'>
        <Menu theme='dark' mode='inline' selectedKeys={[path]}>
            {routesDef.map(renderItem)}
        </Menu>
    </Sider>;
}
