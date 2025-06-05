export interface ValidateCodeInputProps {
  setValue(value: string): void;
  maxLength?: number;
  isContainerColor?: boolean;
  isDefaultColor?: boolean;
  isLoading?: boolean;
  withMaxWidth?: boolean;
  preventAutoFocus?: boolean;
}
