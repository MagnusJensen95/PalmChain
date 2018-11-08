import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory } from 'history';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import {
  Provider
} from 'react-redux';
import rootReducer from './store/configureStore'
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';



let composeEnhancers = compose;
const history = createBrowserHistory();


// const store = createStore(,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const configureStore = () => {
  return createStore(connectRouter(history)(rootReducer), composeEnhancers(applyMiddleware(thunk)));
};

const store = configureStore();


const appTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#00695c',
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: '#81c784',
      contrastText: "#FFFFFF"
    },
  },

});

const AppContent = (
  <MuiThemeProvider theme={appTheme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>
)



ReactDOM.render(AppContent, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();