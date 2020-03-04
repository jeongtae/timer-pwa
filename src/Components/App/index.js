import React from "react";
import { TimerProvider } from "Contexts";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "Theme";
import GlobalStyleInjection from "./global.style";
import { Timer } from "Routes";

const MultiProvider = ({ providers = [], children }) => {
  const reducer = (previous, provider) => React.createElement(provider, { children: previous });
  const reduced = providers.reduce(reducer, children);
  return reduced;
};

export default function App() {
  return (
    <MultiProvider
      providers={[
        TimerProvider,
        ({ children }) => <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
      ]}
    >
      <GlobalStyleInjection />
      <Timer />
    </MultiProvider>
  );
}
