import { createStore,
         applyMiddleware,
         compose,GenericStoreEnhancer } from 'redux';
import { rootReducer } from './rootReducers';
import { IAppState } from './IAppState';

declare var window:any;
/**
 * is the window has devtoolExtensions then add those as middleware to Redux 
 */
const devToolExtension:GenericStoreEnhancer = (window.__REDUX_DEVTOOLS_EXTENSION__) ? window.__REDUX_DEVTOOLS_EXTENSION__():(f)=>f;

/**
 * Create Redux store with arg1 = rootReducer, arg2=devtools 
 */
export const store = createStore<IAppState>(rootReducer,compose(devToolExtension) as GenericStoreEnhancer)