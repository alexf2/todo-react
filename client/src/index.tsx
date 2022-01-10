import React from "react";
import ReactDOM from "react-dom";
import {HelmetProvider} from 'react-helmet-async';
import {BrowserRouter} from 'react-router-dom';
import {AppRoot} from './components';
import 'antd/dist/antd.less';
import './globalStyles/main.less';

ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <AppRoot />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById('spaRoot'),
);
