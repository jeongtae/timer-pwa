import styled, { keyframes, css } from "styled-components";
import { lighten, darken, rgba } from "polished";
import picker from "Components/Picker";

const mediaIsLandscape = "screen and (orientation: landscape) and (max-height: 600px)";

const Button = styled.button`
  all: unset;
  -webkit-tap-highlight-color: transparent;
`;

export const ProgressBackground = styled.div.attrs(({ style, value }) => ({
  style: { ...style, opacity: value }
}))`
  width: 100%;
  height: 100%;
  position: fixed;
  background: ${({ theme }) => theme.foreground};
  transform-origin: left bottom;
  opacity: 0;
  ${({ disabled }) =>
    !disabled &&
    css`
      transition: opacity 0.9s linear;
    `}
`;
ProgressBackground.defaultProps = {
  value: 1.0,
  disabled: false
};

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-content: stretch;
  padding-left: env(safe-area-inset-left);
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
`;

export const UpperDivision = styled.div`
  flex: 2 200px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: stretch;
`;

export const RecentsBar = styled.div`
  height: 5rem;
  display: flex;
  justify-content: space-evenly;
  align-content: flex-start;
  flex-wrap: wrap;
  @media ${mediaIsLandscape} {
    display: none;
  }
`;

export const RecentsBarItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem;
  margin-bottom: 0;
  color: #bbb;
  background: #444;
  border-radius: 5px;
  @media (hover) {
    &:hover {
      background: ${lighten(0.1, "#444")};
    }
  }
  &:active {
    background: ${darken(0.1, "#444")};
  }
`;

export const RecentsBarItemTimeButton = styled(Button)`
  padding: 0.4rem;
  padding-left: 0.6rem;
  padding-right: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Quicksand Bold";
  font-size: 1.125rem;
  @media (hover) {
    &:hover {
      color: #fff;
    }
  }
`;

export const RecentsBarItemDeleteButton = styled(Button)`
  height: 100%;
  padding-left: 0.2rem;
  padding-right: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: "\f00d";
    font-family: "Font Awesome Solid";
    font-size: 0.9rem;
  }
  @media (hover) {
    &:hover {
      color: #f77;
    }
  }
`;

export const Timer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Courier Prime";
  font-size: ${({ digitsCount, colonsCount, hasMinus }) =>
    85 / (digitsCount * 0.5 + colonsCount * 0.3 + (hasMinus && 0.5))}vw;
`;

const TimerContentBase = styled.div`
  width: 0.5em;
  height: 0;
  position: relative;
  line-height: 0;
  &::before {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    -webkit-text-stroke: 15px ${({ theme }) => theme.background};
  }
  &::after {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    z-index: 2;
  }
`;

export const TimerDigit = styled(TimerContentBase)`
  width: 0.5em;
  &::before {
    content: "${({ digit }) => digit}";
  }
  &::after {
    content: "${({ digit }) => digit}";
  }
`;

export const TimerColon = styled(TimerContentBase)`
  width: 0.3em;
  position: relative;
  top: -0.05em;
  &::before {
    content: ":";
  }
  &::after {
    content: ":";
  }
`;

export const TimerMinus = styled(TimerContentBase)`
  width: 0.5em;
  &::before {
    content: "-";
  }
  &::after {
    content: "-";
  }
`;

export const LowerDivision = styled.div`
  flex: 1 auto;
  display: grid;
  grid-template: 70px 70px / 1fr 1fr;
  padding: 0 10vw;
  place-items: center center;
  @media ${mediaIsLandscape} {
    grid-template: 70px / 1fr 1fr 1fr 1fr;
    & > *:nth-child(1) {
      order: 2;
    }
    & > *:nth-child(2) {
      order: 3;
    }
    & > *:nth-child(3) {
      order: 1;
    }
    & > *:nth-child(4) {
      order: 4;
    }
  }
  @media not ${mediaIsLandscape} {
    & > *:nth-child(odd) {
      justify-self: start;
    }
    & > *:nth-child(even) {
      justify-self: end;
    }
  }
`;

const button = {
  start: { color: "green", icon: "\\f04b" },
  stop: { color: "orange", icon: "\\f04c" },
  reset: { color: "gray", icon: "\\f00d" },
  minus: { color: "red", icon: "\\f068" },
  plus: { color: "blue", icon: "\\f067" }
};
export const ControlButton = styled(Button)`
  width: 72px;
  height: 72px;
  position: relative;
  font-family: "Font Awesome Solid";
  font-size: 50px;
  text-align: center;
  line-height: 72px;
  -webkit-text-fill-color: ${({ theme, styled: s }) => theme[button[s].color]};
  transition: color 60ms linear;
  &::before {
    content: "${({ styled: s }) => button[s].icon}";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    -webkit-text-stroke: 15px ${({ theme }) => theme.background};
  }
  &::after {
    content: "${({ styled: s }) => button[s].icon}";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
  &:disabled {
    -webkit-text-fill-color: ${({ theme }) => theme.disabled}
  }
  @media (hover) {
    &:hover {
      -webkit-text-fill-color: ${({ theme, styled: s }) => lighten(0.25, theme[button[s].color])};
    }
  }
  &:active {
    -webkit-text-fill-color: ${({ theme, styled: s }) => darken(0.2, theme[button[s].color])};
  }
`;
ControlButton.defaultProps = {
  styled: "reset"
};
