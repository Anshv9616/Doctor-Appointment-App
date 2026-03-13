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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl mx-auto font-semibold text-gray-800 mb-4">
        Browse by Speciality
      </h2>

      {/* Speciality Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {specialities.map((spec, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm ${
              speciality === spec
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400"
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
        className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
        onClick={() => navigate(`/appointment/${item._id}`)}
      >
        <img
          src={item.image}
          alt={item.name}
          className="bg-blue-50 w-full h-auto"
        />
        <div className="p-4">
          <div className={`flex items-center gap-2 text-sm ${item.available ? "text-green-500" : "text-red-500"}`}>
  <p className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-red-500"}`}></p>
  <p>{item.available ? "Available" : "Not Available"}</p>
</div>

          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-600">{item.speciality}</p>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center text-gray-500 mt-10">
    <p>No doctors found for <span className="font-semibold text-blue-600">{speciality}</span>. Please try another speciality.</p>
  </div>
)}

    </div>
  );
};

export default Doctors;
