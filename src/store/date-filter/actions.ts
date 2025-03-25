import { DateRange } from '@mui/x-date-pickers-pro';
import { DateFilterActions, DateFilterStatePayload } from './props';

export function setDateRange(range: DateRange<Date>): DateFilterStatePayload {
  return {
    type: DateFilterActions.SetDateRange,
    payload: {
      startDate: range[0],
      endDate: range[1],
    },
  };
}
