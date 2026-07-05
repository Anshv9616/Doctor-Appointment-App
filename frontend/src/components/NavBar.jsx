import React, { useContext } from 'react'
import {assets} from "../assets/assets_frontend/assets"
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppContext } from '../context/AppContext'
const NavBar = () => {
      const navigate=useNavigate();
      const[showMenu,setShowMenu]=useState(false);
    const{token,setToken}=useContext(AppContext)
    const {user}=useContext(AppContext)
    const logout=()=>{
         setToken(false);
         localStorage.removeItem("token")
    }
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 glass-panel px-6 rounded-b-xl transition-all'>

    <NavLink  to="/"><img src={assets.logo} alt=""  className='w-44 cursor-pointer'/></NavLink> 
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to="/">
              <li className='py-1' >Home</li>
                 <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden transition-all duration-300' />
               </NavLink>
            <NavLink to="/doctors">
             <li className='py-1' >All Doctors</li>
                 <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden transition-all duration-300' /></NavLink>
            <NavLink to="/about">
                <li className='py-1' >About</li>
                 <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden transition-all duration-300' />
             </NavLink>
            <NavLink to="/contact">
                <li className='py-1' >Contact</li>
                 <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden transition-all duration-300' />
              </NavLink>
            

        </ul>

        <div className='flex items-center  gap--4 cursor-pointer group relative'>
          {
             token ?
              <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img src={user.image} alt="" className='w-10 h-10 rounded-full cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700' onClick={()=>setShowMenu(!showMenu)}/>
              <img src={assets.dropdown_icon} alt="" className='w-2.5 dark:invert opacity-70'/>
               <div className='absolute top-0 right-0 py-14 text-base font-medium text-gray-600 dark:text-slate-300 z-20 hidden group-hover:block'>
                   <div className='min-w-48 bg-stone-100 dark:bg-slate-800 rounded-xl shadow-lg flex flex-col gap-4 p-4 border border-slate-200 dark:border-slate-700'>
                      <p className='hover:text-primary cursor-pointer transition-colors' onClick={()=>navigate("/my-profile")}> Profile</p>
                      <p className='hover:text-primary cursor-pointer transition-colors' onClick={()=>navigate("/my-appointment")}>My Appointments</p>
                      <p className='hover:text-red-500 cursor-pointer transition-colors' onClick={()=>{logout()}}>Logout</p>
                   </div>
              </div>
              </div>:  <button onClick={()=>navigate("/login")} className='bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold hidden md:block transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5'>Create Account</button>
          }

          <img src={assets.menu_icon} alt="" className='w-6 md:hidden dark:invert opacity-80 cursor-pointer' onClick={()=>setShowMenu(true)}/>

           {/* mobile menu */}
      
<div
  className={`${
    showMenu ? "fixed w-full h-full" : "h-0 w-0"
  } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300 ease-in-out`}
>
  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800 dark:bg-slate-900">
    <img src={assets.logo} alt="Logo" className="h-8" />
    <img
      src={assets.cross_icon}
      alt="Close menu"
      className="h-6 w-6 cursor-pointer dark:invert opacity-80"
      onClick={() => setShowMenu(false)}
    />
  </div>

  <ul className="flex flex-col gap-4 p-6 text-lg font-medium text-gray-700 dark:text-slate-200 dark:bg-slate-900 h-full">
    <li className="hover:text-primary cursor-pointer transition-colors" onClick={()=>{navigate("/");setShowMenu(false)}}>Home</li>
    <li className="hover:text-primary cursor-pointer transition-colors" onClick={()=>{navigate("/about");setShowMenu(false)}}>About</li>
    <li className="hover:text-primary cursor-pointer transition-colors" onClick={()=>{navigate("/contact");setShowMenu(false)}}>Contact</li>
    <li className="hover:text-primary cursor-pointer transition-colors" onClick={()=>{navigate("/doctors");setShowMenu(false)}}>All Doctors</li>
  </ul>
</div>

           
        
    </div>
    </div>
  )
}
  


export default NavBar