import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-100 text-gray-800 px-6 py-12">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* Branding Section */}
    <div className="flex flex-col justify-between h-full space-y-4">
      <img src={assets.logo} alt="Prescripto Logo" className="w-36" />
      <p className="text-sm leading-relaxed">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
      </p>
    </div>

    {/* Company Links */}
    <div className="flex flex-col justify-between h-full space-y-4">
      <h3 className="text-base font-semibold tracking-wide">COMPANY</h3>
      <ul className="space-y-2 text-sm">
        <li onClick={() => navigate("/")} className="cursor-pointer hover:text-blue-600 transition">Home</li>
        <li onClick={() => navigate("/about")} className="cursor-pointer hover:text-blue-600 transition">About Us</li>
        <li onClick={() => navigate("/contact")} className="cursor-pointer hover:text-blue-600 transition">Contact Us</li>
        <li className="cursor-pointer hover:text-blue-600 transition">Privacy Policy</li>
      </ul>
    </div>

    {/* Contact Info */}
    <div className="flex flex-col justify-between h-full space-y-4">
      <h3 className="text-base font-semibold tracking-wide">GET IN TOUCH</h3>
      <ul className="space-y-2 text-sm">
        <li>📞 +1-212-456-7890</li>
        <li>📧 gnestudio.dev@gmail.com</li>
      </ul>
    </div>

  </div>
</footer>

  );
};

export default Footer;


