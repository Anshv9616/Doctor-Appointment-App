import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { assets } from '../assets/assets_admin/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { admin_token } = useContext(AdminContext);
  const { doctor_token } = useContext(DoctorContext);

  const adminMenuItems = [
    { label: "Dashboard", icon: assets.home_icon, path: "/admin-dashboard" },
    { label: "Appointments", icon: assets.appointment_icon, path: "/all-appointments" },
    { label: "Add Doctor", icon: assets.add_icon, path: "/add-doctor" },
    { label: "Doctors List", icon: assets.people_icon, path: "/doctor-list" },
  ];

  const doctorMenuItems = [
    { label: "Dashboard", icon: assets.home_icon, path: "/doctor-dashboard" },
    { label: "Appointments", icon: assets.appointment_icon, path: "/doctor-appointments" },
    { label: "Profile", icon: assets.people_icon, path: "/doctor-profile" },
  ];

  // Decide which menu to show
  const menuItems = admin_token ? adminMenuItems : doctor_token ? doctorMenuItems : [];

  // If neither token exists, render nothing
  if (!admin_token && !doctor_token) return null;

  return (
    <div className="w-64 h-screen bg-white shadow-md p-6 flex flex-col gap-6">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-4 cursor-pointer p-3 rounded-md transition hover:bg-gray-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <img src={item.icon} alt={item.label} className="w-6 h-6" />
          <p className="font-medium text-gray-800">{item.label}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
