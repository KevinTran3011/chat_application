/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SweetAlert2 from "react-sweetalert2";

const Message = ({ message, currentUserId, conversationId, searchValue }) => {
  const [senderData, setSenderData] = useState(null);
  const userData = useSelector((state) => state.user.user);
  const theme = useSelector((state) => state.user.theme);

  const isHighlighted =
    searchValue &&
    message.text &&
    message.text.toLowerCase().includes(searchValue.toLowerCase());

  useEffect(() => {
    const fetchSenderData = async () => {
      try {
        const senderDocRef = doc(db, "users", message.userId);
        const senderDocSnap = await getDoc(senderDocRef);
        if (senderDocSnap.exists()) {
          setSenderData(senderDocSnap.data());
        }
      } catch (error) {
        console.error("Error fetching sender data:", error);
      }
    };

    fetchSenderData();
  }, []);

  const renderFile = () => {
    if (message.file) {
      if (message.fileType && message.fileType.startsWith("image")) {
        return (
          <img
            src={message.file}
            alt="Message Attachment"
            style={{ maxWidth: "100%" }}
          />
        );
      } else {
        return (
          <a
            className="message_file_link"
            href={message.file}
            target="_blank"
            rel="noopener noreferrer"
          >
            {message.file}
          </a>
        );
      }
    }
    return null;
  };

  const deleteMessage = async () => {
    if (!message.id) {
      console.log("Cannot delete message: No ID found");
      return;
    }

    try {
      const docRef = await doc(
        db,
        "conversations",
        conversationId,
        "messages",
        message.id
      );
      await deleteDoc(docRef);
      console.log("Message deleted successfully");
    } catch (err) {
      console.log("Error deleting message:", err.message);
    }
  };
  return (
    <div
      className={
        message.userId === currentUserId
          ? "message_container--sender"
          : "message_container--receiver"
      }
    >
      {senderData && (
        <>
          <div className="message_container--avatar">
            {senderData.avatar ? (
              <img
                src={senderData.avatar}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
                alt="Sender Avatar"
              />
            ) : (
              <AccountCircleIcon style={{ fontSize: "40px" }} />
            )}
          </div>
          <div className="message_container--text">
            <div className="message_container--userName">
              {senderData.userName}
            </div>
            <div
              className={
                message.userId === currentUserId
                  ? "message_container--sender_text"
                  : "message_container--receiver_text"
              }
              style={isHighlighted ? { backgroundColor: "yellow" } : {}}
            >
              {message.text}
              {renderFile()}
            </div>
          </div>
          <div className={`message_container--delete theme-${theme}`}>
            {message.userId === currentUserId && (
              <DeleteIcon
                style={{ color: theme === "light" ? "black" : "white" }}
                onClick={deleteMessage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
