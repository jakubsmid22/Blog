import { IoIosLogOut } from "react-icons/io";
import { useStore } from "../User";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import Nav from "./Nav";

const Header = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <header className="flex flex-col gap-5 items-center">
      <div className="relative flex w-full justify-between items-center py-2 px-5 font-bold">
        <p>{user.displayName}</p>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          BLOG
        </h1>
        <p
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-black text-white p-2 rounded-xl cursor-pointer"
        >
          Log out <IoIosLogOut />
        </p>
      </div>
      <Nav/>
    </header>
  );
};

export default Header;
