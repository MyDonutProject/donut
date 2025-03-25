import { options } from './options';
import useTranslation from 'next-translate/useTranslation';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '@/store/affiliates/actions';
import { RootState } from '@/store';
import { FormGroup } from '@/components/core/FormGroup';
import { SelectInput } from '@/components/core/SelectInput';
import { SelectInputWithImage } from '@/components/core/SelectInput/SelectWithImage/SelectInputWithImage';
import { SelectOptionWithImage } from '@/components/core/SelectInput/SelectWithImage/SelectOptionWithImage';

export default function AffiliatesTableHeaderSelect() {
  const { t } = useTranslation('common');
  const filter = useSelector(
    (state: RootState) => state.affiliatesFilter.filter,
  );
  const dispatch = useDispatch();

  function handleSetValue(value) {
    dispatch(setFilter(value?.label === 'all_label' ? null : value?.label));
  }

  return (
    <FormGroup label={t('filter_label')} className={styles.container}>
      <SelectInput
        options={options}
        getOptionLabel={option => t(option.label)}
        getOptionValue={option => option.label}
        setValue={handleSetValue}
        cardBg
        value={filter}
        customComponents={{
          customInput: ({ handleOpen, open, option }) => (
            <SelectInputWithImage
              cardBg
              handleOpen={handleOpen}
              open={open}
              image={option?.image ? `/donut/donuts/${option?.image}` : null}
              label={t(option?.label)}
            />
          ),
          customOption: ({ option, handleSelect, selected }) => (
            <SelectOptionWithImage
              image={option?.image ? `/donut/donuts/${option?.image}` : null}
              label={t(option?.label)}
              handleSelect={handleSelect}
              option={option}
              selected={selected}
            />
          ),
        }}
      />
    </FormGroup>
  );
}
