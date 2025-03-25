import { OptionsProps } from './props';
import { motion } from 'framer-motion';
import { dropIn } from '../variants';
import styles from './styles.module.scss';
import skeleton from './styles-skeleton.module.scss';
import { memo, useCallback, useEffect, useState } from 'react';
import { ErrorCard } from '@/components/core/ErrorCard';
import { Nullable } from '@/interfaces/nullable';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { KeyboardKey } from '@/enums/keyboardKey';

/**
 * SelectInputOptions Component
 * A dropdown options list component for SelectInput that supports keyboard navigation,
 * infinite scrolling, async loading, and custom option rendering.
 *
 * @component
 * @template T - The type of the option objects
 * @template V - The type of the selected value
 *
 * @param {Object} props - Component props
 * @param {(option: T) => string} props.getOptionLabel - Function to get display label from option
 * @param {(option: T) => V} props.getOptionValue - Function to get value from option
 * @param {() => void} props.handleClose - Function to close the dropdown
 * @param {boolean} props.cardBg - Whether to use card background styling
 * @param {Object} props.customComponents - Custom rendering components
 * @param {boolean} props.isInverted - Whether dropdown position is inverted
 * @param {T[]} props.options - Array of options to display
 * @param {boolean} props.loadingMore - Whether more options are being loaded
 * @param {() => void} props.loadMore - Function to load more options
 * @param {boolean} props.hasNextPage - Whether more options can be loaded
 * @param {boolean} props.isAsync - Whether options are loaded asynchronously
 * @param {boolean} props.loading - Whether initial options are loading
 * @param {(value: T) => void} props.setValue - Function to set selected value
 * @param {V} props.value - Currently selected value
 * @param {Error} props.error - Error object if request failed
 * @param {() => void} props.refetch - Function to retry failed request
 * @param {string} props.popLayout - Layout style for the dropdown
 * @param {DOMRect} props.parentBounding - Parent element bounding rectangle
 * @returns {JSX.Element} The rendered options dropdown
 *
 * @example
 * type User = {
 *   id: number;
 *   name: string;
 * };
 *
 * <SelectInputOptions<User, number>
 *   getOptionLabel={(user) => user.name}
 *   getOptionValue={(user) => user.id}
 *   handleClose={() => setIsOpen(false)}
 *   options={users}
 *   loading={isLoading}
 *   loadingMore={isLoadingMore}
 *   loadMore={fetchNextPage}
 *   hasNextPage={hasMore}
 *   isAsync={true}
 *   setValue={(user) => setSelectedUser(user)}
 *   value={selectedUserId}
 * />
 */
function SelectInputOptions<T, V>({
  getOptionLabel,
  getOptionValue,
  handleClose,
  cardBg,
  customComponents,
  isInverted = false,
  options,
  loadingMore = false,
  loadMore = () => {},
  hasNextPage = false,
  isAsync = false,
  loading = false,
  setValue,
  value,
  error,
  refetch,
  popLayout,
  parentBounding,
}: OptionsProps<T, V>) {
  // Hook for handling infinite scroll functionality
  const { ref } = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loadingMore || loading,
    loadMore,
    condition: isAsync,
  });

  // State to track keyboard-highlighted option index
  const [highlightedIndex, setHighlightedIndex] =
    useState<Nullable<number>>(null);

  /**
   * Handles selection of an option
   * Sets the value and closes the dropdown
   *
   * @param {T} value - The selected option
   */
  const handleSelectFilter = useCallback(
    (value: T) => {
      setValue(value);
      handleClose();
    },
    [setValue, handleClose],
  );

  /**
   * Handles keyboard navigation events
   * Supports up/down arrows for navigation and enter for selection
   *
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!options.length) return;

      switch (e.key) {
        case KeyboardKey.ARROW_DOWN:
          setHighlightedIndex(prevIndex =>
            prevIndex === null || prevIndex === options.length - 1
              ? 0
              : prevIndex + 1,
          );
          break;
        case KeyboardKey.ARROW_UP:
          setHighlightedIndex(prevIndex =>
            prevIndex === null || prevIndex === 0
              ? options.length - 1
              : prevIndex - 1,
          );
          break;
        case KeyboardKey.ENTER:
          if (highlightedIndex === null) {
            break;
          }

          e.preventDefault();
          handleSelectFilter(options[highlightedIndex]);
          break;
      }
    },
    [handleSelectFilter, highlightedIndex, options],
  );

  /**
   * Sets up keyboard event listeners on mount
   * Cleans up listeners on unmount
   */
  function onMount() {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }

  /**
   * Scrolls highlighted option into view when changed
   */
  function onChangeHighlightedIndex() {
    if (!ref.current || !highlightedIndex) {
      return;
    }
    const children: HTMLDivElement[] = Array.from(
      ref.current.children,
    ) as HTMLDivElement[];
    const targetElement: HTMLDivElement = children[highlightedIndex];

    if (!targetElement) {
      return;
    }

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }

  useEffect(onChangeHighlightedIndex, [highlightedIndex, ref]);

  useEffect(onMount, [
    highlightedIndex,
    options,
    handleSelectFilter,
    handleKeyDown,
  ]);

  return (
    <motion.div
      className={`${styles.container} ${isInverted ? styles['container--inverted'] : ''} ${cardBg ? styles['container--card-bg'] : ''} ${popLayout ? styles['container--popLayout'] : ''}`}
      ref={ref}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        maxWidth: isInverted || !popLayout ? undefined : parentBounding?.width,
        left: isInverted || !popLayout ? undefined : parentBounding?.left,
      }}
    >
      {(loading &&
        (customComponents?.customSkeletonOption
          ? Array.from({ length: 10 }).map((_, index) => {
              return customComponents.customSkeletonOption?.(
                `load-more-options-select-${index}`,
              );
            })
          : Array.from({ length: 10 }).map((_, index) => {
              return (
                <div
                  className={skeleton.container}
                  key={`load-options-select-${index}`}
                >
                  <div className={skeleton.container__text} />
                </div>
              );
            }))) ||
        options.map((option, index) =>
          customComponents?.customOption ? (
            customComponents?.customOption({
              option,
              selected:
                getOptionValue(option) === value || highlightedIndex === index,
              handleSelect: handleSelectFilter,
              key: `select-input-option-${index}`,
            })
          ) : (
            <div
              className={`${styles.container__option} ${
                getOptionValue(option) === value || highlightedIndex === index
                  ? styles['container__option--selected']
                  : ''
              }`}
              key={`select-input-option-${index}`}
              onClick={() => handleSelectFilter(option)}
            >
              {getOptionLabel(option)}
            </div>
          ),
        )}

      {loadingMore &&
        isAsync &&
        (customComponents?.customSkeletonOption
          ? Array.from({ length: 10 }).map((_, index) => {
              return customComponents.customSkeletonOption?.(
                `load-more-options-select-${index}`,
              );
            })
          : Array.from({ length: 10 }).map((_, index) => {
              return (
                <div
                  className={skeleton.container}
                  key={`load-more-options-select-${index}`}
                >
                  <div className={skeleton.container__text} />
                </div>
              );
            }))}
      {error && <ErrorCard error={error} refetch={refetch} isDefaultColor />}
    </motion.div>
  );
}

export default memo(SelectInputOptions) as typeof SelectInputOptions;
