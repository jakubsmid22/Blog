import { useEffect, useState } from "react";
import Blog from "./Blog";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../config/firebase";

const RecentBlogs = ({ openModal }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const collectionRef = collection(db, "blogs");
        const q = query(
          collectionRef,
          orderBy("createdAt", "desc"),
          limit(8)
        );
        const querySnapshot = await getDocs(q);

        const blogsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBlogs(blogsArray);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      }
    };

    getBlogs();
  }, []);

  return (
    <section id="recentBlogs" className="w-full flex flex-col items-center gap-10">
      <h1 className="text-3xl">Recent Blogs</h1>
      <div className="grid relative place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full gap-y-10 min-h-[50svh] h-fit pb-10">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Blog openModal={openModal} key={blog.id} blog={blog} />
          ))
        ) : (
          <p className="absolute">No blogs to display</p>
        )}
      </div>
    </section>
  );
}

export default RecentBlogs;
