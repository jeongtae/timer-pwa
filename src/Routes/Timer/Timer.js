import React from "react";
import * as S from "./Timer.style";
import { useTimerContext } from "Contexts";
import { PickerItem } from "Components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const getHours = totalSeconds => Math.floor(totalSeconds / 3600);
const getMinutes = totalSeconds => Math.floor(totalSeconds / 60) % 60;
const getSeconds = totalSeconds => totalSeconds % 60;

const format = totalSeconds => {
  const isNegative = totalSeconds < 0;
  if (isNegative) {
    totalSeconds = -totalSeconds;
  }
  const [h, m, s] = [
    getHours(totalSeconds),
    getMinutes(totalSeconds),
    getSeconds(totalSeconds)
  ].map(num => num.toString());
  let result = `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
  if (h === "0") {
    result = result.slice(3);
  }
  if (isNegative) {
    result = "-" + result;
  }
  return result;
};

const MemoPicker = React.memo(
  S.Picker,
  ({ selectedValue: prev }, { selectedValue: next }) => prev === next
);

const zeroTo59 = [...Array(60).keys()];
const zeroTo23 = zeroTo59.slice(0, 24);

export default function() {
  const {
    states: { state, left, total, progress },
    actions: { setTimer, pauseTimer, startTimer, resetTimer }
  } = useTimerContext();

  return (
    <S.Container>
      <S.UpperDivision>
        {state === "stop" ? (
          <S.Pickers>
            <MemoPicker
              selectedValue={getHours(total)}
              onChangeValue={hours =>
                setTimer(hours * 3600 + getMinutes(total) * 60 + getSeconds(total))
              }
            >
              {zeroTo23.map((v, i) => (
                <PickerItem value={v} key={i}>
                  {v}
                </PickerItem>
              ))}
            </MemoPicker>
            :
            <MemoPicker
              selectedValue={getMinutes(total)}
              onChangeValue={minutes =>
                setTimer(getHours(total) * 3600 + minutes * 60 + getSeconds(total))
              }
            >
              {zeroTo59.map((v, i) => (
                <PickerItem value={v} key={i}>
                  {v}
                </PickerItem>
              ))}
            </MemoPicker>
            :
            <MemoPicker
              selectedValue={getSeconds(total)}
              onChangeValue={seconds =>
                setTimer(getHours(total) * 3600 + getMinutes(total) * 60 + seconds)
              }
            >
              {zeroTo59.map((v, i) => (
                <PickerItem value={v} key={i}>
                  {v}
                </PickerItem>
              ))}
            </MemoPicker>
          </S.Pickers>
        ) : (
          <S.Timer small={left >= 3600}>{format(left)}</S.Timer>
        )}
      </S.UpperDivision>
      <S.LowerDivision>
        <S.ControlButton disabled={state === "stop"} onClick={resetTimer}>
          <FontAwesomeIcon icon={faTimes} />
        </S.ControlButton>
        <S.ControlButton
          appearance={state !== "running" ? "start" : "stop"}
          onClick={state !== "running" ? startTimer : pauseTimer}
        >
          {state !== "running" ? (
            <FontAwesomeIcon icon={faPlay} />
          ) : (
            <FontAwesomeIcon icon={faPause} />
          )}
        </S.ControlButton>
      </S.LowerDivision>
    </S.Container>
  );
}
