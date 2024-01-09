/* eslint-disable react/prop-types */
// chatContacts.component.jsx

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import "bootstrap/dist/css/bootstrap.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ChatContacts = ({ id, userName, onSelectUser }) => {
  return (
    <div className="chatContacts_container">
      <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <div className="chatContacts_avatar">
          <AccountCircleIcon sx={{ width: 30, height: 30 }} />
        </div>
      </div>
      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
        <div
          className="chatContacts_name"
          onClick={() => onSelectUser(id, userName)}
        >
          <div className="link_text">{userName}</div>
        </div>
      </div>
      <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <NotificationsActiveIcon />
      </div>
    </div>
  );
};

export default ChatContacts;
