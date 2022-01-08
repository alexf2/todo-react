import React, {useReducer, useCallback, createContext, ReactChild, ReactChildren, FC, useEffect, useContext} from "react";
import {Storage, initialState} from '../../typings/storage';
import {mainReducer} from './reducers';
import {Dispatch, getTodosAction, getDomainAreasAction, getPrioritiesAction} from './actions';

type StateContextType = {
    state: Storage,
    dispatch: Dispatch,
};
const StateContext = createContext<StateContextType>({state: initialState, dispatch: (() => null) as Dispatch});

type StorageProviderProps = {
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const StorageProvider: FC<StorageProviderProps> = ({children}) => {
    const [state, dispatchBase] = useReducer(mainReducer, initialState);
    const dispatch = useCallback(
        action => typeof action === 'function' ? action(dispatch, state) : dispatchBase(action),
        [dispatchBase],
    );

    const initialRequest = {
        grouping: state.transits.grouping,
        order: state.transits.ordering,
    };
    useEffect(() => {
        dispatch(getDomainAreasAction({}));
        dispatch(getPrioritiesAction({}));
        dispatch(getTodosAction(initialRequest));
    }, []);

    return <StateContext.Provider value={{state, dispatch}}>{children}</StateContext.Provider>;
}

export const useStore = (): StateContextType => useContext(StateContext);
