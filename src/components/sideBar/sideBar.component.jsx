/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import ChatContacts from "../chatContacts/chatContacts.component";
import InputComponent from "../Input/input.component";
import SettingsIcon from "@mui/icons-material/Settings";
import LanguageIcon from "@mui/icons-material/Language";

const SideBar = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(
        usersCollection.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchUsers();
  }, []);

  return (
    <div className="sideBar_container">
      <div className="sideBar_title">
        <div className="header">Side bar</div>
        <div className="searchSection">
          <InputComponent type="text" placeholder="Search" />
        </div>
      </div>
      <div className="sideBar_body">
        <div className="sideBar_body_title">
          <div className="header">Chats</div>
        </div>
        <ul>
          {users &&
            users.map((user) => (
              <ChatContacts
                key={user.id}
                id={user.id}
                userName={user.userName}
                onSelectUser={onSelectUser}
              />
            ))}
        </ul>
      </div>
      <div className="sideBar_footer">
        <div className="sideBar_footer--settings">
          <SettingsIcon />
        </div>
        <div className="sideBar_footer--language">
          <LanguageIcon />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
