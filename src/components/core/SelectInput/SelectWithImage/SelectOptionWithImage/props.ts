export interface SelectOptionWithImageProps<T> {
  handleSelect: (value: T) => void;
  option: T;
  label: string;
  description?: string;
  image: string;
  selected: boolean;
}
