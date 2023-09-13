import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { WebStorage } from 'redux-persist/lib/types';

import appReducer from '@/redux/slices/appSlice';
import authReducer from '@/redux/slices/authSlice';
import sidebarDropdownReducer from '@/redux/slices/sidebarDropdownSlice';

//! this function fix "redux-persist failed to create sync storage. falling back to noop storage" console error
export function createPersistStorage(): WebStorage {
  const isServer = typeof window === 'undefined';

  // returns noop (dummy) storage.
  if (isServer) {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      },
    };
  }

  return createWebStorage('local');
}

const storage = createPersistStorage();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app'],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  sidebarDropdown: sidebarDropdownReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

const reduxStore = () => ({ store, persistor });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default reduxStore;
