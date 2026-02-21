import { applyMiddleware, compose, legacy_createStore as createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

const middleware = [thunk];

if (import.meta.env.DEV) {
  middleware.push(createLogger({ collapsed: true }));
}

const devToolsCompose =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null;

const enhancer = (devToolsCompose || compose)(applyMiddleware(...middleware));

const store = createStore(rootReducer, enhancer);

export default store;
