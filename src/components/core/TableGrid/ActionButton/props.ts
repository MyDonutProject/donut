export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  tooltipTitle: string;
  isLoading?: boolean;
}
