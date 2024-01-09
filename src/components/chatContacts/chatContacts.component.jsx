/* eslint-disable react/prop-types */
// chatContacts.component.jsx

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import "bootstrap/dist/css/bootstrap.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ChatContacts = ({ id, userName, onSelectUser }) => {
  return (
    <div className="chatContacts_container">
      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
        <div className="chatContacts_avatar">
          <AccountCircleIcon sx={{ width: 30, height: 30 }} />
        </div>
      </div>
      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
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
