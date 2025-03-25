export interface SelectOptionWithHighlightProps<T> {
  handleSelect: (value: T) => void;
  option: T;
  label: string;
  description?: string;
  selected: boolean;
}
