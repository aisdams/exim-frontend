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

const createPersistStorage = (key: string): WebStorage => {
  const isServer = typeof window === 'undefined';
  return createWebStorage(isServer ? 'local' : key);
};

// Konfigurasi Redux Persist
const persistConfig = {
  key: 'root',
  storage: createPersistStorage('root'),
  whitelist: ['app'],
};

const rootReducer = combineReducers({
  app: persistReducer(persistConfig, appReducer),
  // Tambahkan reducer lain jika diperlukan
});

// Membuat store Redux
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Membuat persistor untuk Redux Persist
const persistor = persistStore(store);

const reduxStore = () => ({ store, persistor });

// Ekspor AppDispatch dan RootState
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export { store, persistor };

export default reduxStore;
