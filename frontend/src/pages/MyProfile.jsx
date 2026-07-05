import React, { useContext, useEffect, useState } from 'react';
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from '../context/AppContext';
import { API_ROUTES } from '../utils/routes';
import { toast } from 'react-toastify';
import axios from "axios";

const MyProfile = () => {
  const { user, setUser, token, loadProfile } = useContext(AppContext);
  const [userData, setUserData] = useState(user);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        ...user,
        address: user.address || { line1: "", line2: "" }
      });
    }
  }, [user]);

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.post(API_ROUTES.UPDATE_PROFILE, formData, {
        headers: { token }
      });

      if (data.success) {
        toast.success("Profile updated");
        await loadProfile();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 dark:border-slate-700/50 overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20">
              {/* Profile Image */}
              <div className="relative">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer group">
                    <div className="relative rounded-full p-1 bg-white dark:bg-slate-800 shadow-xl group-hover:shadow-2xl transition-shadow border border-white/50 dark:border-slate-700">
                      <img
                        src={image ? URL.createObjectURL(image) : userData.image}
                        alt="Preview"
                        className="w-36 h-36 object-cover rounded-full"
                      />
                      <div className="absolute inset-1 rounded-full bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <img
                          src={assets.upload_icon}
                          alt="Upload"
                          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity invert"
                        />
                      </div>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                      id="image"
                      hidden
                    />
                  </label>
                ) : (
                  <div className="rounded-full p-1 bg-white dark:bg-slate-800 shadow-xl border border-white/50 dark:border-slate-700">
                    <img
                      src={user?.image}
                      alt="Profile"
                      className="w-36 h-36 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Name and Edit Button */}
              <div className="flex-1 text-center sm:text-left sm:mt-8">
                {isEdit ? (
                  <input
                    type="text"
                    value={userData?.name || ""}
                    onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-3xl font-bold border-b-2 border-primary/50 text-gray-900 dark:text-white px-2 py-1 focus:outline-none focus:border-primary transition-colors bg-transparent w-full max-w-sm text-center sm:text-left"
                    placeholder="Your Name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">{user?.name}</h1>
                )}
                <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">{user?.email}</p>
              </div>

              {/* Action Button */}
              <div className="mt-6 sm:mt-8 w-full sm:w-auto">
                {isEdit ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => updateUserProfile()}
                      className="bg-gradient-to-br from-primary to-indigo-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all font-bold tracking-wide cursor-pointer w-full sm:w-auto text-sm uppercase"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEdit(false);
                        setImage(null);
                        setUserData(user);
                      }}
                      className="bg-white/50 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 border-[1.5px] border-gray-200 dark:border-slate-600 px-8 py-3 rounded-2xl hover:bg-white dark:hover:bg-slate-700 transition-all font-bold tracking-wide cursor-pointer w-full sm:w-auto text-sm uppercase"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-gray-900 dark:bg-slate-700 text-white px-8 py-3 rounded-2xl hover:bg-gray-800 dark:hover:bg-slate-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-bold tracking-wide cursor-pointer w-full sm:w-auto text-sm uppercase"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 dark:border-slate-700/50 p-8 h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Contact Info</h2>
            </div>

            <div className="space-y-6">
              {/* Phone */}
              <div className="space-y-2 group">
                <label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Phone</label>
                {isEdit ? (
                  <input
                    type="text"
                    value={userData?.phone || ""}
                    onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-gray-800 dark:text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 group-hover:bg-primary/5 dark:group-hover:bg-slate-700/50 transition-colors">
                    <span className="text-xl">📱</span>
                    <p className="font-semibold text-gray-800 dark:text-slate-200">{user?.phone || "Not provided"}</p>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2 group">
                <label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Address</label>
                {isEdit ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={userData?.address?.line1 || ""}
                      onChange={e => setUserData(prev => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value }
                      }))}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-gray-800 dark:text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Address Line 1"
                    />
                    <input
                      type="text"
                      value={userData?.address?.line2 || ""}
                      onChange={e => setUserData(prev => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value }
                      }))}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-gray-800 dark:text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Address Line 2"
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 group-hover:bg-primary/5 dark:group-hover:bg-slate-700/50 transition-colors min-h-[80px]">
                    <span className="text-xl mt-0.5">📍</span>
                    <p className="font-semibold text-gray-800 dark:text-slate-200 leading-relaxed">
                      {user?.address?.line1 || "Not provided"} 
                      {user?.address?.line2 && <><br />{user.address.line2}</>}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 dark:border-slate-700/50 p-8 h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-purple-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Basic Info</h2>
            </div>

            <div className="space-y-6">
              {/* Gender */}
              <div className="space-y-2 group">
                <label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Gender</label>
                {isEdit ? (
                  <select
                    onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                    value={userData?.gender || ""}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-gray-800 dark:text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 group-hover:bg-primary/5 dark:group-hover:bg-slate-700/50 transition-colors">
                    <span className="text-xl">{user?.gender === "Male" ? "👨" : user?.gender === "Female" ? "👩" : "🧑"}</span>
                    <p className="font-semibold text-gray-800 dark:text-slate-200">{user?.gender || "Not specified"}</p>
                  </div>
                )}
              </div>

              {/* Birth Date */}
              <div className="space-y-2 group">
                <label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Date of Birth</label>
                {isEdit ? (
                  <input
                    type="date"
                    onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                    value={userData?.dob || ""}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-gray-800 dark:text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 group-hover:bg-primary/5 dark:group-hover:bg-slate-700/50 transition-colors">
                    <span className="text-xl">🎂</span>
                    <p className="font-semibold text-gray-800 dark:text-slate-200">{user?.dob || "Not provided"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;