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
  },
});

export const { targetUserRequest, targetUserSuccess, targetUserFailure } =
  targetUserSlice.actions;
export default targetUserSlice.reducer;
