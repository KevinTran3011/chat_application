import { Link } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import PaletteIcon from "@mui/icons-material/Palette";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../../chat-application.scss/main.css";

const Settings = () => {
  const userData = useSelector((state) => state.user.user);
  return (
    <div className="settings_container">
      <div className="settings_form">
        <div className="settings_header">
          <div className="links_container">
            <Link className="links_text--room" to="/:userId/chats/">
              <span>
                <ArrowBackIosIcon></ArrowBackIosIcon>
              </span>{" "}
              Return to chat room
            </Link>
          </div>
          <div className="settings_information">
            {userData?.avatar ? (
              <img
                src={userData?.avatar}
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "5px",
                  border: "3px solid #fff",
                }}
              />
            ) : (
              <AccountCircleIcon sx={{ width: 200, height: 200 }} />
            )}

            <div className="settings_information--name">
              Full name : {userData?.userName}
              <span className="edit_icon">
                <EditIcon />
              </span>
            </div>
          </div>
        </div>
        <div className="settings_body">
          <div className="settings_body--language">
            <div className="settings_body--header">
              <div className="header">Change language</div>
            </div>
            <LanguageIcon sx={{ width: 50, height: 50 }} />
            <div className="header">Current language : </div>
          </div>
          <div className="settings_body--theme">
            <div className="settings_body--header">
              <div className="header">
                Change theme{" "}
                <span className="edit_icon">
                  <EditIcon />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
