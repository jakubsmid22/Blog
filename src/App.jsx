import Header from "./components/Header";
import RecentBlogs from "./components/RecentBlogs";
import UserBlogs from "./components/UserBlogs";
import Login from "./components/Login";
import PostBlog from "./components/PostBlog";
import Modal from "react-modal";
import { useState } from "react";
import { MdOutlineAccessTime } from "react-icons/md";
import { format } from "date-fns";
import { useStore } from "./User";
import { toast } from "react-toastify";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./config/firebase";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const App = () => {
  const user = useStore((state) => state.user);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [date, setDate] = useState(null);
  const formattedDate = date ? format(date.toDate(), "MMMM dd, yyyy") : "";

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      maxWidth: "90%",
      width: "600px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      overflow: "auto",
      maxHeight: "80vh",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  const openModal = (data) => {
    setIsOpen(true);
    setModalData(data);
    setDate(data.createdAt);
  };

  const closeModal = () => {
    setModalData(null);
    setIsOpen(false);
  };

  Modal.setAppElement("#root");

  const deleteBlog = async (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this blog?',
      buttons: [
        {
          label: 'Yes',
          className: 'confirm-button',
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "users", user.uid, "blogs", id));
              await deleteDoc(doc(db, "blogs", id));
              toast.info("Blog deleted");
            } catch (error) {
              toast.error(error.message);
            }
          },
        },
        {
          label: 'No',
          className: 'cancel-button',
        },
      ],
    });
  };
  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <>
          <div className="bg-white relative min-h-screen w-screen md:w-[700px] lg:w-[1200px] mx-auto">
            <Header />
            <div className="pt-16 gap-16 px-2 flex flex-col items-center h-[calc(100vh-4rem)] overflow-y-auto">
              <PostBlog/>
              <UserBlogs deleteBlog={deleteBlog} openModal={openModal} />
              <RecentBlogs openModal={openModal} />
            </div>
          </div>
        </>
      )}
      {modalData && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={modalStyle}
          contentLabel="Blog Details"
        >
          <div className="space-y-5">
            <h1 className="text-xl md:text-4xl font-bold">{modalData.title}</h1>
            <p className="flex items-center gap-2">
              <MdOutlineAccessTime />
              {formattedDate}
            </p>
            <p className="font-bold text-lg">{modalData.author}</p>
            <p className="text-sm md:text-base">{modalData.descr}</p>
            {modalData.img && <img src={modalData.img} alt={modalData.title + "-img"} />}
            <p className="text-sm md:text-base">{modalData.content}</p>
            <div onClick={closeModal} className="flex justify-center bg-black text-white text-xl py-2 rounded-md cursor-pointer">
              <button>CLOSE</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default App;
