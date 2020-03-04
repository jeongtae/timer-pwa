import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export default createGlobalStyle`
  ${reset};
  html,
  body,
  #root {
    position: fixed;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
    font-family: ${({ theme }) => theme.font};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    *::selection {
      background-color: transparent;
    }
  }
`;
