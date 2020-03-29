import React, { useRef } from "react";
import * as S from "./Timer.style";
import { useTimerContext } from "Contexts";
import { PickerItem } from "Components";

const getHours = totalSeconds => Math.floor(totalSeconds / 3600);
const getMinutes = totalSeconds => Math.floor(totalSeconds / 60) % 60;
const getSeconds = totalSeconds => totalSeconds % 60;

const MemoPicker = React.memo(
  S.Picker,
  ({ selectedValue: prev }, { selectedValue: next }) => prev === next
);

const zeroTo59 = [...Array(60).keys()];
const zeroTo23 = zeroTo59.slice(0, 24);

export default function() {
  const {
    states: { state, elapsed, left, total, addedLeft },
    actions: {
      setTimerHours,
      setTimerMinutes,
      setTimerSeconds,
      pauseTimer,
      startTimer,
      resetTimer,
      addLeft
    }
  } = useTimerContext();
  const pickersRef = useRef();

  const leftIsNegative = left < 0;
  const leftHours = getHours(Math.abs(left));
  const leftMinutes = getMinutes(Math.abs(left));
  const leftSeconds = getSeconds(Math.abs(left));

  const currentProgress = Math.min(1.0, elapsed / (total + addedLeft));
  const nextProgress = Math.min(1.0, (elapsed + 1) / (total + addedLeft));

  return (
    <>
      <S.ProgressBackground
        value={state === "pause" ? currentProgress : nextProgress}
        disabled={state === "stop"}
      />
      <S.Container blink={state === "done"}>
        <S.UpperDivision>
          {state === "stop" ? (
            <>
              <S.Pickers ref={pickersRef}>
                <MemoPicker selectedValue={getHours(total)} onChangeValue={setTimerHours}>
                  {zeroTo23.map((v, i) => (
                    <PickerItem value={v} key={i}>
                      {v}
                    </PickerItem>
                  ))}
                </MemoPicker>
                <S.PickerColon />
                <MemoPicker selectedValue={getMinutes(total)} onChangeValue={setTimerMinutes}>
                  {zeroTo59.map((v, i) => (
                    <PickerItem value={v} key={i}>
                      {v}
                    </PickerItem>
                  ))}
                </MemoPicker>
                <S.PickerColon />
                <MemoPicker selectedValue={getSeconds(total)} onChangeValue={setTimerSeconds}>
                  {zeroTo59.map((v, i) => (
                    <PickerItem value={v} key={i}>
                      {v}
                    </PickerItem>
                  ))}
                </MemoPicker>
              </S.Pickers>
              <S.ToolBar>
                <S.ToolBarItem>
                  <S.ToolBarItemTimeButton>1:23:45</S.ToolBarItemTimeButton>
                  <S.ToolBarItemDeleteButton />
                </S.ToolBarItem>
                <S.ToolBarItem>
                  <S.ToolBarItemTimeButton>10:34</S.ToolBarItemTimeButton>
                  <S.ToolBarItemDeleteButton />
                </S.ToolBarItem>
                <S.ToolBarItem>
                  <S.ToolBarItemTimeButton>00:12</S.ToolBarItemTimeButton>
                  <S.ToolBarItemDeleteButton />
                </S.ToolBarItem>
                <S.ToolBarItem>
                  <S.ToolBarItemTimeButton>21:08:12</S.ToolBarItemTimeButton>
                  <S.ToolBarItemDeleteButton />
                </S.ToolBarItem>
              </S.ToolBar>
            </>
          ) : (
            <S.Timer
              digitsCount={4 + (leftHours > 0 && leftHours.toString().length)}
              colonsCount={leftHours > 0 ? 2 : 1}
              hasMinus={leftIsNegative}
            >
              {leftIsNegative && <S.TimerMinus />}
              {leftHours > 0 && (
                <>
                  {leftHours
                    .toString()
                    .split("")
                    .map((digit, idx) => (
                      <S.TimerDigit key={idx} digit={digit}></S.TimerDigit>
                    ))}
                  <S.TimerColon />
                </>
              )}
              <S.TimerDigit digit={Math.floor(leftMinutes / 10)} />
              <S.TimerDigit digit={leftMinutes % 10} />
              <S.TimerColon />
              <S.TimerDigit digit={Math.floor(leftSeconds / 10)} />
              <S.TimerDigit digit={leftSeconds % 10} />
            </S.Timer>
          )}
        </S.UpperDivision>
        <S.LowerDivision>
          {state === "running" ? (
            <>
              <S.ControlButton styled="minus" onClick={() => addLeft(-10)} />
              <S.ControlButton styled="plus" onClick={() => addLeft(+10)} />
            </>
          ) : (
            <>
              <div />
              <div />
            </>
          )}
          <S.ControlButton disabled={state === "stop"} styled="reset" onClick={resetTimer} />
          <S.ControlButton
            disabled={total === 0}
            styled={state !== "running" ? "start" : "stop"}
            onClick={state !== "running" ? startTimer : pauseTimer}
          />
        </S.LowerDivision>
      </S.Container>
    </>
  );
}
