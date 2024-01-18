import { useForm } from "react-hook-form";
import { useState } from "react";
import InputComponent from "../Input/input.component";
import ButtonComponent from "../Button/button.component";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useDispatch } from "react-redux";
import { getDoc, doc } from "firebase/firestore";
import {
  signinRequest,
  signinFailure,
  signinSuccess,
} from "../../redux/slice/authSlice";
import {
  userRequest,
  userSuccess,
  userFailure,
} from "../../redux/slice/userSlice";
import PersonIcon from "@mui/icons-material/Person";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { changeTheme } from "../../redux/slice/userSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "../../chat-application.scss/main.css";
import { DevTool } from "@hookform/devtools";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LogIn = () => {
  const schema = yup.object({
    email: yup
      .string()
      .email("Email format is not valid")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const { t, i18n } = useTranslation();

  const onSubmit = async (data) => {
    console.log("onSubmit called with data:", data);

    try {
      dispatch(signinRequest());
      dispatch(userRequest());
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(`Attempting to sign in user: ${userCredential}`);

      // FETCH THE DATA OF THE LOGGED IN USER
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userData.uid = userCredential.user.uid;
        const theme = userData.theme;
        dispatch(changeTheme(theme));
        dispatch(signinSuccess(userData));
        dispatch(userSuccess(userData));
        navigate(`/${userData.uid}/chats/`);
      } else {
        console.log("User does not exist");
      }

      console.log("User logged in successfully");
      reset();
    } catch (err) {
      console.log(`Error while logging in user: ${err.code}`);
      if (err.code === "auth/invalid-credential") {
        setPasswordError("Invalid email or password");
        setEmailError("Invalid email or password");
      }
      dispatch(signinFailure(err.message));
      dispatch(userFailure(err.message));
    }
  };
  return (
    <div className="logIn_container">
      <form className="logIn_form" onSubmit={handleSubmit(onSubmit)}>
        <div className="logIn_avatar">
          <PersonIcon className="logIn_avatar--icon" />
        </div>
        <label htmlFor="email" className="title--form">
          {t("logIn.emailLabel")}
        </label>
        <InputComponent
          type="email"
          className="inputField"
          placeholder={t("logIn.emailPlaceholder")}
          {...register("email", { required: "Email is required" })}
        />
        <span className="error_text">
          {errors.email?.message || emailError}
        </span>{" "}
        <label htmlFor="password" className="title--form">
          {t("logIn.passwordLabel")}{" "}
        </label>
        <InputComponent
          ref={register}
          type="password"
          className="inputField"
          placeholder={t("logIn.passwordPlaceholder")}
          {...register("password", { required: "Password is required" })}
        ></InputComponent>
        <span className="error_text">
          {errors.password?.message || passwordError}
        </span>
        <ButtonComponent className="logIn_button" type="submit">
          <div className="title--form">Log In</div>
        </ButtonComponent>
        <Link to="/signUp">
          <div className="links_text">Don't have an account ? Sign up</div>
        </Link>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default LogIn;
