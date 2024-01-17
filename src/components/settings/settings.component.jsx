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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateIcon from "@mui/icons-material/Update";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { changeTheme } from "../../redux/slice/userSlice";
import "../../chat-application.scss/main.css";

const Settings = () => {
  const targetUserId = useSelector((state) => state.targetUser.targetUserId);
  const userData = useSelector((state) => state.user.user);
  const userDocRef = doc(db, "users", userData?.uid);
  const [newUserName, setNewUserName] = useState("");
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const dispatch = useDispatch();
  const storage = getStorage();
  const [languageIsOpen, setLanguageIsOpen] = useState(false);
  const theme = useSelector((state) => state.user.theme);
  const { t, i18n } = useTranslation();

  const locales = {
    en: { title: "English" },
    vi: { title: "Vietnamese" },
  };

  const showAvatarUpdateMessageSuccess = () => {
    toast.success("Successfully updated the avatar", {
      position: "bottom-center",
      theme: "dark",
      autoClose: 1000,
    });
  };

  const fileInputRef = useRef(null);

  const handleThemeChange = async (newTheme) => {
    dispatch(changeTheme(newTheme));

    try {
      await setDoc(userDocRef, { theme: newTheme }, { merge: true });
      console.log("successfully changed the theme to", newTheme);
      console.log("userData.theme is", userData);
    } catch (err) {
      console.log("error while changing the theme", err.message);
    }
  };

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
            showAvatarUpdateMessageSuccess();

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
    <div className={`settings_container theme-${theme}`}>
      {" "}
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
              {t("settings.chatRoomLinks")}
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
              <ToastContainer />
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
                {t("settings.nameLable")} :
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
              <div className="header">{t("settings.language")}</div>
            </div>
            <LanguageIcon
              sx={{ width: 50, height: 50, marginBottom: "15px" }}
              onClick={() => setLanguageIsOpen(!languageIsOpen)}
            />
            {languageIsOpen
              ? Object.keys(locales).map((locale) => (
                  <li key={locale} className="language_selector">
                    <button
                      className="modified_button--language"
                      style={{
                        fontWeight:
                          i18n.resolvedLanguage === locale ? "bold" : "normal",
                        color:
                          i18n.resolvedLanguage === locale ? "white" : "black",
                      }}
                      type="submit"
                      onClick={() => i18n.changeLanguage(locale)}
                    >
                      {locales[locale].title}
                    </button>
                  </li>
                ))
              : null}
            <div className="header">Current language :</div>
          </div>
          <div className="settings_body--theme">
            <div className="settings_body--header">
              <div className="header">
                Change theme{" "}
                <span className="edit_icon">
                  <EditIcon />
                </span>
              </div>
              <button onClick={() => handleThemeChange("default")}>
                Default Theme
              </button>
              <button onClick={() => handleThemeChange("light")}>
                Light Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
