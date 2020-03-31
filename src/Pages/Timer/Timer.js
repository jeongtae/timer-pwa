import React from "react";
import * as S from "./Timer.style";
import { useTimerContext } from "Contexts";
import { TimePicker } from "Components";
import { Time } from "Utils";

export default function() {
  const {
    states: { state, elapsed, left, total, addedLeft, recents },
    actions: {
      setTimer,
      setTimerHours,
      setTimerMinutes,
      setTimerSeconds,
      pauseTimer,
      startTimer,
      resetTimer,
      addLeft,
      deleteRecent
    }
  } = useTimerContext();

  const leftIsNegative = left < 0;
  const leftHours = Time.getHours(Math.abs(left));
  const leftMinutes = Time.getMinutes(Math.abs(left));
  const leftSeconds = Time.getSeconds(Math.abs(left));

  const currentProgress = Math.min(1.0, elapsed / (total + addedLeft));
  const nextProgress = Math.min(1.0, (elapsed + 1) / (total + addedLeft));

  return (
    <>
      {state !== "stop" &&
        (state !== "done" ? (
          <S.ProgressBackground from={currentProgress} to={nextProgress} duration={"1s"} />
        ) : (
          <S.ProgressBackground from={1} to={0.25} duration={"1s"} noscale infinity />
        ))}
      <S.Container>
        <S.UpperDivision>
          {state === "stop" ? (
            <>
              <S.FadingInDiv>
                <TimePicker
                  selectedHours={Time.getHours(total)}
                  selectedMinutes={Time.getMinutes(total)}
                  selectedSeconds={Time.getSeconds(total)}
                  onChangeHours={setTimerHours}
                  onChangeMinutes={setTimerMinutes}
                  onChangeSeconds={setTimerSeconds}
                />
              </S.FadingInDiv>
              <S.FadingInDiv>
                <S.RecentsBar>
                  {recents.map((recent, index) => (
                    <S.RecentsBarItem key={index}>
                      <S.RecentsBarItemTimeButton onClick={() => setTimer(recent)}>
                        {Time.format(recent)}
                      </S.RecentsBarItemTimeButton>
                      <S.RecentsBarItemDeleteButton onClick={() => deleteRecent(recent)} />
                    </S.RecentsBarItem>
                  ))}
                </S.RecentsBar>
              </S.FadingInDiv>
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
