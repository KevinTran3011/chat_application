import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  targetUser: null,
  targetUserId: null,
  targetUserName: null,
  status: "idle",
  error: null,
};

const targetUserSlice = createSlice({
  name: "targetUser",
  initialState,
  reducers: {
    targetUserRequest: (state, action) => {
      state.status = "loading";
      state.error = null;
      state.targetUserId = action.payload.userId;
      state.targetUserName = action.payload.userName;
      state.targetUserAvatar = action.payload.avatar;

      console.log("targetUserRequest", action.payload);
    },
    targetUserSuccess: (state, action) => {
      state.status = "success";
      state.error = null;
      state.targetUser = action.payload;
      console.log("targetUserSuccess", action.payload);
    },
    targetUserFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    targetUserLogout: (state) => {
      state.status = "idle";
      state.error = null;
      state.targetUser = null;
      state.targetUserId = null;
      state.targetUserName = null;
      state.targetUserAvatar = null;
    },
  },
});

export const {
  targetUserRequest,
  targetUserSuccess,
  targetUserFailure,
  targetUserLogout,
} = targetUserSlice.actions;
export default targetUserSlice.reducer;
