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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
              {/* Profile Image */}
              <div className="relative">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer group">
                    <div className="relative">
                      <img
                        src={image ? URL.createObjectURL(image) : userData.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-shadow"
                      />
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <img
                          src={assets.upload_icon}
                          alt="Upload"
                          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <img
                    src={user?.image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                )}
              </div>

              {/* Name and Edit Button */}
              <div className="flex-1 text-center sm:text-left sm:mt-8">
                {isEdit ? (
                  <input
                    type="text"
                    value={userData?.name || ""}
                    onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold border-b-2 border-blue-500 px-2 py-1 focus:outline-none focus:border-purple-500 transition-colors bg-transparent"
                    placeholder="Your Name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
                )}
                <p className="text-gray-500 mt-1">{user?.email}</p>
              </div>

              {/* Action Button */}
              <div className="sm:mt-8">
                {isEdit ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        updateUserProfile();
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-medium"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEdit(false);
                        setImage(null);
                        setUserData(user);
                      }}
                      className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-300 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-gray-800 text-white px-6 py-2.5 rounded-xl hover:bg-gray-900 transform hover:scale-105 transition-all font-medium shadow-md"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📞</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</label>
              <div className="flex items-center gap-2 text-blue-600">
                <span>📧</span>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone</label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData?.phone || ""}
                  onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <p className="font-medium text-gray-800">{user?.phone || "Not provided"}</p>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address</label>
              {isEdit ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={userData?.address?.line1 || ""}
                    onChange={e => setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))}
                    className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Address Line 1"
                  />
                  <input
                    type="text"
                    value={userData?.address?.line2 || ""}
                    onChange={e => setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))}
                    className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Address Line 2"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <span>📍</span>
                  <p className="font-medium text-gray-800">
                    {user?.address?.line1 || "Not provided"} 
                    {user?.address?.line2 && <><br />{user.address.line2}</>}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Gender</label>
              {isEdit ? (
                <select
                  onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                  value={userData?.gender || ""}
                  className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{user?.gender === "Male" ? "👨" : user?.gender === "Female" ? "👩" : "🧑"}</span>
                  <p className="font-medium text-gray-800">{user?.gender || "Not specified"}</p>
                </div>
              )}
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Date of Birth</label>
              {isEdit ? (
                <input
                  type="date"
                  onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                  value={userData?.dob || ""}
                  className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span>🎂</span>
                  <p className="font-medium text-gray-800">{user?.dob || "Not provided"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;