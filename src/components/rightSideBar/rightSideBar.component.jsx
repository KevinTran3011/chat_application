import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";

const RightSideBar = () => {
  const { userName, avatar } = useSelector(
    (state) => state.targetUser.targetUser
  );
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
            <AccountCircleIcon
              className="rightSideBar_avatar--icon"
              sx={{ width: 200, height: 200 }}
            />
          )}
        </div>
        <div className="header">{userName}</div>
        <div className="rightSideBar_contents">
          <div className="rightSideBar_contents--settings">
            <SettingsIcon sx={{ width: 50, height: 50 }} />
            <div className="settings_text">Settings</div>
          </div>
          <div className="rightSideBar_contents--search">
            <SearchIcon sx={{ width: 50, height: 50 }} />
            <div className="search_text">Search in conversation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
