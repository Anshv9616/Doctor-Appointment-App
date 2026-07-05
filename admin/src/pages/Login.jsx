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
      className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950"
      onSubmit={onSubmitHandler}
    >
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-700">
        <p className="text-xl font-semibold text-center mb-6 dark:text-white">
          <span className="text-primary dark:text-primary-light">{state}</span> login
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-200">
          Login
        </button>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-slate-400">
          {state === "Admin" ? (
            <p>
              Doctor Login?{" "}
              <span
                onClick={() => setState("Doctor")}
                className="text-primary dark:text-primary-light hover:underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Admin Login?{" "}
              <span
                onClick={() => setState("Admin")}
                className="text-primary dark:text-primary-light hover:underline cursor-pointer"
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
