import { Link } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  updateUserAvatar,
  deleteUserAvatar,
  updateUserName,
} from "../../redux/slice/userSlice";
import InputComponent from "../Input/input.component";
import UpdateIcon from "@mui/icons-material/Update";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import "../../chat-application.scss/main.css";

const Settings = () => {
  const targetUserId = useSelector((state) => state.targetUser.targetUserId);
  const userData = useSelector((state) => state.user.user);
  const [newUserName, setNewUserName] = useState("");
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const dispatch = useDispatch();
  const storage = getStorage();

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateAvatar(userData?.uid, file);
    }
  };

  const handleUpdateAvatarClick = () => {
    fileInputRef.current.click();
  };

  const updateAvatar = async (userId, avatarFile) => {
    const avatarRef = ref(storage, `avatars/${userId}`);
    const uploadTask = uploadBytesResumable(avatarRef, avatarFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading avatar:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            const userDoc = doc(db, "users", userId);
            setDoc(userDoc, { avatar: downloadURL }, { merge: true });
            dispatch(updateUserAvatar(downloadURL));
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const deleteAvatar = async (userId) => {
    const avatarRef = ref(storage, `avatars/${userId}`);
    dispatch(deleteUserAvatar());
    return deleteObject(avatarRef);
  };

  const handleDeleteAvatarWarning = () => {
    Swal.fire({
      title: "Are you sure you want to delete your avatar?",
      subtitle: "The profile can still be re-uploaded",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      preConfirm: () => deleteAvatar(userData?.uid),
    });
  };

  const handleChangeUserName = () => {
    setIsEditingUserName(true);
  };

  const handleUserNameSubmit = (e) => {
    if (e.key === "Enter" && newUserName) {
      const userDoc = doc(db, "users", userData?.uid);
      setDoc(userDoc, { userName: newUserName }, { merge: true });
      dispatch(updateUserName(newUserName));
      console.log("successfully edited the userName to", newUserName);
      setIsEditingUserName(false);
    }
  };

  return (
    <div className="settings_container">
      <div className="settings_form">
        <div className="settings_header">
          <div className="links_container">
            <Link
              className="links_text--room"
              to={
                targetUserId
                  ? `/${userData?.uid}/chats/${targetUserId}`
                  : `/${userData?.uid}/chats/`
              }
            >
              <span>
                <ArrowBackIosIcon></ArrowBackIosIcon>
              </span>{" "}
              Return to chat room
            </Link>
          </div>
          <div className="settings_information">
            <div className="settings_information--avatar">
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

              <div className="settings_information--avatar--update">
                <UpdateIcon onClick={handleUpdateAvatarClick}></UpdateIcon>
                <input
                  type="file"
                  className="settings_information--avatar--input"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <ClearIcon
                  onClick={() => handleDeleteAvatarWarning()}
                ></ClearIcon>
              </div>
            </div>

            <div className="settings_information--name">
              <div className="header">
                Full name :
                {isEditingUserName ? (
                  <InputComponent
                    className="settings_information--name--input"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    onKeyDown={handleUserNameSubmit}
                    placeholder="Enter the new user name"
                  />
                ) : (
                  userData?.userName
                )}
              </div>
              <span
                className="edit_icon"
                onClick={() => {
                  handleChangeUserName();
                }}
              >
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
            <LanguageIcon
              sx={{ width: 50, height: 50, marginBottom: "15px" }}
            />
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
