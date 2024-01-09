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
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";

import { DevTool } from "@hookform/devtools";
import { Link } from "react-router-dom";

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
    <div className="Login_container">
      <form className="Login_form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        <label htmlFor="password">Password</label>

        <input
          ref={register}
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        ></input>

        <ButtonComponent type="submit">Log In</ButtonComponent>
        <Link to="/signUp">Sign Up</Link>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default LogIn;
