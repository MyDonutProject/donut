import { notificationsReducer } from "@/store/notifications";
import { combineReducers } from "redux";
import affiliatesFilterReducer from "./affiliates/reducer";
import dateFilterReducer from "./date-filter/reducer";
import hermesReducer from "./hermes/reducer";
import languageReducer from "./language/reducer";
import themeReducer from "./theme/reducer";

const rootReducer = combineReducers({
  theme: themeReducer,
  language: languageReducer,
  notifications: notificationsReducer,
  dateFilter: dateFilterReducer,
  affiliatesFilter: affiliatesFilterReducer,
  hermes: hermesReducer,
});

export default rootReducer;
