import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import Picker, { PickerItem } from "Components/Picker";
import { Time } from "Utils";

const Pickers = styled.div`
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
`;

const MemoPicker = React.memo(
  styled(Picker)`
    width: 70px;
    height: 200px;
  `,
  ({ selectedValue: prev }, { selectedValue: next }) => prev === next
);

export const PickerColon = styled.span`
  position: relative;
  top: -0.05em;
  &::after {
    content: ":";
  }
`;

function* iterateWithRange(startWith: number, count: number) {
  for (let i = startWith; i < startWith + count; i++) {
    yield i;
  }
}
const zeroTo59 = Array.from(iterateWithRange(0, 59));
const zeroTo23 = zeroTo59.slice(0, 24);

export interface TimePickerProps {
  selectedHours: number;
  selectedMinutes: number;
  selectedSeconds: number;
  onChangeHours: (hours: number) => void;
  onChangeMinutes: (minutes: number) => void;
  onChangeSeconds: (seconds: number) => void;
}
export default function TimePicker({
  selectedHours,
  selectedMinutes,
  selectedSeconds,
  onChangeHours,
  onChangeMinutes,
  onChangeSeconds
}: TimePickerProps) {
  return (
    <Pickers>
      <MemoPicker
        selectedValue={selectedHours}
        onChangeValue={(hours: number) => onChangeHours(hours)}
      >
        {zeroTo23.map((v, i) => (
          <PickerItem value={v} key={i}>
            {v}
          </PickerItem>
        ))}
      </MemoPicker>
      <PickerColon />
      <MemoPicker
        selectedValue={selectedMinutes}
        onChangeValue={(minutes: number) => onChangeMinutes(minutes)}
      >
        {zeroTo59.map((v, i) => (
          <PickerItem value={v} key={i}>
            {v}
          </PickerItem>
        ))}
      </MemoPicker>
      <PickerColon />
      <MemoPicker
        selectedValue={selectedSeconds}
        onChangeValue={(seconds: number) => onChangeSeconds(seconds)}
      >
        {zeroTo59.map((v, i) => (
          <PickerItem value={v} key={i}>
            {v}
          </PickerItem>
        ))}
      </MemoPicker>
    </Pickers>
  );
}
