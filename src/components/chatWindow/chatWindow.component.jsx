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
import InputComponent from "../Input/input.component";
import Message from "../message/message.component";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ChatWindow = ({ currentUserId, targetUserId, targetUserName }) => {
  const userData = useSelector((state) => state.user.user);
  const targetUser = useSelector((state) => state.targetUser.targetUser);
  let avatar, userName;
  if (targetUser) {
    avatar = targetUser.avatar;
    userName = targetUser.userName;
  }
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
          targetUserId: targetUserId,
        }
      );

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chatWindow_container">
      <div className="chatWindow_header">
        <div className="chatWindow--title">
          {" "}
          <div className="chatWindow--title_avatar">
            {avatar ? (
              <img
                src={avatar}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            ) : (
              <AccountCircleIcon style={{ fontSize: "50px" }} />
            )}
          </div>
          <div className="chatWindow--title_text">
            <div className="header">{targetUserName}</div>
          </div>
        </div>
      </div>
      <div className="chatWindow--body">
        {!targetUserId ? (
          <div className="chatWindow--empty">
            <div className="chatWindow--empty_icon">
              <ChatIcon style={{ fontSize: "100px" }} />
            </div>
            <div className="chatWindow--empty_text">
              Welcome {userData.userName}, Choose a contact to have a
              conversation
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              currentUserId={currentUserId}
              targetUserId={targetUserId}
            />
          ))
        )}
      </div>

      <div className="chatWindow_input">
        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
          <div className="addIcon">
            <ControlPointIcon></ControlPointIcon>
          </div>
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
          <div className="sendIcon">
            <SendIcon onClick={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
