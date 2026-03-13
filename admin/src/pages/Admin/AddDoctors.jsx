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
    <div className="p-6 bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit} className="w-[800px] mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Add Doctor</h1>

        {/* Upload Section */}
        <div className="flex flex-col items-center">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              src={docImg instanceof File ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload"
              className="w-28 h-28 object-cover border rounded-full"
            />
          </label>
          <input type="file" id="doc-img" hidden onChange={handleImageChange} />
          <p className="mt-1 text-sm text-gray-600">Upload doctor picture</p>
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Doctor Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 border rounded-md" required />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Speciality
            <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="mt-1 p-2 border rounded-md" required>
              <option value="">Select</option>
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Doctor Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 border rounded-md" required />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Education
            <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} className="mt-1 p-2 border rounded-md" required />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Doctor Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 border rounded-md" required />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Address
            <input type="text" placeholder="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} className="mt-1 p-2 border rounded-md mb-2" required />
            <input type="text" placeholder="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} className="p-2 border rounded-md" required />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Experience
            <select value={experience} onChange={(e) => setExperience(e.target.value)} className="mt-1 p-2 border rounded-md" required>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Fees
            <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} className="mt-1 p-2 border rounded-md" required />
          </label>
        </div>

        {/* About Me */}
        <label className="flex flex-col text-sm font-medium text-gray-700">
          About Me
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="mt-1 p-2 border rounded-md resize-none h-20" rows={5} required />
        </label>

        {/* Submit Button */}
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default AddDoctors;
