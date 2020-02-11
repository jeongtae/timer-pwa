import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "Routes/Home";
import Timer from "Routes/Timer";

function App() {
  return (
    <Router basename="webapps">
      <Switch>
        <Route exact={true} path={"/"} component={Home} />
        <Route path={"/timer"} component={Timer} />
      </Switch>
    </Router>
  );
}

export default App;
