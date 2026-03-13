import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const DoctorsList = () => {
  const { admin_token, backendUrl ,doctors,getAllDoctors, changeAvailability} = useContext(AdminContext);
   
  useEffect(()=>{

     if(admin_token){
       getAllDoctors();
        console.log(doctors)
     }
       
  },[admin_token,backendUrl])
  return (
    admin_token && (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
          >
            <img
              src={doctor.image || "/default-doctor.jpg"}
              alt={doctor.name}
              className="w-full h-48 object-cover bg-blue-300"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{doctor.speciality}</p>
              
               <input type="checkbox" checked={doctor.available} onChange={()=>changeAvailability(doctor._id)} />
               <p>Available</p>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default DoctorsList;
