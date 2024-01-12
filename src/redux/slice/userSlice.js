import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userRequest: (state) => {
      console.log("Requesting user data");
      state.status = "loading";
      state.error = null;
    },
    userSuccess: (state, action) => {
      console.log("User data received with data : ", action.payload);
      state.status = "success";
      state.error = null;
      state.user = action.payload;
    },
    userFailure: (state, action) => {
      console.log("User data fetching failed with error : ", action.payload);
      state.status = "failed";
      state.error = action.payload;
    },
    userLogout: (state) => {
      state.status = "idle";
      state.error = null;
      state.user = null;
    },
    updateUserAvatar: (state, action) => {
      state.user.avatar = action.payload;
    },
    deleteUserAvatar: (state) => {
      state.user.avatar = null;
    },
  },
});

export const {
  userRequest,
  userSuccess,
  userFailure,
  userLogout,
  updateUserAvatar,
  deleteUserAvatar,
} = userSlice.actions;
export default userSlice.reducer;
