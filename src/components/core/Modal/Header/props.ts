export interface ModalHeaderProps {
  title?: string;
  onClose(): void;
  withBackButton?: boolean;
  withoutPadding?: boolean;
  smallMobilePadding?: boolean;
  isLoading?: boolean;
  smallPadding?: boolean;
  handleGoBack?(): void;
  className?: string;
  hideCloseButton?: boolean;
  version?: string;
  invertColor?: boolean;
}

export interface ContainerProps {
  withoutPadding?: boolean;
  smallMobilePadding?: boolean;
}
