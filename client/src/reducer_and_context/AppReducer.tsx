import React from "react";
import {StorageProvider} from './store/storage';

const AppReducer: React.FC = () => (
    <div className='global__root-node'>
        <StorageProvider>
            <h1>Reducer + context</h1>
            <div>Hello!</div>
        </StorageProvider>
    </div>
);

export default AppReducer;

// https://blog.harveydelaney.com/creating-your-own-mini-redux-in-react/
// https://webformyself.com/alternativa-redux-s-pomoshhyu-react-context-i-xukov/
// https://stackoverflow.com/questions/53146795/react-usereducer-async-data-fetch
// упаковка асинхронных акций в провайдер: https://newbedev.com/react-usereducer-async-data-fetch
// или реализация своего dispatchWrapper.
// имплементация useReducer + useContext: https://github.com/danielrohers/react-context-reducer
