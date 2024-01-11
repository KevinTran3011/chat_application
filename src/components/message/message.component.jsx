/* eslint-disable react/prop-types */

import { useSelector } from "react-redux";

const Message = ({ message, currentUserId }) => {
  return (
    <div
      className={
        message.userId === currentUserId
          ? "message_container--sender"
          : "message_container--receiver"
      }
    >
      {message.text}
    </div>
  );
};
export default Message;
