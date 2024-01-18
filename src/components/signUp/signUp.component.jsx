import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  signupRequest,
  signupFailure,
  signupSuccess,
} from "../../redux/slice/signupSlice";
import { collection, doc, setDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ButtonComponent from "../Button/button.component";
import InputComponent from "../Input/input.component";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const SignUp = () => {
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup
      .string()
      .email("Email format is not valid")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    dateOfBirth: yup
      .date()
      .max(new Date(), "Date of Birth must not exceed current date")
      .required("Date of Birth is required"),
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [dateOfBirthError, setDateOfBirthError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatar(<img className="signUp_avatar--icon" src={objectUrl} />);
    } else {
      setAvatar(<PersonAddIcon className="signUp_avatar--icon" />);
    }
  }, [avatarFile]);

  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const onSubmit = async (data) => {
    console.log("onSubmit called with data:", data);
    try {
      dispatch(signupRequest());
      console.log("sending sign up request");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("User created:", userCredential);
      const userId = userCredential.user.uid;
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, userId);

      let avatarUrl = null;
      if (avatarFile) {
        // Upload avatar to Firebase Storage
        const storage = getStorage();
        const avatarRef = ref(storage, `avatars/${userId}`);
        const uploadTask = uploadBytesResumable(avatarRef, avatarFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading avatar:", error);
          },
          async () => {
            avatarUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", avatarUrl);

            await setDoc(userDoc, {
              email: userCredential.user.email,
              userName: data.username,
              password: data.password,
              avatar: avatarUrl,
              theme: "default",
              dateOfBirth: data.dateOfBirth,
            });
          }
        );
      } else {
        await setDoc(userDoc, {
          email: userCredential.user.email,
          userName: data.username,
          password: data.password,
          avatar: avatarUrl,
          theme: "default",
          dateOfBirth: data.dateOfBirth,
        });
      }

      dispatch(signupSuccess());
      reset();
      navigate("/");
    } catch (err) {
      console.error("Error in onSubmit:", err.message);
      if (err.code === "auth/email-already-in-use") {
        setEmailError("Email already in use");
      }
      dispatch(signupFailure(err.message));
    }
  };

  return (
    <div className="signUp_container">
      <form className="signUp_form" onSubmit={handleSubmit(onSubmit)}>
        <div className="signUp_avatar">
          <label
            className="signUp_avatar--icon"
            htmlFor="avatar"
            style={{ width: "100px", height: "100px" }}
          >
            {avatar}
          </label>
          <InputComponent
            id="avatar"
            type="file"
            className="inputField"
            style={{ display: "none" }}
            {...register("avatar")}
            placeholder="Avatar"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="form_row">
          <div className="field_pair">
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <label htmlFor="username" className="title--form">
                {t("signUp.userNameLabel")}
              </label>
              <InputComponent
                type="text"
                className="inputField"
                {...register("username", { required: "Please enter username" })}
                placeholder={t("signUp.userNamePlaceholder")}
              />
              <span className="error_text">{errors.username?.message}</span>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <label htmlFor="email" className="title--form">
                {t("signUp.emailLabel")}
              </label>
              <InputComponent
                type="text"
                className="inputField"
                {...register("email", { required: "Please enter email" })}
                placeholder={t("signUp.emailPlaceholder")}
              />
              <span className="error_text">
                {errors.email?.message || emailError}
              </span>
            </div>
          </div>

          <div className="field_pair">
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <label htmlFor="password" className="title--form">
                {t("signUp.passwordLabel")}
              </label>
              <InputComponent
                type="password"
                className="inputField"
                {...register("password", { required: "Please enter password" })}
                placeholder={t("signUp.passwordPlaceholder")}
              />
              <span className="error_text">
                {errors.password?.message || confirmPasswordError}
              </span>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <label htmlFor="confirmPassword" className="title--form">
                Confirm Password
              </label>
              <InputComponent
                type="password"
                className="inputField"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                })}
              ></InputComponent>
              <span className="error_text">
                {errors.confirmPassword?.message || confirmPasswordError}
              </span>
            </div>
          </div>

          <div className="field_pair">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <label htmlFor="dateOfBirth" className="title--form">
                Date of Birth
              </label>
              <InputComponent
                type="date"
                className="inputField"
                placeholder="dateOfBirth"
                {...register("dateOfBirth", {
                  required: "Date of Birth",
                })}
              ></InputComponent>
              <span className="error_text">
                {errors.dateOfBirth?.message || dateOfBirthError}
              </span>
            </div>
          </div>
        </div>

        <ButtonComponent type="submit" className="signUp_button">
          {t("signUp.signUpButton")}
        </ButtonComponent>
        <Link to="/">
          <div className="links_text"> {t("signUp.logInLink")}</div>
        </Link>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default SignUp;
