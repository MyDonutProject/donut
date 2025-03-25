import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Custom hook to determine if the current screen width is considered mobile.
 * This hook uses the `useMediaQuery` hook from Material-UI to check if the screen width is less than or equal to 768px.
 *
 * @returns {boolean} - A boolean value indicating if the screen width is considered mobile.
 *
 * @example
 * const isMobile = useIsMobile();
 */
export function useIsMobile(): boolean {
  // Use the useMediaQuery hook to check if the screen width is less than or equal to 768px
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Return the boolean value indicating if the screen width is considered mobile
  return isMobile;
}
