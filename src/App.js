import React, { Component } from "react";
import { Route, Switch } from "react-router";
import Login from "./pages/Login";

import "./App.css";
import RSPO from "./pages/RSPO/RSPO";

import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview/Overview";
import Plantation from "./pages/Plantation/Plantation";
import Mill from "./pages/Mill/Mill";

class App extends Component {
  render() {
    return (
      <div className="appContainer">
        <Sidebar />
        <div className="rightContainer">
          <div className="appContent">
            <Switch>
              <Route exact path="/" component={Overview} />
              <Route path="/RSPO" component={RSPO} />
              <Route path="/Plantation" component={Plantation} />
              <Route path="/Mill" component={Mill} />
              <Route path="/login" component={Login} />
              <Route path="/login/select" component={RSPO} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
