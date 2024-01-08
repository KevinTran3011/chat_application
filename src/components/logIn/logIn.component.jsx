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
import { auth } from "../../firebase";
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

  const onSubmit = async (data) => {
    console.log("onSubmit called with data:", data);

    try {
      dispatch(signinRequest());
      const userCredential = await signInWithEmailAndPassword({
        auth,
        email: data.email,
        password: data.password,
      });
      console.log(`Attempting to sign in user: ${userCredential}`);

      dispatch(signinSuccess(userCredential));
      reset();
    } catch (err) {
      console.log(`Error while logging in user: ${err.message}`);
      dispatch(signinFailure(err.message));
    }
  };
  return (
    <div className="Login_container">
      <form className="Login_form" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent
          ref={register}
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        ></InputComponent>
        <InputComponent
          ref={register}
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        ></InputComponent>

        <ButtonComponent type="submit">Log In</ButtonComponent>
        <Link to="/signUp">Sign Up</Link>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default LogIn;
