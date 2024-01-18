/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";

const RightSideBar = ({ onSearchChange }) => {
  const targetUser = useSelector((state) => state.targetUser.targetUser);
  const theme = useSelector((state) => state.user.theme);
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
    <div className={`rightSideBar_container theme-${theme}`}>
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

        <div className="rightSideBar_contents">
          <div className="rightSideBar_contents--search">
            <SearchIcon sx={{ width: 50, height: 50 }} />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search messages"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
