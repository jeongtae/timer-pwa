import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Home, Timer } from "Routes";
import { TimerProvider } from "Contexts";

export default function App() {
  return (
    <TimerProvider>
      <Router>
        <Switch>
          <Route exact={true} path={"/"} component={Home} />
          <Route path={"/timer"} component={Timer} />
        </Switch>
      </Router>
    </TimerProvider>
  );
}
