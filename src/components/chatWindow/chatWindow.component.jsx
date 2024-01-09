/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import SendIcon from "@mui/icons-material/Send";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import InputComponent from "../Input/input.component";

const ChatWindow = ({ currentUserId, targetUserId, targetUserName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!currentUserId || !targetUserId) {
          return;
        }

        const conversationId = getConversationId(currentUserId, targetUserId);

        const q = query(
          collection(db, "conversations", conversationId, "messages"),
          orderBy("timestamp")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessages(data);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentUserId, targetUserId]);

  const getConversationId = (userId1, userId2) => {
    try {
      return userId1 < userId2
        ? `${userId1}_${userId2}`
        : `${userId2}_${userId1}`;
    } catch (error) {
      console.error("Error getting conversation ID:", error);
    }
  };

  const handleSendMessage = async () => {
    console.log("currentUserId:", currentUserId);
    console.log("targetUserId:", targetUserId);
    console.log("newMessage:", newMessage);

    try {
      if (!currentUserId || !targetUserId || !newMessage) {
        console.log("Invalid parameters for sending message");
        return;
      }

      const conversationId = getConversationId(currentUserId, targetUserId);

      await addDoc(
        collection(db, "conversations", conversationId, "messages"),
        {
          text: newMessage,
          timestamp: new Date(),
          userId: currentUserId,
        }
      );

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chatWindow_container">
      <h2> {targetUserName}</h2>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.text}</p>
        </div>
      ))}
      <div className="chatWindow_input">
        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
          <ControlPointIcon></ControlPointIcon>
        </div>
        <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
          <InputComponent
            type="text"
            name="newMessage"
            className="inputField"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </div>
        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
          <SendIcon onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
