import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
const Login = () => {
  const [state, setState] = useState("Admin");
  const { setAdminToken, backendUrl } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setDoctorToken}=useContext(DoctorContext)
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Admin") {
        const {data}  = await axios.post(
          backendUrl + "/api/admin/login",
          { email, password },
          {
            withCredentials: true,
          }
        );
         if(data.success){
            const admin_token=await data.admin_token;
           // console.log(admin_token)
            setAdminToken(admin_token)
           toast.success(data.message)
            localStorage.setItem("admin_token",admin_token)
           
         }
         else{
             toast.error(data.message)
         }
      } else {

        const {data}  = await axios.post(
          backendUrl + "/api/doctor/login",
          { email, password },
         
        );

         if(data.success){
            const doctor_token=await data.doctor_token;
           // console.log(doctor_token)
            setDoctorToken(doctor_token)
           toast.success(data.message)
            localStorage.setItem("doctor_token",doctor_token)
           
         }
         else{
             toast.error(data.message)
         }


      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form
      className="flex justify-center items-center min-h-screen bg-gray-100 "
      onSubmit={onSubmitHandler}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <p className="text-xl font-semibold text-center mb-6">
          <span className="text-blue-600">{state}</span> login
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">
          Login
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {state === "Admin" ? (
            <p>
              Doctor Login?{" "}
              <span
                onClick={() => setState("Doctor")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Admin Login?{" "}
              <span
                onClick={() => setState("Admin")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
