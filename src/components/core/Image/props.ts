import type { ImageProps } from 'next/image';

export type ImageFormat = 'square' | 'rectangle';

export interface CoreImageProps extends Omit<ImageProps, 'alt' | 'src'> {
  preload?: boolean;
  alt?: string;
  src?: string;
  format?: ImageFormat;
  bundle?: boolean;
  secondarySkeleton?: boolean;
  imagePreview?: string;
}
