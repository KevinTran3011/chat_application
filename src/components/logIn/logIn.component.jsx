import { useForm } from "react-hook-form";
import InputComponent from "../Input/input.component";
import ButtonComponent from "../Button/button.component";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useDispatch } from "react-redux";
import {
  signinRequest,
  signinFailure,
  signinSuccess,
  signoutFailure,
  signoutSuccess,
} from "../../redux/slice/authSlice";
import PersonIcon from "@mui/icons-material/Person";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../chat-application.scss/main.css";
import { DevTool } from "@hookform/devtools";
import { Link } from "react-router-dom";
import { Input } from "@mui/icons-material";

const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { error },
    reset,
    control,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("onSubmit called with data:", data);

    try {
      dispatch(signinRequest());
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(`Attempting to sign in user: ${userCredential}`);

      // Extract only the necessary data
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        userName: userCredential.user.userName,
      };

      dispatch(signinSuccess(userData));
      console.log("User logged in successfully");
      navigate(`/${userData.uid}/chats/`);
      reset();
    } catch (err) {
      console.log(`Error while logging in user: ${err.message}`);
      dispatch(signinFailure(err.message));
    }
  };
  return (
    <div className="logIn_container">
      <form className="logIn_form" onSubmit={handleSubmit(onSubmit)}>
        <div className="logIn_avatar">
          <PersonIcon className="logIn_avatar--icon" />
        </div>
        <label htmlFor="email" className="title--form">
          Email
        </label>
        <InputComponent
          type="email"
          className="inputField"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        <label htmlFor="password" className="title--form">
          Password
        </label>

        <InputComponent
          ref={register}
          type="password"
          className="inputField"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        ></InputComponent>

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
