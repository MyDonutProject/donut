export type AnimationVariantProps =
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'fadeInUp'
  | 'fadeInDown';
export interface AnimationProps {
  type: AnimationVariantProps;
  triggerOnce?: boolean;
  className?: string;
}
export interface ContainerProps {
  hydratated: boolean;
  isInView: boolean;
  variant: AnimationVariantProps;
}
