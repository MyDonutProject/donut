import { useEffect, useMemo, useState } from 'react';
import { SelectInputProps } from '../props';

import styles from '../styles.module.scss';

/**
 * SelectInputOptionInput Component
 * A customizable input component for select/dropdown that handles selected option display and dropdown toggling.
 * Supports custom rendering, disabled states, and various visual styles.
 *
 * @component
 * @template T - The type of the option objects
 * @template V - The type of the selected value
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dropdown is open
 * @param {() => void} props.handleToggleFilterDropdown - Function to toggle dropdown open/closed
 * @param {Object} props.customComponents - Custom rendering components
 * @param {(option: T) => string} props.getOptionLabel - Function to get display label from option
 * @param {T[]} props.options - Array of available options
 * @param {(option: T) => V} props.getOptionValue - Function to get value from option
 * @param {V} props.value - Currently selected value
 * @param {boolean} props.cardBg - Whether to use card background styling
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {boolean} props.secondaryText - Whether to use secondary text styling
 * @returns {JSX.Element} The rendered input component
 *
 * @example
 * <SelectInputOptionInput
 *   open={isOpen}
 *   handleToggleFilterDropdown={() => setIsOpen(!isOpen)}
 *   getOptionLabel={(option) => option.name}
 *   options={[{ id: 1, name: 'Option 1' }]}
 *   getOptionValue={(option) => option.id}
 *   value={1}
 *   disabled={false}
 *   cardBg={true}
 *   secondaryText={false}
 * />
 */
export default function SelectInputOptionInput<T, V>({
  open,
  handleToggleFilterDropdown,
  ...props
}: SelectInputProps<T, V> & {
  open: boolean;
  handleToggleFilterDropdown: VoidFunction;
}) {
  const {
    customComponents,
    getOptionLabel,
    options,
    getOptionValue,
    value,
    cardBg,
    disabled,
    secondaryText,
  } = props ?? {};
  const [selectedOption, setSelectedOption] = useState<T | undefined>();

  // Find the currently selected option by matching values
  const foundOption: T | undefined = useMemo(
    () =>
      options?.find(option => {
        return getOptionValue(option) === value;
      }),
    [getOptionValue, options, value],
  );

  const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : '';

  /**
   * Updates the selected option state when foundOption changes
   */
  function onChangeOption() {
    if (!foundOption) {
      return;
    }

    setSelectedOption(foundOption);
  }

  useEffect(onChangeOption, [foundOption]);

  return customComponents?.customInput ? (
    customComponents?.customInput({
      handleOpen: handleToggleFilterDropdown,
      open,
      option: selectedOption,
    })
  ) : (
    <div
      className={`${styles['selected-option']} ${cardBg ? styles['selected-option--card-bg'] : ''} ${open ? styles['selected-option--open'] : ''} ${disabled ? styles['selected-option--disabled'] : ''} ${secondaryText ? styles['selected-option--secondary-text'] : ''}`}
      onClick={handleToggleFilterDropdown}
      id="input-select-button"
    >
      <p>{selectedLabel}</p>
      {disabled ? (
        <i className="fa-solid fa-lock" />
      ) : (
        <i className="fas fa-chevron-down" />
      )}
    </div>
  );
}
