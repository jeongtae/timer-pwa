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
  font-family: Quicksand;
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

export const PickerColon = styled.div`
  &::after {
    content: ":";
  }
`;

export const Picker = styled(picker)`
  width: 70px;
  height: 200px;
`;

export const Timer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Quicksand;
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

const button = {
  start: { color: "#2d2", icon: "\\f04b" },
  stop: { color: "#f90", icon: "\\f04c" },
  reset: { color: "#ccc", icon: "\\f00d" },
  minus: { color: "#d22", icon: "\\f068" },
  plus: { color: "#09f", icon: "\\f067" }
};
export const Button = styled.button`
  all: unset;
  width: 72px;
  height: 72px;
  position: relative;
  font-family: "Font Awesome Solid";
  font-size: 50px;
  text-align: center;
  line-height: 72px;
  -webkit-text-fill-color: ${({ styled: s }) => button[s].color};
  transition: color 60ms linear;
  &::before {
    content: "${({ styled: s }) => button[s].icon}";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    -webkit-text-stroke: 10px black;
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
    -webkit-text-fill-color: #444;
  }
  @media (hover) {
    &:hover {
      -webkit-text-fill-color: ${({ styled: s }) => lighten(0.25, button[s].color)};
    }
  }
  &:active {
    -webkit-text-fill-color: ${({ styled: s }) => darken(0.2, button[s].color)};
  }
`;
Button.defaultProps = {
  styled: "reset"
};
