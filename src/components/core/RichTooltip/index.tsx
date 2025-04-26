import Popover from "@mui/material/Popover";
import { useState } from "react";
import { RichTooltipProps } from "./props";
import styles from "./styles.module.scss";

/**
 * RichTooltip Component
 * A customizable tooltip/popover component that displays content when triggered
 *
 * @param {Object} props
 * @param {boolean} props.open - Controls visibility of the tooltip
 * @param {() => void} props.onClose - Callback function when tooltip closes
 * @param {React.ReactNode} props.children - Content that triggers the tooltip
 * @param {React.ReactNode} props.content - Content to display inside tooltip
 * @param {boolean} props.unsetHeight - Whether to remove fixed height constraint
 * @param {Object} props.poppoverOrigin - Position where tooltip appears relative to anchor
 * @param {Object} props.transformOrigin - Transform origin for tooltip animation
 * @param {string} props.className - Additional CSS class names
 *
 * @example
 * <RichTooltip
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   content={<div>Tooltip content</div>}
 *   poppoverOrigin={{ vertical: 'bottom', horizontal: 'right' }}
 *   transformOrigin={{ vertical: 'top', horizontal: 'right' }}
 *   className="custom-tooltip"
 * >
 *   <button>Hover me</button>
 * </RichTooltip>
 */
export const RichTooltip = ({
  open,
  onClose,
  children,
  content,
  unsetHeight,
  poppoverOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
  transformOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
  className,
}: RichTooltipProps) => {
  // State to store the anchor element that triggers the tooltip
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  /**
   * Handles click event on the trigger element
   * Sets the clicked element as the anchor for the tooltip
   * @param {React.MouseEvent<HTMLDivElement>} event - Click event object
   */
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div
      className={`${styles.container} ${
        unsetHeight ? styles["container--unset-height"] : ""
      }`}
      onClick={handleClick}
      suppressHydrationWarning
    >
      <div>{children}</div>

      <Popover
        onClose={onClose}
        open={open}
        anchorEl={anchorEl}
        BackdropProps={{ invisible: true }}
        className={`${className ? className : ""}`}
        anchorOrigin={poppoverOrigin}
        transformOrigin={transformOrigin}
      >
        {content}
      </Popover>
    </div>
  );
};
