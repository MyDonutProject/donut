import { RootState } from '@/store';
import { setDateRange } from '@/store/date-filter/actions';
import { useDispatch, useSelector } from 'react-redux';

export default function useDateFilter() {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector(
    (state: RootState) => state.dateFilter,
  );

  function handleSetDateRange(startDate: Date, endDate: Date) {
    dispatch(setDateRange([startDate, endDate]));
  }

  return { startDate, endDate, handleSetDateRange };
}
