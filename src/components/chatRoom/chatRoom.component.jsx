// chatRoom.component.jsx

import React, { useEffect, useState } from "react";
import ChatWindow from "../chatWindow/chatWindow.component";
import "../../chat-application.scss/main.css";
import SideBar from "../sideBar/sideBar.component";
import RightSideBar from "../rightSideBar/rightSideBar.component";
import { useSelector } from "react-redux";

const ChatRoom = () => {
  const userData = useSelector((state) => state.auth.user);
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUserName, setTargetUserName] = useState(null);

  const handleSelectUser = (userId, userName) => {
    setTargetUserId(userId);
    setTargetUserName(userName);
  };

  return (
    <div className="chatRoom_container">
      <div className="chatRoom-header">
        <div className="title">
          Welcome, pick a chat to start a conversation
        </div>
      </div>
      <div
        className="chatRoom-body"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <SideBar onSelectUser={handleSelectUser} />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <ChatWindow
            currentUserId={userData?.uid} // Changed from userData?.id to userData?.uid
            targetUserId={targetUserId}
            targetUserName={targetUserName}
            userName={userData?.userName}
          />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
