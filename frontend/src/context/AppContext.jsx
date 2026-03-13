import { createContext, useEffect, useState } from "react";
import axios from "axios"
export const AppContext=createContext();
import {API_ROUTES} from "../utils/routes" 
import { toast } from "react-toastify";
const AppContextProvider=(props)=>{
  
      
         const[doctors,setDoctors]=useState([]);
        const[user,setUser]=useState(false)
         const [token,setToken]=useState(localStorage.getItem("token")?localStorage.getItem("token"):false)
          const getAllDoctors=async()=>{
              try{
            const {data} =   await axios.get(API_ROUTES.GET_DOCTORS, {
            
});


                 if(data.success){
                     setDoctors(data.doctors)
                     
                 }
               
              }
              catch(err){
                  console.log(err.message)
              }
        }

        


        const loadProfile=async()=>{
               try{

                const {data}=await axios.get(API_ROUTES.GET_User,{
                      headers:{token}
                })

                if(data.success){
                     setUser(data.userData)

                }
                else{
                     toast.error(data.message)
                }

               }
               catch(err){
                   toast.error(err.message)
               }
        }

        useEffect(()=>{
              getAllDoctors();
              
        },[])
        useEffect(()=>{
             if(token){
                 loadProfile()
             }
             else{
                 setUser(false)
             }
        },[token])
       const value={
            doctors,
            getAllDoctors,
            token,
            setToken,
            user,
            setUser,
            loadProfile
       }

       return (
            <AppContext.Provider value={value}>
                {props.children}
            </AppContext.Provider>
       )
}

export default AppContextProvider