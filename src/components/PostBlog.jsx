import { useEffect, useState } from "react";
import useAutoResizeTextarea from "../hooks/useAutoResizeTextarea";
import { db, storage } from "../config/firebase";
import { useStore } from "../User";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from 'uuid'; 

const PostBlog = () => {
  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const titleRef = useAutoResizeTextarea(title);
  const descrRef = useAutoResizeTextarea(descr);
  const contentRef = useAutoResizeTextarea(content);

  const user = useStore((state) => state.user);


  const uploadFile = async (file) => {
    if (!file) return "";

    try {
      const storageRef = ref(storage, `blogs/${uuidv4()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {

          },
          (error) => {
            toast.error("Failed to upload file");
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              toast.error("Error getting file URL");
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      toast.error("Error uploading file");
      return "";
    }
  };

  const post = async () => {
    try {
      const id = uuidv4();
      let blog = {
        id,
        title,
        descr,
        content,
        author: user.displayName,
        createdAt: new Date(),
        img: "",
      };
  
      if (file) {
        const url = await uploadFile(file);
        blog.img = url;
      }
  
      const userDocRef = doc(db, "users", user.uid);
      const blogsSubcollectionRef = collection(userDocRef, "blogs");
    
      const blogDocRef = doc(blogsSubcollectionRef, id);
      await setDoc(blogDocRef, blog);


      try {
        const allBlogsCollectionRef = collection(db, "blogs");
        const allBlogsDocRef = doc(allBlogsCollectionRef, id);
        await setDoc(allBlogsDocRef, blog);
    
      } catch (error) {
          console.log(error);
                
      }
      
      toast.success("Blog added");
      setTitle("");
      setDescr("");
      setContent("");
      setFile(null);
      setFileUrl("");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <section id="postBlog" className="w-full flex flex-col items-center gap-10">
      <ToastContainer />
      <h1 className="text-3xl">Post Blog</h1>
      <div className="w-96 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-5 rounded-lg flex flex-col items-center">
        <div className="w-full">
          <label htmlFor="title">Title</label>
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            placeholder="Enter the title"
            maxLength={150}
            className="w-full outline-none p-2 border rounded resize-none overflow-hidden min-h-[40px] max-h-[300px]"
            rows="1"
          ></textarea>
        </div>

        <div className="w-full">
          <label htmlFor="descr">Description</label>
          <textarea
            ref={descrRef}
            value={descr}
            onChange={(e) => setDescr(e.target.value)}
            id="descr"
            placeholder="Enter description"
            maxLength={500}
            className="w-full outline-none p-2 border rounded resize-none overflow-hidden min-h-[40px] max-h-[300px]"
            rows="1"
          ></textarea>
        </div>

        <div className="w-full">
          <label htmlFor="content">Content</label>
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id="content"
            placeholder="Write your article here"
            maxLength={3000}
            className="w-full outline-none p-2 border rounded resize-none overflow-hidden min-h-[40px] h-fit"
            rows="1"
          ></textarea>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <p>{file && file.name}</p>
          <label className="cursor-pointer bg-black text-white py-2 px-5 rounded-md" htmlFor="pic">Upload File</label>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            type="file"
            name="pic"
            id="pic"
          />
        </div>

        <button onClick={post} className="mt-5 w-full bg-black text-white py-2 text-2xl rounded-md">POST</button>
      </div>
    </section>
  );
};

export default PostBlog;
