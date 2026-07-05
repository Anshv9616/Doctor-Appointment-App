import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDocs] = useState([]);
 
  const navigate = useNavigate();
 
  const applyFilter = () => {
    if (speciality) {
      setFilterDocs(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDocs(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
     
  }, [doctors, speciality]);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-6 tracking-tight">
        Browse by Speciality
      </h2>

      {/* Speciality Filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        {specialities.map((spec, index) => (
          <button
            key={index}
            className={`px-5 py-2.5 rounded-full border transition-all duration-300 text-sm font-medium ${
              speciality === spec
                ? "bg-gradient-to-br from-primary to-indigo-500 text-white border-transparent shadow-lg shadow-primary/20 scale-105"
                : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary dark:hover:text-primary-light hover:-translate-y-0.5 hover:shadow-sm"
            }`}
            onClick={() => navigate(`/doctors/${spec}`)}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctor Cards */}
      {/* Doctor Cards */}
{filterDoc.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
    {filterDoc.map((item, index) => (
      <div
        key={index}
        className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl shadow-sm transition-all duration-500"
        onClick={() => navigate(`/appointment/${item._id}`)}
      >
        <div className="overflow-hidden relative">
          <img
            src={item.image}
            alt={item.name}
            className="bg-primary/5 dark:bg-slate-700 w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <div className="p-5">
          <div className={`flex items-center gap-2 text-sm font-semibold mb-2 ${item.available ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            <p className={`w-2.5 h-2.5 rounded-full ${item.available ? "bg-green-500" : "bg-red-500"} shadow-sm`}></p>
            <p>{item.available ? "Available" : "Not Available"}</p>
          </div>
          <p className="font-bold text-lg text-gray-900 dark:text-slate-100 tracking-tight">{item.name}</p>
          <p className="text-[13px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">{item.speciality}</p>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center text-gray-500 dark:text-slate-400 mt-16 p-10 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm backdrop-blur-md max-w-2xl mx-auto">
    <p className="text-lg">No doctors found for <span className="font-bold text-primary dark:text-primary-light px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-md">{speciality}</span>. Please try another speciality.</p>
  </div>
)}

    </div>
  );
};

export default Doctors;
