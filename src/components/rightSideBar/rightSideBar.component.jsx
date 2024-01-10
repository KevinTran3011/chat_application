import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";

const RightSideBar = () => {
  return (
    <div className="rightSideBar_container">
      <div className="sideBar_title">Right Side bar</div>
      <div className="rightSideBar_body">
        <div className="rightSideBar_avatar">
          <AccountCircleIcon className="rightSideBar_avatar--icon" />
        </div>
        <div className="rightSideBar_contents">
          <div className="rightSideBar_settings">
            <SettingsIcon />
          </div>
          <div className="rightSideBar_search">
            <SearchIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
