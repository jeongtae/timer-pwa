import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Home, Timer } from "Routes";
import { TimerProvider } from "Contexts";

const MultiProvider = ({ providers = [], children }) => {
  const reducer = (previous, provider) => React.createElement(provider, { children: previous });
  const reduced = providers.reduce(reducer, children);
  return reduced;
};

export default function App() {
  return (
    <MultiProvider providers={[TimerProvider]}>
      <Router>
        <Switch>
          <Route exact={true} path={"/"} component={Home} />
          <Route path={"/timer"} component={Timer} />
        </Switch>
      </Router>
    </MultiProvider>
  );
}
