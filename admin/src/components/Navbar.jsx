import React, { useContext } from 'react';
import { assets } from '../assets/assets_admin/assets';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
  const { admin_token,setAdminToken } = useContext(AdminContext);
   const{doctor_token, setDoctorToken}=useContext(DoctorContext)
   const navigate=useNavigate();
  const logout=()=>{
     navigate("/")
       admin_token &&  setAdminToken("")
       admin_token && localStorage.removeItem("admin_token")
        doctor_token && setDoctorToken("")
        doctor_token && localStorage.removeItem("doctor_token")

  }
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Logo and Role */}
      <div className="flex items-center space-x-4">
        <img src={assets.admin_logo} alt="Prescripto Admin Logo" className="h-8 w-auto" />
        <p className="text-md font-semibold text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700 rounded-full px-3 py-0.5">
          {admin_token ? 'Admin' : 'Doctor'}
        </p>
      </div>

      {/* Logout Button */}
      <div>
        <button className="bg-primary text-white px-5 py-2 hover:bg-primary-dark transition duration-300 rounded-full font-medium"
        onClick={logout} 
 >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
