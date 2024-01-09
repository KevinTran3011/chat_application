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
          <AccountCircleIcon />
        </div>
      </div>
      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
        <div
          className="chatContacts_name"
          onClick={() => onSelectUser(id, userName)}
        >
          <div className="header">{userName}</div>
        </div>
      </div>
      <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <NotificationsActiveIcon />
      </div>
    </div>
  );
};

export default ChatContacts;
