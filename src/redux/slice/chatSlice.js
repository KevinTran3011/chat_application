import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [], conversationId: null },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
    requestConversation: (state) => {
      state.messages = [];
      state.conversationId = null;
      console.log("requestConversation");
    },
    fetchMessagesSuccess: (state, action) => {
      state.messages = action.payload.messages.map((message) => ({
        ...message,
        timestamp: message.timestamp.toDate(),
      }));
      state.conversationId = action.payload.conversationId;
      console.log("fetchMessagesSuccess", action.payload);
    },
  },
});

export const {
  addMessage,
  removeMessage,
  requestConversation,
  fetchMessagesSuccess,
} = chatSlice.actions;

export default chatSlice.reducer;
