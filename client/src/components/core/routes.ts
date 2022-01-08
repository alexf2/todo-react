import React from "react";

const AppReducer = React.lazy(() => import ('../../reducer_and_context/AppReducerAndContext'));
const AppStyledReducer = React.lazy(() => import ('../../styled_reducer_and_context/AppStyledReducer'))
const AppRecoil = React.lazy(() => import ('../../recoil/AppRecoil'));
const AppReduxSlices = React.lazy(() => import ('../../redux_slices/AppReduxSlices'));
const AppRxjsReduxSlices = React.lazy(() => import ('../../rxjs_redux/AppRxjsReduxSlices'));

export const routesDef = [
    {
        key: 'reducer_context',
        path: '/reducer_context',
        description: 'getReducer + React Context',
        title: 'Todo List on getReducer and React Context',
        formComponent: AppReducer,
    },

    {
        key: 'styled_reducer_context',
        path: '/styled_reducer_context',
        description: 'getReducer + React Context Styled',
        title: 'Todo List on getReducer and React Context with Styled components',
        formComponent: AppStyledReducer,
    },

    {
        key: 'recoil',
        path: '/recoil',
        description: 'Recoil',
        title: 'Todo List on Recoil',
        formComponent: AppRecoil,
    },

    {
        key: 'redux_slices',
        path: '/redux_slices',
        description: 'Redux + Toolkit Slices',
        title: 'Todo List on React Toolkit and slices',
        formComponent: AppReduxSlices,
    },

    {
        key: 'rxjs_redux',
        path: '/rxjs_redux',
        description: 'Rxjs + classic Redux',
        title: 'Todo List on classic Redux with ImmutableJs and Rxjs',
        formComponent: AppRxjsReduxSlices,
    },
];
