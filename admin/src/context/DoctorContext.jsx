import { createContext } from "react";
import { useState } from "react";
import {toast} from "react-toastify";
export const DoctorContext=createContext();

import axios from "axios";
const DoctorContextProvider=(props)=>{
     
      const backendUrl=import.meta.env.VITE_BACKEND_URL;
      const[appointments,setAppointments]=useState([]);
      const [doctor_token,setDoctorToken]=useState(localStorage.getItem("doctor_token")||"");
      const[dashData,setDashData]=useState(false);
      const [profileData,setProfileData]=useState(false)
      const getAppointements=async()=>{
          try{
              const {data}=await axios.get(`${backendUrl}/api/doctor/appointments`,{ headers: { doctor_token}});           
              if(data.success){
                  setAppointments(data.appointments.reverse());
                 // console.log(data.appointments.reverse());
                  toast.success(data.message);

                  

              }
              else{
                  console.log(data.message);
                  toast.error(data.message);
                  
              }
          }
          catch(err){
              console.log(err);
              
          }
      }

    const completeAppointment=async(appointmentId)=>{
            try{
                const {data}=await axios.post(`${backendUrl}/api/doctor/mark-completed`,{appointmentId},{ headers: { doctor_token}});
                if(data.success){
                    toast.success(data.message);
                    getAppointements();
                }   
                else{
                    toast.error(data.message);
                }
            }
            catch(err){
                console.log(err);
            }
    }

    const cancelAppointment=async(appointmentId)=>{
            try{
                const {data}=await axios.post(`${backendUrl}/api/doctor/cancel-appointment`,{appointmentId},{ headers: { doctor_token}});
                if(data.success){
                    toast.success(data.message);
                    getAppointements();
                }
                else{   
                    toast.error(data.message);  
                }   
            }   

            catch(err){
                console.log(err);
            }

    }

    const doctorDashboard=async()=>{
        try{
            const {data}=await axios.get(`${backendUrl}/api/doctor/dashboard`,{ headers: { doctor_token}}); 

            if(data.success){
                setDashData(data.doctorDashboardData);
            }
            else{
                toast.error(data.message)
            }
        }
        catch(err){
            console.log(err);

        }   
    }
    
    const getProfileData=async()=>{
        try {
            const {data}=await axios.get(`${backendUrl}/api/doctor/profile`,{headers:{doctor_token}});
            if(data.success){
                 setProfileData(data.profileData)
                 console.log(data.profileData)
            }
            
        } catch (error) {
             console.log(err);
            
        }
    }


    
      const value={
          doctor_token,
          setDoctorToken,
          backendUrl,
          appointments,
          setAppointments
          ,getAppointements,
            completeAppointment,
            cancelAppointment,
            dashData,
            doctorDashboard,
            setDashData,profileData,
            setProfileData,
            getProfileData

            
      }

        

      return (
          <DoctorContext.Provider value={value}>
            {props.children}
          </DoctorContext.Provider>
      )
}

export default DoctorContextProvider