import { Easing } from './props';

/**
 * An object containing different easing functions for animations.
 * Each function calculates the current value of an animation based on time.
 */
export const easings = {
  /**
   * Easing function for ease-in cubic animation.
   *
   * @param {number} t - Current time (or position) of the animation. Example: 0.5
   * @param {number} b - Starting value of the property being animated. Example: 0
   * @param {number} c - Change in value of the property being animated. Example: 100
   * @param {number} d - Duration of the animation. Example: 1
   * @returns {number} - The calculated value at time t. Example: 12.5
   */
  easeInCubic: (t: number, b: number, c: number, d: number): number => {
    t /= d;
    return c * t * t * t + b;
  },

  /**
   * Easing function for ease-out cubic animation.
   *
   * @param {number} t - Current time (or position) of the animation. Example: 0.5
   * @param {number} b - Starting value of the property being animated. Example: 0
   * @param {number} c - Change in value of the property being animated. Example: 100
   * @param {number} d - Duration of the animation. Example: 1
   * @returns {number} - The calculated value at time t. Example: 87.5
   */
  easeOutCubic: (t: number, b: number, c: number, d: number): number => {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  },

  /**
   * Linear easing function for animations.
   *
   * @param {number} t - Current time (or position) of the animation. Example: 0.5
   * @param {number} b - Starting value of the property being animated. Example: 0
   * @param {number} c - Change in value of the property being animated. Example: 100
   * @param {number} d - Duration of the animation. Example: 1
   * @returns {number} - The calculated value at time t. Example: 50
   */
  linear: (t: number, b: number, c: number, d: number): number => {
    return (c * t) / d + b;
  },
};

/**
 * The default easing function used when no specific easing is provided.
 * Defaults to the easeOutCubic function.
 */
export const defaultEasing = easings.easeOutCubic;

/**
 * Function to retrieve the appropriate easing function.
 *
 * @param {Easing} easing - The easing function or key to retrieve. Example: 'easeInCubic'
 * @returns {Function} - The corresponding easing function. Example: easings.easeInCubic
 */
export const getEasing = (easing: Easing) =>
  typeof easing === 'function' ? easing : easings[easing];
