// import {hot} from 'react-hot-loader/root';
import React from "react";
import * as moment from 'moment';
import {Layout} from "antd";
import {Helmet} from "react-helmet-async";
import {Routing} from './Routing';

const getNavigatorLanguage = () => navigator.languages && navigator.languages.length
    ?
    navigator.languages[0]
    :
    (navigator as any).userLanguage || navigator.language || (navigator as any).browserLanguage || 'en';

moment.locale(getNavigatorLanguage());

export const AppRoot: React.FC = () => (
    <div className='global__root-node'>
        <Helmet defaultTitle='Todo list research' />
        <Layout className='global__layout'>
            <Routing />
        </Layout>
    </div>
);

