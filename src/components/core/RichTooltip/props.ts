import { PopoverOrigin } from "@mui/material";
import { JSX } from "react";

export interface RichTooltipProps {
  onClose?: () => void;
  open: boolean;
  children: JSX.Element;
  content: JSX.Element;
  poppoverOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  className?: string;
  unsetHeight?: boolean;
}
