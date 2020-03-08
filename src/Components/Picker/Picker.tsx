import React, { useRef, useEffect } from "react";
import { PickerProps, PickerItemValue } from "./Types";
import "./Picker.css";

function Picker({ children, selectedValue, onChangeValue, className }: PickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("EFFECT START");
    const root = rootRef.current as HTMLDivElement;
    const content = contentRef.current as HTMLDivElement;
    const rootRect = root.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    // Items closures
    const Items = (function IIFE() {
      const values = React.Children.map(children, ({ props }) => props.value);
      const count = values.length;
      const totalHeight = contentRect.height;
      const height = totalHeight / count;
      const initialIndex = selectedValue !== undefined ? values.indexOf(selectedValue) : 0;
      return {
        valueOfIndex(index: number) {
          return values[index];
        },
        indexOfValue(value: PickerItemValue) {
          return values.indexOf(value);
        },
        getCount() {
          return count;
        },
        getOnesHeight() {
          return height;
        },
        getTotalHeight() {
          return totalHeight;
        },
        getInitialIndex() {
          return initialIndex;
        }
      };
    })();

    // Momentum-based Scroll closures
    const MomentumScroll = (function IIFE() {
      let rafHandle = 0;
      return {
        start(velocity: number) {
          rafHandle = window.requestAnimationFrame(function loop() {
            // TODO do something here
            if (true) {
              rafHandle = window.requestAnimationFrame(loop);
            } else {
              rafHandle = 0;
            }
          });
        },
        stop() {
          window.cancelAnimationFrame(rafHandle);
          rafHandle = 0;
        },
        isScrolling() {
          return rafHandle !== 0;
        }
      };
    })();

    // Scroll closures
    const Scroll = (function IIFE() {
      const zero = -(rootRect.height - Items.getOnesHeight()) / 2;
      let current: number;
      return {
        getCurrentPosition(): number {
          return current;
        },
        getCurrentItemIndex(): number {
          return current / Items.getOnesHeight();
        },
        to(y: number) {
          current = y;
          content.style.transform = `translateY(${-(zero + current)}px)`;
        },
        by(y: number) {
          this.to(current + y);
        },
        toItemIndex(index: number) {
          this.to(Items.getOnesHeight() * index);
        }
      };
    })();
    // scroll to first position
    Scroll.toItemIndex(Items.getInitialIndex());

    // Velocity Record closures
    const VelocityRecord = (function IIFE() {
      interface VelocityRecord {
        time: number;
        position: number;
      }
      let records: VelocityRecord[] = [];
      return {
        get(): number {
          if (records.length >= 2) {
            const lastRecord: VelocityRecord = { ...records[records.length - 1], time: Date.now() };
            for (let i = records.length - 1; i >= 0; i--) {
              const currentRecord = records[i];
              const timeDiff = lastRecord.time - currentRecord.time;
              const posDiff = lastRecord.position - currentRecord.position;
              if (timeDiff < 30) {
                continue;
              } else if (timeDiff > 100) {
                break;
              } else {
                return posDiff / timeDiff;
              }
            }
          }
          return 0;
        },
        reset() {
          records = [];
        },
        record(position: number) {
          records.push({ time: Date.now(), position });
        }
      };
    })();

    // User Input closures
    const UserInput = (function IIFE() {
      let last: number;
      let moving: boolean = false;
      return {
        start(y: number) {
          VelocityRecord.reset();
          last = y;
          moving = true;
        },
        move(y: number): boolean {
          if (!moving) {
            return false;
          }
          Scroll.by(-(y - last));
          VelocityRecord.record(y);
          last = y;
          return true;
        },
        end() {
          const velocity = VelocityRecord.get();
          MomentumScroll.start(velocity);
          moving = false;
        },
        isMoving(): boolean {
          return moving;
        }
      };
    })();

    // event listners
    const listeners = {
      touchstart(e: React.TouchEvent<HTMLDivElement>) {
        const { pageY: y } = e.touches[0];
        UserInput.start(y);
      },
      touchmove(e: React.TouchEvent<HTMLDivElement>) {
        const { pageY: y } = e.touches[0];
        if (UserInput.move(y)) {
          e.preventDefault();
        }
      },
      touchend() {
        UserInput.end();
      },
      touchcancel() {
        UserInput.end();
      }
    };

    // register the event listeners to the root element
    Object.entries(listeners).forEach(([name, listener]) => {
      // the `passive` option should be `false` when calling `preventDefault()` inside of the event
      const hasPreventDefault = name.indexOf("move") >= 0;
      const option: AddEventListenerOptions = { passive: !hasPreventDefault };
      root.addEventListener(name, listener as any, option);
    });

    return () => {
      console.log("EFFECT END");
      // stop momentum-based scrolling
      MomentumScroll.isScrolling() && MomentumScroll.stop();
      // unregister the event listeners from the root element
      Object.entries(listeners).forEach(([name, listener]) => {
        root.removeEventListener(name, listener as any);
      });
    };
  }, [selectedValue, onChangeValue]);

  return (
    <div ref={rootRef} className={["picker-root", className].join(" ")}>
      <div ref={contentRef} className="picker-content">
        {children}
      </div>
    </div>
  );
}

export default Picker;
