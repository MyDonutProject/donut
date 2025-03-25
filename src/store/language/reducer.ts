import { LanguageActions, LanguageProps, LanguageStatePayload } from './props';

const initialState: LanguageProps = {
  open: false,
};

export default function reducer(
  state: LanguageProps = initialState,
  action: LanguageStatePayload,
): LanguageProps {
  switch (action.type) {
    case LanguageActions.Toggle: {
      return {
        ...state,
        open: !state.open,
      };
    }

    default:
      return state;
  }
}
