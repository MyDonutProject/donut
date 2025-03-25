import {
  AffiliatesFilterActions,
  AffiliatesFilterProps,
  AffiliatesFilterStatePayload,
} from './props';

const initialState: AffiliatesFilterProps = {
  filter: null,
};

export default function affiliatesFilterReducer(
  state: AffiliatesFilterProps = initialState,
  action: AffiliatesFilterStatePayload,
): AffiliatesFilterProps {
  switch (action.type) {
    case AffiliatesFilterActions.SetFilter: {
      return {
        ...state,
        filter: action.payload.filter,
      };
    }

    default:
      return state;
  }
}
