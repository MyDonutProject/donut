import { applyMiddleware, legacy_createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { createWrapper } from 'next-redux-wrapper';
import { Setting } from '@/models/setting';
import { ThemeType } from '@/enums/theme';

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  const initialState: Partial<RootState> = {
    theme: {
      setting: {} as Setting,
      type: ThemeType.dark,
    },
    ...preloadedState,
  };

  if (typeof window !== 'undefined') {
    if (window.initialState) {
      initialState.theme.setting = JSON.parse(
        JSON.stringify(window.initialState),
      );
    }
  }

  const sagaMiddleware = createSagaMiddleware();
  const store = legacy_createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );

  return store;
}

export type RootStore = ReturnType<typeof makeStore>;
export let store: RootStore | undefined = makeStore();

export function getStore() {
  if (!store) {
    store = makeStore();
  }

  return store;
}

export const wrapper = createWrapper<Store<RootState>>(getStore, {
  debug: process.env.NODE_ENV == 'development',
});
