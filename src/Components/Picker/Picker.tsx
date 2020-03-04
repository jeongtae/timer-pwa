import React, { useRef, useMemo } from "react";
import { useLifecycles } from "react-use";
import { PickerProps, PickerOnChangeEventHandler, PickerItemValue } from "./Types";
import "./Picker.css";

function createWorker(
  rootRef: React.RefObject<HTMLElement>,
  contentRef: React.RefObject<HTMLElement>,
  values: PickerItemValue[],
  onChange?: PickerOnChangeEventHandler
) {
  let currentAbsPixelPos: number = 0;
  let records: { time: number; absPixelPos: number }[] = [];
  let animationHandle: number = 0;

  function getWidthHeight(elem: HTMLElement) {
    const { width, height } = elem.getBoundingClientRect();
    return [width, height];
  }

  function getItemRect() {
    const content = contentRef.current as HTMLElement;
    const item = content.children[0] as HTMLElement;
    return getWidthHeight(item);
  }

  function getMinMaxPixelPos() {
    const root = rootRef.current as HTMLElement;
    const content = contentRef.current as HTMLElement;
    const [, rootHeight] = getWidthHeight(root);
    const [, contentHeight] = getWidthHeight(content);
    const [, itemHeight] = getItemRect();

    const min = -rootHeight / 2 + itemHeight / 2;
    const max = min + contentHeight - itemHeight;

    return [min, max];
  }

  function getCurrentIndex() {
    const [min, max] = getMinMaxPixelPos();
    const itemsCount = values.length;
    return ((currentAbsPixelPos - min) / (max - min)) * itemsCount;
  }

  function scrollToPixel(absPixelPos: number, calculateVelocity: boolean = true) {
    let absPixelPosToShow: number;
    const [min, max] = getMinMaxPixelPos();
    if (absPixelPos < min) {
      absPixelPosToShow = min - (min - absPixelPos) / 2;
    } else if (absPixelPos > max) {
      absPixelPosToShow = max + (absPixelPos - max) / 2;
    } else {
      absPixelPosToShow = absPixelPos;
    }
    absPixelPosToShow *= -1;

    const style = contentRef.current?.style as CSSStyleDeclaration;
    style.transform = `translate3d(0,${absPixelPosToShow}px,0)`;

    if (calculateVelocity) {
      records.push({ time: Date.now(), absPixelPos });
    }

    currentAbsPixelPos = absPixelPos;
  }

  function scrollByPixel(pixels: number, calculateVelocity: boolean = true) {
    scrollToPixel(currentAbsPixelPos + pixels, calculateVelocity);
  }

  function scrollToIndex(index: number) {
    const [min] = getMinMaxPixelPos();
    const [, itemHeight] = getItemRect();
    scrollToPixel(min + index * itemHeight);
  }

  function scrollToValue(value: PickerItemValue) {
    scrollToIndex(values.indexOf(value));
  }

  function startAnimation() {
    // calculate the scrolling velocity
    let velocity: number = 0;
    if (records.length >= 2) {
      let lastRecord = records[records.length - 1];
      lastRecord = { ...lastRecord, time: Date.now() };
      records.push(lastRecord);
      for (let i = records.length - 2; i >= 0; i--) {
        const currentRecord = records[i];
        const timeDiff = lastRecord.time - currentRecord.time;
        const pixelDiff = lastRecord.absPixelPos - currentRecord.absPixelPos;
        if (timeDiff < 30) {
          continue;
        } else if (timeDiff > 100) {
          break;
        } else {
          velocity = pixelDiff / timeDiff;
          break;
        }
      }
    }
    records = [];

    // animate
    let lastTime = performance.now();
    animationHandle = window.requestAnimationFrame(function frameCallback(time: number) {
      // get timespan
      const timespan = time - lastTime;
      lastTime = time;

      // process exceeding the scroll limit
      const [min, max] = getMinMaxPixelPos();
      const exceedingMin = Math.max(min - currentAbsPixelPos, 0);
      const exceedingMax = Math.max(currentAbsPixelPos - max, 0);
      const exceeding = Math.max(exceedingMin, exceedingMax);
      if (!!exceeding) {
        const isGoingOut = !!exceedingMin ? velocity < 0 : velocity > 0;
        if (isGoingOut) {
          const d = 0.05;
          velocity += (!!exceedingMin ? d : -d) * timespan; // decelerate strongly
        } else {
          const v = 0.5 * (exceeding / 100);
          velocity = !!exceedingMin ? v : -v;
        }
      }

      // slowdown by predefined deceleration
      else if (Math.abs(velocity) > getItemRect()[1] * 0.005) {
        // decelerate velocity
        const deceleration = 0.001 * timespan;
        if (velocity > 0) {
          velocity = Math.max(velocity - deceleration, 0);
        } else {
          velocity = Math.min(velocity + deceleration, 0);
        }
      }

      // slowdown to stop exact index position
      else {
        // correct right position
        const index = Math.round(getCurrentIndex());
        scrollToIndex(index);
        // scroll is stopped
        const value = values[index];
        if (onChange) {
          onChange(value);
        }
        return;
      }

      // scroll as current velocity
      scrollByPixel(velocity * timespan, false);

      // reserve next frame
      animationHandle = window.requestAnimationFrame(frameCallback);
    });
  }

  function killAnimation() {
    window.cancelAnimationFrame(animationHandle);
  }

  return {
    scrollByPixel,
    scrollToIndex,
    scrollToValue,
    startAnimation,
    killAnimation
  };
}

