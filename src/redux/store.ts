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

// Fungsi untuk membuat penyimpanan web untuk Redux Persist
const createPersistStorage = (key: string): WebStorage => {
  const isServer = typeof window === 'undefined';
  return createWebStorage(isServer ? 'local' : key);
};

// Konfigurasi Redux Persist
const persistConfig = {
  key: 'root', // Nama kunci untuk penyimpanan
  storage: createPersistStorage('root'), // Menggunakan penyimpanan web
  whitelist: ['app'], // Nama slice yang ingin Anda simpan
};

// Membuat store Redux
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
