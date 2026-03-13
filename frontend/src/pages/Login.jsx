import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from "axios"
import { API_ROUTES } from '../utils/routes'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState("Sign Up")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
   const navigate=useNavigate()
   const {token,setToken}=useContext(AppContext);

  const onSubmitHandler = async (e) => {
       e.preventDefault();

       try{


        if(state==="Sign Up"){
        const {data}= await axios.post(API_ROUTES.REGISTER,{
          name,password,email
        })

         
         if(data.success){
             localStorage.setItem("token",data.token);
             setToken(data.token)
             toast.success(data.message)
         }
         else{
             toast.error(data.message)
         }
           
        }
        else{
            
          const {data}= await axios.post(API_ROUTES.LOGIN,{
          password,email
        })

         
         if(data.success){
             localStorage.setItem("token",data.token);
             setToken(data.token)
             toast.success(data.message)
         }
         else{
            toast.error(data.message)
         }
        }


       }
       catch(err){

        console.log(err)
           
       }
  }

  useEffect(()=>{
      if(token){
           navigate("/")
      }
  },[token])

  return (
    <form
      className="min-h-[80vh] flex items-center justify-center px-4"
      onSubmit={onSubmitHandler}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-gray-400 shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-2">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please {state === "Sign Up" ? "sign up" : "log in"} to book an appointment
        </p>

        <div className="space-y-4">
          {state === "Sign Up" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>

          <p className="text-sm text-center mt-4">
            {state === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => setState(state === "Sign Up" ? "Log In" : "Sign Up")}
            >
              {state === "Sign Up" ? "Log in here" : "Sign up here"}
            </span>
          </p>
        </div>
      </div>
    </form>
  )
}

export default Login
