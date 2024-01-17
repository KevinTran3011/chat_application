// chatRoom.component.jsx

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import {
  targetUserFailure,
  targetUserRequest,
  targetUserSuccess,
} from "../../redux/slice/targetUserSlice";
import SideBar from "../sideBar/sideBar.component";
import ChatWindow from "../chatWindow/chatWindow.component";
import RightSideBar from "../rightSideBar/rightSideBar.component";
import "../../chat-application.scss/main.css";

const ChatRoom = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const targetUser = useSelector((state) => state.targetUser);
  const navigate = useNavigate();
  const { targetUserId, targetUserName, targetUserAvatar } = targetUser;
  const [searchValue, setSearchValue] = useState("");
  const userAvatar = targetUserAvatar ? targetUserAvatar : <PersonIcon />;
  const theme = useSelector((state) => state.user.theme);

  // New state for users
  const [users, setUsers] = useState([]);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      setUsers(usersSnapshot.docs.map((doc) => doc.data()));
    };

    fetchUsers();
  }, []);

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

  // New function to handle when a message is sent
  const handleMessageSend = () => {
    console.log("handleMessageSend called");
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter(
        (user) => user && user.id !== targetUserId
      );
      const currentUser = prevUsers.find(
        (user) => user && user.id === targetUserId
      );

      if (currentUser) {
        return [currentUser, ...updatedUsers];
      } else {
        return updatedUsers;
      }
    });
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
            users={users}
            setUsers={setUsers}
            onMessageSend={handleMessageSend}

            // Pass the users state as a prop
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
            onMessageSend={handleMessageSend} // Pass the handleMessageSend function as a prop
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
