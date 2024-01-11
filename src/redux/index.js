// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import signupReducer from "./slice/signupSlice";
import chatReducer from "./slice/chatSlice";
import authReducer from "./slice/authSlice";
import userReducer from "./slice/userSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    signUp: signupReducer,
    chat: chatReducer,
    user: userReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
