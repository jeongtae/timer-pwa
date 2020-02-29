import React from "react";
import { PickerItemProps } from "./Types";

const PickerItem: React.FC<PickerItemProps> = ({ children, value }) => {
  return (
    <div // Item div
      style={{
        textAlign: "center",
        position: "relative",
        width: "100%",
        height: "34px",
        fontSize: "1em",
        lineHeight: "34px",
        margin: 0
      }}
    >
      {children}
    </div>
  );
};

export default PickerItem;
