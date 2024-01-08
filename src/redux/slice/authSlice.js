import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    signinRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signinSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload;
    },
    signinFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    signoutFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signinRequest,
  signinSuccess,
  signinFailure,
  signoutSuccess,
  signoutFailure,
} = authSlice.actions;
export default authSlice.reducer;
