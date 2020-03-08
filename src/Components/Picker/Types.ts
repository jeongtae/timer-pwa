export type PickerItemValue = string | number;

export type PickerOnChangeValueEventHandler = (value: PickerItemValue) => void;

export interface PickerProps {
  // children?: React.ReactNode;
  // children?: React.Component<PickerItemProps>[] | React.Component<PickerItemProps>;
  children: React.ReactElement<PickerItemProps>[] | React.ReactElement<PickerItemProps>;
  selectedValue?: PickerItemValue;
  onChangeValue?: PickerOnChangeValueEventHandler;
  className?: string;
}

export interface PickerItemProps {
  value: PickerItemValue;
}
