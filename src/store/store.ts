/* Библиотеки */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

/* Контекст */
import messageQueueReducer from "./reducers/MessageQueueSlice";
import imageUploadingReducer from "./reducers/ImageUploadingSlice";
import imageSlice from "./reducers/ImageSlice";
import StoreConstants from "src/constants/store";

/* Главный Reducer */
const rootReducer = combineReducers({
  messageQueueReducer,
  imageUploadingReducer,
  imageSlice
});

// Конфигурация Persist
const persistConfig = {
  key: StoreConstants.mainStore,
  storage,
  blacklist: [
    "messageQueueReducer",
    "imageUploadingReducer",
    "imageSlice"
  ],
};

// Создание Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Конфигурирование общего хранилища
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const setupStore = () => {
  return store;
};

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
