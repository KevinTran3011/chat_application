import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./slice/signupSlice";
import chatReducer from "./slice/chatSlice";
import authReducer from "./slice/authSlice";

console.log("signupReducer", signupReducer);
console.log("chatReducer", chatReducer);
console.log("authReducer", authReducer);

const store = configureStore({
  reducer: {
    auth: authReducer,
    signUp: signupReducer,
    chat: chatReducer,
  },
});

export default store;
