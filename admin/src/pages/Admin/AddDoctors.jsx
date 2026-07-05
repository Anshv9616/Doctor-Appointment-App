import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from "../../assets/assets_admin/assets";
import axios from "axios";
import { toast } from "react-toastify";

const AddDoctors = () => {
  const { admin_token, backendUrl } = useContext(AdminContext);

  const [name, setName] = useState("");
  const [docImg, setDocImg] = useState(null);
  const [speciality, setSpeciality] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [password, setPassword] = useState("");
  const [fees, setFees] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [experience, setExperience] = useState("1");
  const [about, setAbout] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      setDocImg(file);
    } else {
      toast.error("Invalid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!(docImg instanceof File)) {
      toast.error("Please upload a valid doctor image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", education);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));

      const res = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: {
          admin_token: admin_token
        }
      });

      const data = res.data;

      if (data.success) {
        toast.success("Doctor added successfully");
        setDocImg(null);
        setName("");
        setSpeciality("");
        setEmail("");
        setEducation("");
        setPassword("");
        setFees("");
        setAddress1("");
        setAddress2("");
        setExperience("1");
        setAbout("");
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      console.error("Add doctor error:", err.response?.data || err.message);
    }
  };

  return admin_token && (
    <div className="p-6 md:p-8 min-h-screen relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white dark:border-slate-700/50 rounded-[2rem] p-8 md:p-12 space-y-8 relative z-10">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700/50 pb-6 mb-8">
          <div className="w-12 h-12 bg-primary/10 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <span className="text-2xl">👨‍⚕️</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 m-0 tracking-tight">Add New Doctor</h1>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col items-center py-4">
          <label htmlFor="doc-img" className="cursor-pointer group relative">
            <img
              src={docImg instanceof File ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload"
              className="w-32 h-32 object-cover border-4 border-white dark:border-slate-700 shadow-xl rounded-full group-hover:shadow-2xl transition-all duration-300 bg-slate-50 dark:bg-slate-900"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
            </div>
          </label>
          <input type="file" id="doc-img" hidden onChange={handleImageChange} />
          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Upload doctor picture</p>
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
            Doctor Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-2.5 p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white group-hover:border-primary/30" required />
          </label>

          <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
            Speciality
            <div className="relative mt-2.5">
              <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white appearance-none cursor-pointer group-hover:border-primary/30" required>
                <option value="">Select Speciality</option>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </label>

          <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
            Doctor Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2.5 p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white group-hover:border-primary/30" required />
          </label>

          <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
            Education
            <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} className="mt-2.5 p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white group-hover:border-primary/30" required />
          </label>

          <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
            Doctor Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2.5 p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white group-hover:border-primary/30" required />
          </label>

          <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
            Address
            <div className="space-y-3 mt-2.5">
              <input type="text" placeholder="Line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white group-hover:border-primary/30" required />
              <input type="text" placeholder="Line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white group-hover:border-primary/30" required />
            </div>
          </label>

          <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
            Experience
            <div className="relative mt-2.5">
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white appearance-none cursor-pointer group-hover:border-primary/30" required>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} Year{i > 0 ? 's' : ''}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </label>

          <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
            Fees (₹)
            <div className="relative mt-2.5">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 font-bold">₹</span>
              <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full p-4 pl-10 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white group-hover:border-primary/30" required />
            </div>
          </label>
        </div>

        {/* About Me */}
        <label className="flex flex-col text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group">
          About Me
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="mt-2.5 p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white resize-y min-h-[140px] group-hover:border-primary/30" required />
        </label>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700/50">
          <button type="submit" className="w-full md:w-auto px-14 py-3.5 bg-gradient-to-br from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer border-none">
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctors;
