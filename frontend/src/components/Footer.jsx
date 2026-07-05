import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-12 mt-20">
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
      <h3 className="text-base font-semibold tracking-wide text-slate-900 dark:text-slate-100">COMPANY</h3>
      <ul className="space-y-2 text-sm">
        <li onClick={() => navigate("/")} className="cursor-pointer hover:text-primary transition">Home</li>
        <li onClick={() => navigate("/about")} className="cursor-pointer hover:text-primary transition">About Us</li>
        <li onClick={() => navigate("/contact")} className="cursor-pointer hover:text-primary transition">Contact Us</li>
        <li className="cursor-pointer hover:text-primary transition">Privacy Policy</li>
      </ul>
    </div>

    {/* Contact Info */}
    <div className="flex flex-col justify-between h-full space-y-4">
      <h3 className="text-base font-semibold tracking-wide text-slate-900 dark:text-slate-100">GET IN TOUCH</h3>
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


