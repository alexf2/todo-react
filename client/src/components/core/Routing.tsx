import React from "react";
import {Helmet} from "react-helmet-async";
import {Switch, Route, Redirect} from 'react-router-dom';
import {Spin} from 'antd';
import {Navigation} from './Navigation';
import {routesDef} from './routes';
import {ArrayElement} from '../../typings';

const buildRoute = (r: ArrayElement<typeof routesDef>) => {
    const FormComponent = r.formComponent;

    return <Route exact path={r.path} key={r.key}>
        <Helmet title={r.title} />
        <React.Suspense fallback={<div className='global__container'><Spin /></div>}>
            
            <FormComponent />
        </React.Suspense>
    </Route>;
};

export const Routing: React.FC = () => <>
    <Route path='/'>
        <Navigation />
    </Route>
    <Switch>
        <Route exact path="/">
            <Redirect to={routesDef[0].path} />
        </Route>
        {routesDef.map(buildRoute)}
    </Switch>
</>;
