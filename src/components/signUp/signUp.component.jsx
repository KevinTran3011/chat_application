import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
// import InputComponent from "../Input/input.component";
import ButtonComponent from "../Button/button.component";
import InputComponent from "../Input/input.component";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { register, handleSubmit, reset, control } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      // Upload avatar to Firebase Storage
      const storage = getStorage();
      const avatarRef = ref(storage, `avatars/${userId}`);
      const uploadTask = uploadBytesResumable(avatarRef, data.avatar[0]);

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
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            setDoc(userDoc, {
              email: userCredential.user.email,
              userName: data.username,
              password: data.password,
              avatar: downloadURL,
            });
          });
        }
      );

      dispatch(signupSuccess());
      reset();
      navigate("/");
    } catch (err) {
      console.error("Error in onSubmit:", err.message);
      if (err.message.includes("email-already-in-use")) {
        alert("Email already in use");
        reset();
      }
      dispatch(signupFailure(err.message));
    }
  };

  return (
    <div className="signUp_container">
      <form className="signUp_form" onSubmit={handleSubmit(onSubmit)}>
        <div className="signUp_avatar">
          <label className="signUp_avatar--icon" htmlFor="avatar">
            <PersonAddIcon className="signUp_avatar--icon" />
          </label>
          <InputComponent
            id="avatar"
            type="file"
            className="inputField"
            style={{ display: "none" }}
            {...register("avatar", { required: "Please upload an avatar" })}
            placeholder="Avatar"
          />
        </div>

        <label htmlFor="username" className="title--form">
          Username
        </label>
        <InputComponent
          type="text"
          className="inputField"
          {...register("username", { required: "Please enter username" })}
          placeholder="Username"
        />
        <label htmlFor="email" className="title--form">
          Email
        </label>

        <InputComponent
          type="email"
          className="inputField"
          {...register("email", { required: "Please enter email" })}
          placeholder="Email"
        />
        <label htmlFor="password" className="title--form">
          Password
        </label>

        <InputComponent
          type="password"
          className="inputField"
          {...register("password", { required: "Please enter password" })}
          placeholder="Password"
        />

        <ButtonComponent type="submit" className="signUp_button">
          Sign Up
        </ButtonComponent>
        <Link to="/">
          <div className="links_text">Have an account? Sign In</div>
        </Link>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default SignUp;
