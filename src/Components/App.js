import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "Routes/Home";
import Timer from "Routes/Timer";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact={true} path={"/"} component={Home} />
        <Route path={"/timer"} component={Timer} />
      </Switch>
    </Router>
  );
}
