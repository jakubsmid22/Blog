import { FaGoogle } from "react-icons/fa";

const Register = ({ register, googleLogin }) => {
  return (
    <div className="bg-white p-5 rounded-md flex flex-col items-center gap-5">
      <h1 className="text-3xl">Register with</h1>
      <button
        onClick={googleLogin}
        className="flex items-center gap-2 text-white bg-black py-1 px-3 rounded-md"
      >
        <FaGoogle /> Google
      </button>

      <p>or</p>
      <form onSubmit={register} className="flex flex-col items-center gap-2">
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="bg-black w-64 text-white p-2"
            type="text"
            placeholder="Enter your username"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="emailRegister">Email</label>
          <input
            id="emailRegister"
            className="bg-black w-64 text-white p-2"
            type="email"
            placeholder="Enter email adress"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="passwordRegister">Password</label>
          <input
            id="passwordRegister"
            className="bg-black w-64 text-white p-2"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <button className="text-white bg-black py-3 mt-5 rounded-md w-full">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
