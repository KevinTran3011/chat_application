import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
const RightSideBar = () => {
  return (
    <div className="sideBar_container">
      <div className="sideBar_title">Right Side bar</div>
      <div className="rightSideBar_body">
        <div className="rightSideBar_avatar">
          <AccountCircleIcon />
        </div>
        <div className="rightSideBar_settings">
          <SettingsIcon />
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
