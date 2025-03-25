import { useElapsedTime } from 'use-elapsed-time';
import { Props, ReturnProps } from './props';
import { defaultEasing, getEasing } from './easing';
import { getDefaultDecimalPlaces } from './helpers/getDefaultDecimalPlaces';
import { getDuration } from './helpers/getDuration';
import { addThousandsSeparator } from './helpers/addThousandsSeparator';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook to perform a count-up animation.
 *
 * @param {Props} props - The properties for the count-up animation.
 * @returns {ReturnProps} - The current value of the count-up and a reset function.
 *
 * Example usage:
 * const { value, reset } = useCountUp({ start: 0, end: 100, duration: 5 });
 */
export const useCountUp = ({
  start = 0, // Starting value of the count-up
  end, // Ending value of the count-up
  duration, // Duration of the count-up animation
  decimalPlaces = getDefaultDecimalPlaces(start, end), // Number of decimal places to display
  decimalSeparator = '.', // Separator for decimal places
  thousandsSeparator = '', // Separator for thousands
  onComplete, // Callback function when count-up completes
  easing = defaultEasing, // Easing function for the animation
  formatter, // Custom formatter function for the value
  updateInterval, // Interval for updating the value
  onUpdate, // Callback function for each update
  delay = 0, // Delay before starting the count-up
}: Props): ReturnProps => {
  // State to track if the animation is playing
  const [isPlaying, setIsPlaying] = useState<boolean>(!delay);
  // Calculate the duration value using helper function
  const durationValue = getDuration(end, duration);

  /**
   * Function to calculate the current value based on elapsed time.
   *
   * @param {number} elapsedTime - The elapsed time of the animation.
   * @returns {string | number} - The formatted or raw value.
   *
   * Example usage:
   * const value = getValue(2.5); // Returns formatted value at 2.5 seconds
   */
  function getValue(elapsedTime: number) {
    let rawValue: number;

    if (durationValue === 0 && typeof end === 'number') {
      rawValue = end;
    } else if (typeof end === 'number' && typeof durationValue === 'number') {
      const easingFn = getEasing(easing);
      const time = elapsedTime < durationValue ? elapsedTime : durationValue;
      rawValue = easingFn(time, start, end - start, durationValue);
    } else {
      rawValue = start + elapsedTime;
    }

    if (typeof formatter === 'function') {
      return formatter(rawValue);
    }

    if (decimalPlaces === 0) {
      const valueStr = Math.round(rawValue).toString();
      return addThousandsSeparator(valueStr, thousandsSeparator);
    }

    const [int, decimals] = rawValue.toFixed(decimalPlaces).split('.');
    const intFormatted = addThousandsSeparator(int, thousandsSeparator);
    return `${intFormatted}${decimalSeparator}${decimals}`;
  }

  // Destructure elapsedTime and reset function from useElapsedTime hook
  const { elapsedTime, reset } = useElapsedTime({
    isPlaying: !!delay ? isPlaying : true,
    duration: durationValue,
    onComplete: () => {
      setIsPlaying(false);
      onComplete?.();
    },
    updateInterval,
    onUpdate:
      typeof onUpdate === 'function'
        ? (currentTime: number) => onUpdate(getValue(currentTime))
        : undefined,
  });

  /**
   * Function to handle component mount logic.
   * Sets a timeout to start the animation after a delay.
   */
  function onMount() {
    if (!delay || isPlaying) {
      return;
    }

    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      setIsPlaying(true);
      reset();
    }, delay);

    return () => clearTimeout(timeoutId);
  }

  // Effect to handle component mount and update logic
  useEffect(onMount, [delay, isPlaying, reset]);

  /**
   * Callback function to reset the count-up animation.
   */
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    reset();
  }, [reset]);

  // Return the current value and reset function
  return { value: getValue(elapsedTime), reset: handleReset };
};
