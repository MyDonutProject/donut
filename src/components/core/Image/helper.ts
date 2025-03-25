import { ImageLoaderProps } from 'next/image';
import { ImageFormat } from './props';

/**
 * Gets the base image size based on format and dimension type
 *
 * @param type - The dimension type to get ('width' or 'height')
 * @param format - Optional image format ('square' or 'rectangle')
 * @returns The base size in pixels for the specified dimension
 *
 * @example
 * // Returns 100 (width for square format)
 * getBaseImageSize('width', 'square')
 *
 * @example
 * // Returns 150 (height for rectangle format)
 * getBaseImageSize('height', 'rectangle')
 */
export function getBaseImageSize(
  type: 'width' | 'height',
  format?: ImageFormat,
) {
  if (type === 'width') {
    switch (format) {
      case 'square':
        return 100;
      case 'rectangle':
        return 300;
      default:
        return 100;
    }
  }

  switch (format) {
    case 'square':
      return 100;
    case 'rectangle':
      return 150;
    default:
      return 100;
  }
}

/**
 * Generates an optimized image URL with resizing and format parameters
 *
 * @param props - Image loader props from next/image
 * @param props.src - Source URL of the image
 * @param props.width - Desired width of the image
 * @param props.quality - Optional quality setting (defaults to 75)
 * @returns Transformed image URL with optimization parameters
 *
 * @example
 * // Returns "https://cdn.example.com/image.jpg?w=800&quality=75&fm=webp"
 * imageLoader({
 *   src: "https://s3.example.com/image.jpg",
 *   width: 800,
 *   quality: 75
 * })
 */
export function imageLoader({ src, width, quality }: ImageLoaderProps) {
  const query = `?w=${width}&quality=${quality || 75}&fm=webp`;
  return `${src.replace(String(process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL), String(process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL))}${query}`;
}
