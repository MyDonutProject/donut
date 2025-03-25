export type UseCountUpValue = number | string | React.ReactNode;

export type EasingFn = (
  currentTime: number,
  startValue: number,
  changeInValue: number,
  duration: number,
) => number;

export type Easing = 'easeOutCubic' | 'easeInCubic' | 'linear' | EasingFn;

export interface ReturnProps {
  value: UseCountUpValue;
  reset: () => void;
}

export interface Props {
  start?: number;
  end?: number;
  duration?: number;
  decimalPlaces?: number;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  onComplete?: VoidFunction;
  easing?: Easing;
  formatter?: (value: number) => UseCountUpValue;
  updateInterval?: number;
  onUpdate?: (value: UseCountUpValue) => void;
  delay?: number;
}
