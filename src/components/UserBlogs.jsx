import { useEffect, useState } from "react";
import { useStore } from "../User";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import Blog from "./Blog";
import { MdDeleteForever } from "react-icons/md";

const UserBlogs = ({ openModal, deleteBlog }) => {
  const [blogs, setBlogs] = useState([]);
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!user || !user.uid) return;

    const userDocRef = doc(db, "users", user.uid);
    const blogsSubcollectionRef = collection(userDocRef, "blogs");

    const unsubscribe = onSnapshot(
      blogsSubcollectionRef,
      (snapshot) => {
        const blogsDb = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsDb);
      },
      (error) => {
        console.error("Error getting user blogs:", error.message);
      }
    );

    return () => unsubscribe();
  }, [user]);



  return (
    <div id="userBlogs" className="w-full flex flex-col items-center gap-10">
      <h1 className="text-3xl">Your Blogs</h1>
      <div className="grid relative place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full gap-y-10 min-h-[50svh] h-fit">
        {blogs.length === 0 ? (
          <p className="absolute">No blogs to display</p>
        ) : (
          blogs.map((blog) => (
            <div className="relative" key={blog.id}>
              <p onClick={() => deleteBlog(blog.id)} className="absolute flex items-center bg-opacity-75 rounded-md cursor-pointer px-2 hover:bg-opacity-100 top-2 left-2 z-10 font-bold text-red-700 bg-white" >delete <MdDeleteForever /></p>
              <Blog openModal={openModal} blog={blog} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserBlogs;
