import SignIn from "./SignIn";
import Register from "./Register";
import getFormData from "get-form-data";
import { auth, db } from "../config/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useStore } from "../User";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const setUser = useStore((state) => state.setUser);
  const provider = new GoogleAuthProvider();

  const register = async (e) => {
    e.preventDefault();
    const { username, emailRegister, passwordRegister } = getFormData(e.target);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailRegister,
        passwordRegister
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      const userId = user.uid;
      if (!userId) throw new Error("User ID is not available.");
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { id: userId });
      setUser(user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sign = async (e) => {
    e.preventDefault();
    const { email, password } = getFormData(e.target);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      const userId = user.uid;
      if (!userId) throw new Error("User ID is not available.");
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { id: userId });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col mt-5 md:flex-row md:mt-0 items-center gap-5">
      <ToastContainer position="top-center" />
      <SignIn sign={sign} googleLogin={googleLogin} />
      <span className="text-white">or</span>
      <Register register={register} googleLogin={googleLogin} />
    </div>
  );
};

export default Login;
