import { AffiliatesFilterActions, AffiliatesFilterStatePayload } from './props';

export function setFilter(filter: string): AffiliatesFilterStatePayload {
  return {
    type: AffiliatesFilterActions.SetFilter,
    payload: {
      filter,
    },
  };
}
