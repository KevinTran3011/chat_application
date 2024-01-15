/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import { targetUserSuccess } from "../../redux/slice/targetUserSlice";
import { ControlCameraSharp } from "@mui/icons-material";

const RightSideBar = ({ onSearchChange }) => {
  const dispatch = useDispatch();
  const targetUser = useSelector((state) => state.targetUser.targetUser);
  const userData = useSelector((state) => state.user.user);
  const [newNickname, setNewNickname] = useState("");
  const [searchValue, setSearchValue] = useState("");

  let avatar, userName;
  if (targetUser) {
    avatar = targetUser.avatar;
    userName = targetUser.nickname ? targetUser.nickname : targetUser.userName;
  }

  const handleSearchChange = (e) => {
    const newSearchValue = e.target.value;
    setSearchValue(newSearchValue);
    onSearchChange(newSearchValue);

    if (newSearchValue === "") {
      setSearchValue("");
      onSearchChange("");
    }
  };

  return (
    <div className="rightSideBar_container">
      <div className="rightSideBar_body">
        <div className="rightSideBar_avatar">
          {avatar ? (
            <img
              src={avatar}
              style={{ width: "170px", height: "170px", borderRadius: " 50%" }}
            />
          ) : (
            <AccountCircleIcon className="rightSideBar_avatar--icon" />
          )}
        </div>
        <div className="header">{userName}</div>
        {/* <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
        />
        <button onClick={() => handleSetNickname(newNickname)}>
          Set Nickname
        </button> */}
        <div className="rightSideBar_contents">
          <div className="rightSideBar_contents--settings">
            <SettingsIcon sx={{ width: 50, height: 50 }} />
            <div className="header">Settings</div>
          </div>
          <div className="rightSideBar_contents--search">
            <SearchIcon sx={{ width: 50, height: 50 }} />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange} // Use the new handler function
              placeholder="Search messages"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
