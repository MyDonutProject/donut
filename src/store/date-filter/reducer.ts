import {
  DateFilterActions,
  DateFilterProps,
  DateFilterStatePayload,
} from './props';

const endDate = new Date();
endDate.setHours(0, 0, 0, 0);

const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const initialState: DateFilterProps = {
  startDate,
  endDate,
};

export default function dateFilterReducer(
  state: DateFilterProps = initialState,
  action: DateFilterStatePayload,
): DateFilterProps {
  switch (action.type) {
    case DateFilterActions.SetDateRange: {
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      };
    }

    default:
      return state;
  }
}
