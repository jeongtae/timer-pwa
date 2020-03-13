import styled, { keyframes, css } from "styled-components";
import { lighten, darken, rgba } from "polished";
import picker from "Components/Picker";

const mediaIsLandscape = "screen and (orientation: landscape) and (max-height: 600px)";

const blinkKeyframe = keyframes`
  from {
    background: white;
    color: black;
  }
  50% {
    background: unset;
    color: unset;
  }
  90% {
    background: unset;
    color: unset;
  }
  to {
    background: white;
    color: black;
  }
`;
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
  ${({ blink }) =>
    blink &&
    css`
      animation: ${blinkKeyframe} 1s ease 0s infinite normal;
    `}
`;

export const UpperDivision = styled.div`
  flex: 2 200px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-content: stretch;
`;

export const Pickers = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    /* Gradients */
    content: "";
    width: 100%;
    height: 200px;
    position: absolute;
    background-image: linear-gradient(
        to bottom,
        ${({ theme }) => rgba(theme.background, 1)},
        ${({ theme }) => rgba(theme.background, 0.3)}
      ),
      linear-gradient(
        to top,
        ${({ theme }) => rgba(theme.background, 1)},
        ${({ theme }) => rgba(theme.background, 0.3)}
      );
    background-position: top, bottom;
    background-size: 100% calc(100px - 1.25em);
    background-repeat: no-repeat;
    pointer-events: none;
    z-index: 2;
  }
  &::after {
    /* Indicator */
    content: "";
    width: 210px;
    height: 2.5em;
    position: absolute;
    box-sizing: border-box;
    border: solid 1.5px ${({ theme }) => theme.foreground};
    border-radius: 8px;
    pointer-events: none;
    z-index: 1;
  }
  animation: ${keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `} 200ms ease 0s 1;
`;

export const Picker = styled(picker)`
  width: 70px;
  height: 200px;
`;

export const Timer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ small }) => (small ? 24 : 30)}vw;
  font-weight: lighter;
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

const buttonColors = {
  default: "#777",
  start: "#2a2",
  stop: "#c80"
};
const buttonBorderSize = 4;
const buttonBorderRadius = 12;
export const Button = styled.button`
  all: unset;
  width: ${90 - buttonBorderSize * 2}px;
  height: ${60 - buttonBorderSize * 2}px;
  margin: ${buttonBorderSize * 2}px;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 30px;
  border: none;
  border-radius: ${buttonBorderRadius - buttonBorderSize}px;
  background-color: ${({ appearance }) => buttonColors[appearance] || buttonColors.default};
  transition: background-color 120ms ease, border-color 120ms ease;
  color: ${({ appearance }) => lighten(0.3, buttonColors[appearance] || buttonColors.default)};
  &::before {
    /* Border */
    content: "";
    box-sizing: border-box;
    width: calc(100% + ${buttonBorderSize * 2}px);
    height: calc(100% + ${buttonBorderSize * 2}px);
    position: absolute;
    top: -${buttonBorderSize}px;
    left: -${buttonBorderSize}px;
    border-radius: ${buttonBorderRadius}px;
    border: 2px solid ${({ appearance }) => buttonColors[appearance] || buttonColors.default};
    z-index: 1;
  }
  &:active {
    background-color: ${({ appearance }) =>
      darken(0.15, buttonColors[appearance] || buttonColors.default)};
    color: ${({ appearance }) => darken(0.05, buttonColors[appearance] || buttonColors.default)};
    &::before {
      border-color: ${({ appearance }) =>
        darken(0.15, buttonColors[appearance] || buttonColors.default)};
    }
  }
  &:disabled {
    background-color: #333;
    color: #777;
    &::before {
      border-color: #333;
    }
  }
`;
Button.defaultProps = {
  appearance: "default"
};
