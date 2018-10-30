import React, {
  Component
} from 'react';
import { Route, Switch } from "react-router";


import './App.css';

const Home = () => {
  return (<div>Home</div>)
}


const About = () => {
  return (<div>About</div>)
}
const Contact = () => {
  return (<div>Contact</div>)
}

class App extends Component {
  render() {
    return (

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />

      </Switch>

    )
  }
}

export default App;