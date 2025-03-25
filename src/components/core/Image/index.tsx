/* eslint-disable react/destructuring-assignment */
import Head from 'next/head';
import { CoreImageProps } from './props';
import { getBaseImageSize, imageLoader } from './helper';
import styles from './styles.module.scss';
import NextImage from 'next/image';

/**
 * Image Component
 * A wrapper around Next.js Image component with additional features like preloading,
 * skeleton loading states, and CloudFront URL transformation
 *
 * @component
 * @param {CoreImageProps} props - Component props
 * @param {string} [props.src] - Source URL of the image
 * @param {number} [props.width] - Custom width of the image
 * @param {number} [props.height] - Custom height of the image
 * @param {string} [props.format] - Image format ('square' or 'rectangle')
 * @param {boolean} [props.preload] - Whether to preload the image
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.secondarySkeleton] - Whether to use secondary skeleton style
 * @param {boolean} [props.fill] - Whether image should fill container
 * @param {string} [props.alt] - Alt text for the image
 * @param {string} [props.imagePreview] - Blur data URL for image preview
 * @param {CSSProperties} [props.style] - Custom styles
 * @returns {JSX.Element} Image component or skeleton loader
 *
 * @example
 * <Image
 *   src="https://example.com/image.jpg"
 *   width={300}
 *   height={200}
 *   format="rectangle"
 *   preload={true}
 *   alt="Example image"
 * />
 */
export function Image(props: CoreImageProps) {

  // Calculate image dimensions based on props or default sizes
  const imageWidth = props.width
    ? props.width
    : getBaseImageSize('width', props.format);
  const imageHeight = props.height
    ? props.height
    : getBaseImageSize('height', props.format);

  // Show skeleton loader if no src provided
  if (!props.src) {
    return (
      <div
        style={
          props.className
            ? {}
            : {
                width: imageWidth,
                height: imageHeight,
                borderRadius: props?.style?.borderRadius ?? '4px',
              }
        }
        className={`${props.className} ${
          props?.secondarySkeleton
            ? styles['skeleton--secondary']
            : styles.skeleton
        }`}
      />
    );
  }

  // Transform S3 URL to CloudFront URL
  const url: string = props.src.replace(
    String(process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL),
    String(process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL),
  );

  return (
    <>
      {/* Add preload link if preload prop is true */}
      {props?.preload == true && (
        <Head>
          <link rel="preload" href={url} as="image" fetchPriority="high" />
        </Head>
      )}
      {/* Render Next.js Image component with transformed props */}
      <NextImage
        {...props}
        key={url}
        width={props?.fill ? undefined : imageWidth}
        height={props?.fill ? undefined : imageHeight}
        src={url}
        alt={props?.alt ?? `Image - ${props?.imagePreview}`}
        placeholder={props?.imagePreview ? 'blur' : undefined}
        loader={url.includes('api.') ? undefined : imageLoader}
        blurDataURL={props?.imagePreview}
        loading="lazy"
        style={{
          ...props.style,
          userSelect: 'none',
        }}
        className={`${!!props?.className ? props.className : ''}`}
      />
    </>
  );
}
