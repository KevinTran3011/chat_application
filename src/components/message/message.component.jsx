/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Message = ({ message, currentUserId }) => {
  const [senderData, setSenderData] = useState(null);
  const userData = useSelector((state) => state.user.user);

  useEffect(() => {
    console.log("Message ID:", message.id);
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
            >
              {message.text}
              {message.file && (
                <a
                  className="message_file_link"
                  href={message.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {message.file}
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
