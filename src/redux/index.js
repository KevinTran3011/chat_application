// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import storage from "../storage";
import signupReducer from "./slice/signupSlice";
import chatReducer from "./slice/chatSlice";
import authReducer from "./slice/authSlice";
import userReducer from "./slice/userSlice";
import targetUserReducer from "./slice/targetUserSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  signUp: signupReducer,
  chat: chatReducer,
  user: userReducer,
  targetUser: targetUserReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
