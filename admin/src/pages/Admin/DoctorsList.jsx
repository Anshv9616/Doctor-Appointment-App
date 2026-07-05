import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const DoctorsList = () => {
  const { admin_token, backendUrl, doctors, getAllDoctors, changeAvailability } = useContext(AdminContext);
   
  useEffect(() => {
    if(admin_token){
      getAllDoctors();
    }
  }, [admin_token, backendUrl]);

  return (
    admin_token && (
      <div className="p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">All Doctors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300"
            >
              <img
                src={doctor.image || "/default-doctor.jpg"}
                alt={doctor.name}
                className="w-full h-48 object-cover bg-indigo-50 dark:bg-slate-700"
              />
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                  {doctor.name}
                </h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">{doctor.speciality}</p>
                
                <div className="mt-4 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={doctor.available} 
                    onChange={() => changeAvailability(doctor._id)} 
                    className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary dark:focus:ring-primary-light dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                  />
                  <p className={`text-sm font-medium ${doctor.available ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>Available</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default DoctorsList;
