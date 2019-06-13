import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { render } from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import reducer from './reducers';
import App from './components/layouts/App';
import Widget from './components/layouts/Widget';
import rootSaga from './sagas';
import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();

let middleware = [sagaMiddleware];
if (process.env.REACT_APP_ENV === 'local') {
  middleware = [...middleware, logger]
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware),
);

sagaMiddleware.run(rootSaga);

const routing = (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/widget" component={Widget} />
      </div>
    </Router>
  </Provider>
);

render(routing, document.getElementById('root'));

serviceWorker.unregister();
