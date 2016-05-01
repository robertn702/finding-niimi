// import createBrowserHistory from 'history/lib/createBrowserHistory';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {Router, Route, Redirect, browserHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';

import App from './app';
import reducers from './reducers';

const store = createStore(
  reducers,
  applyMiddleware(thunk, routerMiddleware(browserHistory))
);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        {/* ROUTES GO HERE */}
      </Route>
    </Router>
  </Provider>
, document.getElementById('root'));
