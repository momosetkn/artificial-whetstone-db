import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { MainPage } from "./MainPage";
import './index.css';
import 'normalize.css/normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

const ROUTER_BASENAME = window.location.pathname.match(/^(\/[^/]+)/)?.[1] || "/";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Switch>
        <Route exact path="/">
          <MainPage/>
        </Route>
        <Route>
          not found
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
