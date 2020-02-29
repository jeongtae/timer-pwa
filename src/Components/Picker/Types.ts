export type PickerItemValue = string | number;

export type PickerOnChangeEventHandler = (value: PickerItemValue) => void;

export interface PickerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  selected?: PickerItemValue;
  onChange?: PickerOnChangeEventHandler;
}

export interface PickerItemProps {
  value: PickerItemValue;
}
