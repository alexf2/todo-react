// import {hot} from 'react-hot-loader/root';
import React from "react";
import * as moment from 'moment';

const getNavigatorLanguage = () => navigator.languages && navigator.languages.length
    ?
    navigator.languages[0]
    :
    (navigator as any).userLanguage || navigator.language || (navigator as any).browserLanguage || 'en';

moment.locale(getNavigatorLanguage());

const RawApp: React.FC = () => (
    <div className='root-node'>
        <h1>Hello world!</h1>
        <div>Some text</div><br />
    </div>
);

export const App = RawApp;
