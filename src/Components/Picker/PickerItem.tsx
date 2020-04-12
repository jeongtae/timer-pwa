import React from "react";
import { PickerItemProps } from "./Types";
import "./Picker.css";

const PickerItem: React.FC<PickerItemProps> = ({ children }) => {
  return (
    <div // Item div
      className="picker-item"
    >
      {children}
    </div>
  );
};

export default PickerItem;
