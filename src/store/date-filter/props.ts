export type DateFilterProps = {
  startDate: Date;
  endDate: Date;
};

export enum DateFilterActions {
  SetDateRange = 'date-filter/set-date-range',
}

export interface DateFilterBasePayload<T extends DateFilterActions, V = null> {
  type: T;
  payload: V;
}

export type DateFilterStatePayload = DateFilterBasePayload<
  DateFilterActions.SetDateRange,
  DateFilterProps
>;
