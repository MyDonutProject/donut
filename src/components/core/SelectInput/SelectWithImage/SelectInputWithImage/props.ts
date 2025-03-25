export interface CustomSelectInputProps {
  open?: boolean;
  cardBg?: boolean;
  disabled?: boolean;
}

export interface SelectInputWithImageProps {
  handleOpen: () => void;
  open: boolean;
  cardBg?: boolean;
  isWithoutChevron?: boolean;
  disabled?: boolean;
  image: string;
  label: string;
  isSmall?: boolean;
  pairImage?: string;
  className?: string;
}
