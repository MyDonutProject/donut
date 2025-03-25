import { SelectInputProps } from './props';
import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SelectInputOptions from './Options';
import styles from './styles.module.scss';
import skeleton from './styles-skeleton.module.scss';
import useClickOutside  from '@/hooks/useClickOutside';
import SelectInputOptionInput from './Input';

/**
 * SelectInput Component
 * A customizable select/dropdown component that supports async loading, pagination, and custom rendering.
 *
 * @component
 * @template T - The type of the option objects
 * @template V - The type of the selected value
 *
 * @param {Object} props - Component props
 * @param {T[]} [props.options=[]] - Array of options to display in the dropdown
 * @param {(value: V) => void} props.setValue - Callback to set the selected value
 * @param {(option: T) => string} props.getOptionLabel - Function to get display label from option
 * @param {(option: T) => V} props.getOptionValue - Function to get value from option
 * @param {V} props.value - Currently selected value
 * @param {boolean} [props.disabled] - Whether the select is disabled
 * @param {boolean} [props.cardBg] - Whether to use card background styling
 * @param {boolean} [props.secondaryText=false] - Whether to use secondary text styling
 * @param {boolean} [props.loading=false] - Whether options are loading
 * @param {boolean} [props.loadingMore=false] - Whether more options are being loaded
 * @param {boolean} [props.invertOptionsPosition=false] - Whether to invert dropdown position
 * @param {() => void} [props.loadMore] - Callback to load more options
 * @param {boolean} [props.hasNextPage=false] - Whether more options can be loaded
 * @param {boolean} [props.isAsync=false] - Whether options are loaded asynchronously
 * @param {Object} [props.customComponents] - Custom rendering components
 * @param {Error} [props.error] - Error object if request failed
 * @param {() => void} [props.refetch] - Function to retry failed request
 * @param {boolean} [props.disableClickOutside] - Whether to disable closing on outside click
 * @param {string} [props.popLayout] - Layout style for the dropdown
 * @returns {JSX.Element} The rendered select input component
 *
 * @example
 * type User = {
 *   id: number;
 *   name: string;
 *   email: string;
 * };
 *
 * <SelectInput<User, number>
 *   options={users}
 *   setValue={(id) => setSelectedUser(id)}
 *   getOptionLabel={(user) => user.name}
 *   getOptionValue={(user) => user.id}
 *   value={selectedUserId}
 *   loading={isLoading}
 *   loadingMore={isLoadingMore}
 *   hasNextPage={hasMore}
 *   loadMore={fetchNextPage}
 *   isAsync={true}
 * />
 */
export function SelectInput<T, V>({
  options = [],
  setValue,
  getOptionLabel,
  getOptionValue,
  value,
  disabled,
  cardBg,
  secondaryText = false,
  loading = false,
  loadingMore = false,
  invertOptionsPosition = false,
  loadMore = () => {},
  hasNextPage = false,
  isAsync = false,
  customComponents,
  error,
  refetch,
  disableClickOutside,
  popLayout,
}: SelectInputProps<T, V>) {
  // Reference to the select container element
  const ref = useRef<HTMLDivElement>(null);

  // State to control dropdown visibility
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Toggles the dropdown open/closed state
   */
  function handleToggleFilterDropdown() {
    setOpen(state => !state);
  }

  // Hook to handle clicking outside the select to close it
  useClickOutside({
    open,
    onClickOutside: handleToggleFilterDropdown,
    customRef: ref,
    disabled: disableClickOutside,
  });

  // Show loading skeleton if in loading state
  if (loading) {
    return customComponents?.customSkeletonInput ? (
      customComponents?.customSkeletonInput()
    ) : (
      <div
        className={`${styles['selected-option']} ${cardBg ? styles['selected-option--card-bg'] : ''}`}
      >
        <div className={skeleton.text} />
        <div className={skeleton.chevron} />
      </div>
    );
  }

  return (
    <div className={styles.container} ref={ref} id="select-input-container">
      <SelectInputOptionInput
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        handleToggleFilterDropdown={handleToggleFilterDropdown}
        options={options}
        setValue={setValue}
        value={value}
        cardBg={cardBg}
        customComponents={customComponents}
        error={error}
        refetch={refetch}
        hasNextPage={hasNextPage}
        secondaryText={secondaryText}
        isAsync={isAsync}
        open={open}
        disableClickOutside={disableClickOutside}
        disabled={disabled}
        loadMore={loadMore}
        loading={loading}
        loadingMore={loadingMore}
        popLayout={popLayout}
      />
      <AnimatePresence>
        {open && !disabled && (
          <SelectInputOptions
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            handleClose={handleToggleFilterDropdown}
            options={options}
            parentBounding={ref?.current?.getBoundingClientRect?.()}
            setValue={setValue}
            value={value}
            cardBg={cardBg}
            customComponents={customComponents}
            error={error}
            refetch={refetch}
            hasNextPage={hasNextPage}
            isAsync={isAsync}
            isInverted={invertOptionsPosition}
            loadMore={loadMore}
            popLayout={popLayout}
            loading={loading}
            loadingMore={loadingMore}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
