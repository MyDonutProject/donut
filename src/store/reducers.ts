import { combineReducers } from 'redux';
import themeReducer from './theme/reducer';
import languageReducer from './language/reducer';
import { notificationsReducer } from '@/store/notifications';
import dateFilterReducer from './date-filter/reducer';
import affiliatesFilterReducer from './affiliates/reducer';

const rootReducer = combineReducers({
  theme: themeReducer,
  language: languageReducer,
  notifications: notificationsReducer,
  dateFilter: dateFilterReducer,
  affiliatesFilter: affiliatesFilterReducer,
});

export default rootReducer;
