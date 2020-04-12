import React, { useRef, useEffect } from "react";
import { PickerProps, PickerItemValue } from "./Types";
import "./Picker.css";

function Picker({ children, selectedValue, onChangeValue, className }: PickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // Scroll closures
    const Scroll = (function IIFE() {
      const zero = -(rootRect.height - Items.getOnesHeight()) / 2;
      const constants = {
        outsideScrollMultiply: 0.25
      };
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
          let translated: number;
          const [start, end] = [0, Items.getTotalHeight() - Items.getOnesHeight()];
          if (current < start) {
            translated = start + (current - start) * constants.outsideScrollMultiply;
          } else if (current > end) {
            translated = end + (current - end) * constants.outsideScrollMultiply;
          } else {
            translated = current;
          }
          content.style.transform = `translateY(${-(zero + translated)}px)`;
        },
        by(y: number) {
          this.to(current + y);
        },
        toItemIndex(index: number) {
          this.to(Items.getOnesHeight() * index);
        }
      };
    })();
    // scroll to initial position
    Scroll.toItemIndex(Items.getInitialIndex());

    // Momentum-based Scroll closures
    const MomentumScroll = (function IIFE() {
      let rafHandle = 0;
      const constants = {
        slowdownBaseVelocity: Items.getOnesHeight() * 0.005,
        friction: 0.003,
        maxVelocity: 8,
        outsideForce: 0.02
      };
      const limitNumber = (value: number, min: number, max: number) =>
        Math.max(Math.min(value, max), min);
      return {
        start(velocity: number) {
          if (this.isScrolling()) {
            return;
          }

          // check the initial velocity
          if (velocity === 0) {
            const idx = Scroll.getCurrentItemIndex();
            if (idx < 0) {
              velocity = constants.slowdownBaseVelocity;
            } else if (idx > Items.getCount() - 1) {
              velocity = -constants.slowdownBaseVelocity;
            } else {
              const idxFractionalPart = idx % (Math.floor(idx) || 1);
              velocity =
                idxFractionalPart > 0.5
                  ? constants.slowdownBaseVelocity
                  : -constants.slowdownBaseVelocity;
            }
          }

          let lastTime = window.performance.now();
          rafHandle = window.requestAnimationFrame(function loop(nowTime: number) {
            const timeDiff = nowTime - lastTime;
            lastTime = nowTime;

            // check the index before move
            const beforeMoveCurrIndex = Scroll.getCurrentItemIndex();
            const beforeMoveNextIndex = limitNumber(
              velocity > 0 ? Math.ceil(beforeMoveCurrIndex) : Math.floor(beforeMoveCurrIndex),
              0,
              Items.getCount() - 1
            );

            // move as current velocity
            if (Math.abs(velocity) < constants.slowdownBaseVelocity) {
              velocity =
                velocity > 0 ? constants.slowdownBaseVelocity : -constants.slowdownBaseVelocity;
            }
            velocity = limitNumber(velocity, -constants.maxVelocity, constants.maxVelocity);
            Scroll.by(velocity * timeDiff);

            // check the index after move
            const afterMoveCurrIndex = Scroll.getCurrentItemIndex();

            if (afterMoveCurrIndex < 0) {
              velocity += constants.outsideForce * timeDiff;
            } else if (afterMoveCurrIndex > Items.getCount() - 1) {
              velocity -= constants.outsideForce * timeDiff;
            } else {
              if (beforeMoveCurrIndex < 0) {
                velocity = 0.001;
              } else if (beforeMoveCurrIndex > Items.getCount() - 1) {
                velocity = -0.001;
              }
              // if the velocity is not slow
              if (Math.abs(velocity) > constants.slowdownBaseVelocity) {
                // decelerate as friction
                const decAmount = constants.friction * timeDiff;
                if (velocity > 0) {
                  velocity = Math.max(velocity - decAmount, 0);
                } else {
                  velocity = Math.min(velocity + decAmount, 0);
                }
              }
              // if the velocity is slow
              else {
                // if arrived to the destination index
                if (
                  velocity > 0
                    ? afterMoveCurrIndex >= beforeMoveNextIndex
                    : afterMoveCurrIndex <= beforeMoveNextIndex
                ) {
                  // correct the position and invoke `onChange`
                  Scroll.toItemIndex(beforeMoveNextIndex);
                  if (selectedValue !== beforeMoveNextIndex) {
                    onChangeValue && onChangeValue(beforeMoveNextIndex);
                  }
                  // stop the loop
                  rafHandle = 0;
                  return;
                }
              }
            }

            // request next loop
            rafHandle = window.requestAnimationFrame(loop);
          });
        },
        stop() {
          if (this.isScrolling()) {
            window.cancelAnimationFrame(rafHandle);
            rafHandle = 0;
          }
        },
        isScrolling() {
          return rafHandle !== 0;
        }
      };
    })();

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
          MomentumScroll.stop();
          last = y;
          moving = true;
        },
        move(y: number): boolean {
          if (!moving) {
            return false;
          }
          Scroll.by(-(y - last));
          VelocityRecord.record(-y);
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
    let sensedTouchId: number;
    const listeners = {
      touchstart(e: React.TouchEvent<HTMLDivElement>) {
        const touch = e.touches[0];
        const { pageY: y, identifier } = touch;
        sensedTouchId = identifier;
        UserInput.start(y);
      },
      touchmove(e: React.TouchEvent<HTMLDivElement>) {
        const touch = Array.from(e.touches).find(touch => touch.identifier === sensedTouchId);
        if (touch !== undefined) {
          const { pageY: y } = touch;
          if (UserInput.move(y)) {
            e.preventDefault();
          }
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
      // stop momentum-based scrolling
      MomentumScroll.stop();
      // unregister the event listeners from the root element
      Object.entries(listeners).forEach(([name, listener]) => {
        root.removeEventListener(name, listener as any);
      });
    };
  }, [children, selectedValue, onChangeValue]);

  return (
    <div ref={rootRef} className={["picker-root", className].join(" ")}>
      <div ref={contentRef} className="picker-content">
        {children}
      </div>
    </div>
  );
}

export default Picker;
