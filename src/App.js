import React, {
  Component
} from 'react';
import { Route, Switch } from "react-router";


import './App.css';
import RSPO from './pages/RSPO/RSPO';


class App extends Component {


  render() {
    return (

      <Switch>
        <Route exact path="/" component={RSPO} />
        <Route path="/about" component={RSPO} />
        <Route path="/contact" component={RSPO} />

      </Switch>

    )
  }
}

export default App;