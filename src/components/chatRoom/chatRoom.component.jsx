// chatRoom.component.jsx

import ChatWindow from "../chatWindow/chatWindow.component";
import "../../chat-application.scss/main.css";
import SideBar from "../sideBar/sideBar.component";
import RightSideBar from "../rightSideBar/rightSideBar.component";
import {
  targetUserFailure,
  targetUserRequest,
  targetUserSuccess,
} from "../../redux/slice/targetUserSlice";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { useDispatch } from "react-redux";
import { getDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useState } from "react";

const ChatRoom = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const targetUser = useSelector((state) => state.targetUser);
  const navigate = useNavigate();
  const { targetUserId, targetUserName, targetUserAvatar } = targetUser;
  const [searchValue, setSearchValue] = useState("");
  const userAvatar = targetUserAvatar ? targetUserAvatar : <PersonIcon />;
  const theme = useSelector((state) => state.user.theme);

  const handleSelectUser = async (userId, userName) => {
    dispatch(targetUserRequest({ userId, userName, userAvatar }));

    try {
      const targetedUserDoc = await getDoc(doc(db, "users", userId));
      const targetedUserData = targetedUserDoc.data();

      dispatch(targetUserSuccess(targetedUserData));
      navigate(`/${userData.uid}/chats/${targetUserId}`);
    } catch (error) {
      dispatch(targetUserFailure(error));
    }
  };

  return (
    <div className={`chatRoom_container theme-${theme}`}>
      <div
        className="chatRoom-body"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <SideBar
            onSelectUser={handleSelectUser}
            avatar={userData?.avatar}
            currentUserId={userData?.uid}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <ChatWindow
            currentUserId={userData?.uid}
            targetUserId={targetUserId}
            targetUserName={targetUserName}
            targetedUserAvatar={targetUserAvatar}
            userName={userData?.userName}
            avatar={userData?.avatar}
            searchValue={searchValue}
          />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <RightSideBar onSearchChange={setSearchValue} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
