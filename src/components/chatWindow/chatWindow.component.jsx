/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  requestConversation,
  fetchMessagesSuccess,
} from "../../redux/slice/chatSlice";
import InputComponent from "../Input/input.component";

import Message from "../message/message.component";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useSelector, useDispatch } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTranslation } from "react-i18next";
import {
  getStorage,
  uploadBytesResumable,
  ref as createStorageRef,
  getDownloadURL,
} from "firebase/storage";

const ChatWindow = ({ currentUserId, targetUserId, searchValue }) => {
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chat);
  const userData = useSelector((state) => state.user.user);
  const targetUser = useSelector((state) => state.targetUser.targetUser);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const ref = useRef(null);
  const storage = getStorage();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { t } = useTranslation();
  const theme = useSelector((state) => state.user.theme);

  // ALWAYS SCROLLED TO THE BOTTOM
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    const timerId = setTimeout(scrollToBottom, 1500);

    return () => clearTimeout(timerId);
  }, [chat.messages]);

  // SET THE USER NAME AND TARGET USER NAME

  let avatar, userName;
  if (targetUser) {
    avatar = targetUser.avatar;
    userName = targetUser.userName;
  }
  const [newMessage, setNewMessage] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

  const getConversationId = (userId1, userId2) => {
    try {
      return userId1 < userId2
        ? `${userId1}_${userId2}`
        : `${userId2}_${userId1}`;
    } catch (error) {
      console.error("Error getting conversation ID:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!currentUserId || !targetUserId) {
          return;
        }

        const conversationId = getConversationId(currentUserId, targetUserId);
        dispatch(requestConversation(conversationId));
        const q = query(
          collection(db, "conversations", conversationId, "messages"),
          orderBy("timestamp")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => {
            const timestamp = doc.data().timestamp;
            return {
              ...doc.data(),
              id: doc.id,
              timestamp:
                timestamp instanceof Date ? timestamp.toISOString() : timestamp,
            };
          });
          dispatch(fetchMessagesSuccess({ messages: data, conversationId }));
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentUserId, targetUserId, dispatch]);

  const handleSendMessage = async () => {
    try {
      if (!currentUserId || !targetUserId) {
        console.log("Invalid parameters for sending message");
        return;
      }

      const conversationId = getConversationId(currentUserId, targetUserId);

      let file = null;
      if (fileInputRef.current.files.length > 0) {
        file = fileInputRef.current.files[0];
      }

      let fileUrl = null;
      if (file) {
        const storageRef = createStorageRef(storage, "chatFiles/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        if (file.type.startsWith("image")) {
          setImagePreviewUrl(URL.createObjectURL(file));
        }

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              console.error("Error uploading file:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("File available at", downloadURL);
                fileUrl = downloadURL;
                resolve();
              });
            }
          );
        });
      }

      if (newMessage || file) {
        let messageContent = {};
        if (file) {
          const fileType = file.type;
          if (fileType.startsWith("image")) {
            messageContent = {
              file: fileUrl,
              text: null,
              fileType: fileType,
            };
          } else {
            messageContent = {
              file: fileUrl,
              text: newMessage,
              fileType: fileType,
            };
          }
        } else {
          messageContent = {
            text: newMessage,
          };
        }

        await addDoc(
          collection(db, "conversations", conversationId, "messages"),
          {
            ...messageContent,
            timestamp: new Date(),
            userId: currentUserId,
            targetUserId: targetUserId,
          }
        );

        setNewMessage("");
        setFileUrl(null);
        fileInputRef.current.value = "";
        setImagePreviewUrl(null);
        setFileName("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    if (file.type.startsWith("image")) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className={`chatWindow_container theme-${theme}`}>
      <div className="chatWindow_header">
        <div className={`chatWindow--title theme-${theme}`}>
          {" "}
          <div className="chatWindow--title_avatar">
            {avatar ? (
              <img
                src={avatar}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            ) : (
              <AccountCircleIcon style={{ fontSize: "50px" }} />
            )}
          </div>
          <div className="chatWindow--title_text">
            <div className="header">{userName}</div>
          </div>
        </div>
      </div>
      <div className="chatWindow--body" ref={ref}>
        {!targetUserId ? (
          <div className="chatWindow--empty">
            <div className="chatWindow--empty_icon">
              <ChatIcon style={{ fontSize: "100px" }} />
            </div>
            <div className="chatWindow--empty_text">
              {t("chatWindow.welcome")} {userData.userName},
              {t("chatWindow.prompt")}
            </div>
          </div>
        ) : (
          chat.messages &&
          chat.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              currentUserId={currentUserId}
              targetUserId={targetUserId}
              conversationId={chat.conversationId}
              searchValue={searchValue}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatWindow_input">
        {imagePreviewUrl && (
          <img src={imagePreviewUrl} alt="Preview" className="imagePreview" />
        )}
        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
          <div className="addIcon">
            <ControlPointIcon onClick={() => fileInputRef.current.click()} />{" "}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
          <InputComponent
            type="text"
            name="newMessage"
            className="inputField"
            value={newMessage || fileName}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </div>
        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
          <div className="sendIcon">
            <SendIcon onClick={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
