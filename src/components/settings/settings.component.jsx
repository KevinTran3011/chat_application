import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="settings_container">
      Settings
      <Link to="/:userId/chats/">Back to chat room</Link>
    </div>
  );
};

export default Settings;
