import { ModalsKey } from "@/enums/modalsKey";

export interface ModalLayoutProps {
  title: string;
  modal: string | ModalsKey;
  condition?: boolean;
  isLoading?: boolean;
  smallMobilePadding?: boolean;
  fitContent?: boolean;
  clearParams?: boolean;
  className?: string;
  smallHeaderPadding?: boolean;
  version?: string;
  noPadding?: boolean;
  color?: string;
  onChange?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
