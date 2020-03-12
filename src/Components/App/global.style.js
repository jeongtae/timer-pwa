import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
//
export default createGlobalStyle`
  ${reset};
  html {
    /* position: relative; */
    /* top: env(safe-area-inset-top); */
    /* height: 100%; */
    height: calc(100% + env(safe-area-inset-top));
    background: black;
  }
  body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  #root{
    width: 100%;
    position: fixed;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
    font-family: ${({ theme }) => theme.font};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* touch-action: none; */
    *::selection {
      background-color: transparent;
    }
  }
`;