function Picker({ children, selected, onChange, className }: PickerProps) {
  // div references
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Create worker (with memoization for better performance)
  const values = React.Children.toArray(children).map(
    (child: any) => child.props.value as PickerItemValue
  );
  const Worker = useMemo(() => createWorker(rootRef, contentRef, values, onChange), []);

  const EventHandlers = (() => {
    let lastY: number;
    return {
      start(y: number) {
        Worker.killAnimation();
        lastY = y;
        // Velocity.reset();
        // Scroll.killMotion();
      },
      move(y: number): boolean {
        Worker.scrollByPixel(-(y - lastY));
        lastY = y;
        // Velocity.record(y);
        return true;
      },
      end() {
        Worker.startAnimation();
        // const v = Velocity.get();
        // Scroll.startMotion(v);
      }
    };
  })();

  const Listeners = {
    touchstart(e: React.TouchEvent<HTMLDivElement>) {
      const { pageY: y } = e.touches[0];
      EventHandlers.start(y);
    },
    touchmove(e: React.TouchEvent<HTMLDivElement>) {
      const { pageY: y } = e.touches[0];
      if (EventHandlers.move(y)) {
        e.preventDefault();
      }
    },
    touchend() {
      EventHandlers.end();
    },
    touchcancel() {
      EventHandlers.end();
    }
  };

  // Register the side effects
  useLifecycles(
    // on mount
    () => {
      // register events
      const root = rootRef.current as HTMLDivElement;
      for (const [name, listener] of Object.entries(Listeners)) {
        // the `passive` option must be `false` when calling `preventDefault` inside of the event.
        const hasPreventDefault = name.indexOf("move") >= 0;
        const option: AddEventListenerOptions = { passive: !hasPreventDefault };
        root.addEventListener(name, listener as any, option);
      }
      // scroll to initial position
      if (selected !== undefined) {
        Worker.scrollToValue(selected);
      } else {
        Worker.scrollToIndex(0);
      }
    },
    // on unmount
    () => {
      const root = rootRef.current as HTMLDivElement;
      Worker.killAnimation();
      for (const [name, listener] of Object.entries(Listeners)) {
        root.removeEventListener(name, listener as any);
      }
    }
  );

  // Render the elements
  return (
    <div // Root div
      ref={rootRef}
      className={["picker-root", className].join(" ")}
    >
      <div // Content div
        ref={contentRef}
        className="picker-content"
      >
        {children}
      </div>
    </div>
  );
}

export default Picker;
