import React, { useRef, useEffect } from "react";
import { PickerProps } from "./Types";
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

    // Items data
    const itemValues = React.Children.map(children, ({ props }) => props.value);
    const initialIndex = selectedValue !== undefined ? itemValues.indexOf(selectedValue) : 0;
    const itemsCount = itemValues.length;
    const itemHeight = contentRect.height / itemsCount;

    // Scroll closures
    const Scroll = (function IIFE() {
      const zero = -(rootRect.height - itemHeight) / 2;
      let current: number;
      return {
        getCurrent(): number {
          return current;
        },
        getCurrentItemIndex(): number {
          return current / itemHeight;
        },
        to(y: number) {
          current = y;
          content.style.transform = `translateY(${-(zero + current)}px)`;
        },
        by(y: number) {
          this.to(current + y);
        },
        toItemIndex(index: number) {
          this.to(itemHeight * index);
        }
      };
    })();

    const Velocity = (function IIFE() {
      return {
        get(): number {
          return 0;
        },
        record(value: number) {}
      };
    })();

    // User Input closures
    const UserInput = (function IIFE() {
      let last: number;
      let moving: boolean = false;
      return {
        start(y: number) {
          last = y;
          moving = true;
        },
        move(y: number): boolean {
          if (!moving) {
            return false;
          }
          Scroll.by(-(y - last));
          last = y;
          return true;
        },
        end() {
          moving = false;
        },
        isMoving(): boolean {
          return moving;
        }
      };
    })();

    // scroll to first position
    Scroll.toItemIndex(initialIndex);

    // start RAF loop for the scroll's flow animation
    let rafHandle: number;
    const loop = () => {
      // TODO
      rafHandle = window.requestAnimationFrame(loop);
    };
    rafHandle = window.requestAnimationFrame(loop);

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
      // kill RAF loop
      window.cancelAnimationFrame(rafHandle);
      // unregister the events from the root element
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
