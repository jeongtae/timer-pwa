import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "Routes/Home";

function App() {
  return (
    <Router basename="webapps">
      <Switch>
        <Route exact={true} path={"/"} component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
