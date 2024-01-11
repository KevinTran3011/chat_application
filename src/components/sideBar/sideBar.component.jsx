/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { getDocs, collection, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import ChatContacts from "../chatContacts/chatContacts.component";
import InputComponent from "../Input/input.component";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";

const SideBar = ({ onSelectUser }) => {
  const userData = useSelector((state) => state.user.user);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(
        usersCollection.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchUsers();
  }, []);

  const signOutUser = async () => {
    try {
      await auth.signOut();
      console.log("User signed out successfully");
      navigate("/");
    } catch (err) {
      console.log(`Error while attempting to sign out user: ${err.message}`);
    }
  };

  const searchUser = async (event) => {
    const searchValue = event.target.value.toLowerCase();
    const usersCollection = await getDocs(collection(db, "users"));
    const filteredUsers = usersCollection.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter((user) => user.userName.toLowerCase().includes(searchValue));
    setUsers(filteredUsers);
  };

  return (
    <div className="sideBar_container">
      <div className="sideBar_title">
        <div className="sideBar_header">
          <div className="signedInUser_name">{userData.userName}</div>
          <div className="signedInUser_avatar">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            ) : (
              <AccountCircleIcon sx={{ width: 50, height: 50 }} />
            )}
          </div>
        </div>
      </div>
      <div className="sideBar_body">
        <div className="sideBar_body_title">
          <div className="header">Chats</div>
        </div>

        <div className="searchSection" style={{ marginBottom: "15px" }}>
          <InputComponent
            className="search_input"
            type="text"
            placeholder="Search for contacts"
            onChange={searchUser}
          />
        </div>
        <ul>
          {users &&
            users.map((user) => (
              <ChatContacts
                key={user.id}
                id={user.id}
                userName={user.userName}
                onSelectUser={onSelectUser}
                avatar={user.avatar}
              />
            ))}
        </ul>
      </div>
      <div className="sideBar_footer">
        <Link to="/:userId/settings">
          <div className="links_text--room">
            <SettingsIcon className="sideBar_settings--icon" />
            <div className="settings_text">Settings</div>
          </div>
        </Link>
        <div
          className="signOut_button"
          onClick={() => {
            signOutUser();
          }}
        >
          <LogoutIcon className="signOut_icon" />
          <div className="signOut_text">Sign Out</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
