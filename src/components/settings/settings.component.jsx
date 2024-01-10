import { Link } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";

const Settings = () => {
  return (
    <div className="settings_container">
      <div className="settings_header">
        <div className="settings_header--back">
          <Link to="/:userId/chats/">
            <span>
              <ArrowBackIosIcon></ArrowBackIosIcon>
            </span>{" "}
            Return to chat room
          </Link>
        </div>
        <div className="settings_header--title">Settings</div>
      </div>
      <div className="settings_body">
        <div className="settings_body--language">
          <LanguageIcon />
          <div className="settings_body--language--title">Language</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
