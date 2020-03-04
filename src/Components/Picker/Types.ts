export type PickerItemValue = string | number;

export type PickerOnChangeEventHandler = (value: PickerItemValue) => void;

export interface PickerProps {
  children?: React.ReactNode;
  selected?: PickerItemValue;
  onChange?: PickerOnChangeEventHandler;
  className?: string;
}

export interface PickerItemProps {
  value: PickerItemValue;
}
