// import storage from "redux-persist/lib/storage";
// import storage from "redux-persist/lib/storage/session";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("session")
    : createNoopStorage();

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import settingReducer from "./slice/setting";
import dynamicDataReducer from "./slice/dynamicData";
import extraCartReducer from "./slice/extraCart";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storage,
};

const rootReducer = combineReducers({
  setting: settingReducer,
  data: dynamicDataReducer,
  extraCart: extraCartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default reduxStore;
