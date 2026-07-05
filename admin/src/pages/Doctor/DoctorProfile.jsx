import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorProfile = () => {
  const { doctor_token, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null) // { type: 'success'|'error', msg }

  useEffect(() => {
    if (doctor_token) {
      getProfileData()
    }
  }, [doctor_token])

  useEffect(() => {
    if (profileData) {
      setEditData({ ...profileData })
    }
  }, [profileData])

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-300 animate-pulse"></div>
        <p className="text-slate-500 dark:text-slate-400">Loading profile...</p>
      </div>
    )
  }

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        {
          docId: profileData._id,
          fees: editData.fees,
          address: editData.address,
          available: editData.available,
        },
        { headers: { doctor_token: doctor_token } }
      )
      if (data.success) {
        setProfileData(editData)
        showToast('success', 'Profile updated successfully!')
        setIsEditing(false)
      } else {
        showToast('error', data.message || 'Update failed')
      }
    } catch (err) {
      showToast('error', err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const data = isEditing ? editData : profileData

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed -top-[120px] -right-[120px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.15),_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(99,102,241,0.05),_transparent_70%)] pointer-events-none" />
      <div className="fixed -bottom-[100px] -left-[100px] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,_rgba(224,231,255,0.4),_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(99,102,241,0.05),_transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start gap-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-indigo-500 to-indigo-300 p-1 shadow-md">
              <img
                src={profileData.image}
                alt={profileData.name}
                className="w-full h-full rounded-full object-cover border-[3px] border-white dark:border-slate-800"
                onError={e => { e.target.src = 'https://via.placeholder.com/140' }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 mt-1">
              <span className={`w-2 h-2 rounded-full inline-block ${profileData.available ? 'bg-green-500' : 'bg-red-500'}`} />
              {profileData.available ? 'Available' : 'Unavailable'}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap mb-3">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 m-0 tracking-tight">Dr. {profileData.name}</h1>
              <span className="bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-xs font-semibold rounded-full px-4 py-1">
                {profileData.speciality}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <MetaChip icon="🎓" label={profileData.degree} />
              <MetaChip icon="⏱" label={`${profileData.experience} yrs exp`} />
              <MetaChip icon="💳" label={`₹${profileData.fees} / visit`} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 m-0">✉ {profileData.email}</p>
          </div>

          <div className="ml-auto mt-4 md:mt-0">
            {!isEditing ? (
              <button className="bg-gradient-to-br from-indigo-500 to-indigo-400 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer shadow-md hover:opacity-90 transition-opacity" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button className={`bg-indigo-500 text-white border-none rounded-xl px-5 py-2.5 font-semibold text-sm cursor-pointer hover:bg-indigo-600 ${saving ? 'opacity-70' : ''}`} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-[1.5px] border-slate-200 dark:border-slate-600 rounded-xl px-5 py-2.5 font-semibold text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700" onClick={() => { setIsEditing(false); setEditData({ ...profileData }) }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 md:col-span-2">
            <SectionLabel>About</SectionLabel>
            {isEditing ? (
              <textarea
                className="w-full box-border border-[1.5px] border-indigo-100 dark:border-slate-600 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 font-sans resize-y outline-none bg-indigo-50/30 dark:bg-slate-900 focus:border-indigo-400"
                value={data.about}
                onChange={e => handleChange('about', e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed m-0">{profileData.about || 'No bio provided.'}</p>
            )}
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <SectionLabel>Address</SectionLabel>
            {isEditing ? (
              <>
                <input
                  className="w-full box-border border-[1.5px] border-indigo-100 dark:border-slate-600 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 font-sans outline-none bg-indigo-50/30 dark:bg-slate-900 mb-3 focus:border-indigo-400"
                  placeholder="Line 1"
                  value={data.address?.line1 || ''}
                  onChange={e => handleChange('address', { ...data.address, line1: e.target.value })}
                />
                <input
                  className="w-full box-border border-[1.5px] border-indigo-100 dark:border-slate-600 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 font-sans outline-none bg-indigo-50/30 dark:bg-slate-900 focus:border-indigo-400"
                  placeholder="Line 2"
                  value={data.address?.line2 || ''}
                  onChange={e => handleChange('address', { ...data.address, line2: e.target.value })}
                />
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-[15px] text-slate-700 dark:text-slate-300 m-0">📍 {profileData.address?.line1}</p>
                <p className="text-[15px] text-slate-700 dark:text-slate-300 m-0 ml-[22px]">{profileData.address?.line2}</p>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <SectionLabel>Availability</SectionLabel>
            {isEditing ? (
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Accept Appointments</span>
                <div
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${data.available ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  onClick={() => handleChange('available', !data.available)}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${data.available ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </label>
            ) : (
              <div className="mb-2">
                <div className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold ${profileData.available ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                  <span className={`w-2.5 h-2.5 rounded-full inline-block mr-2 ${profileData.available ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'}`} />
                  {profileData.available ? 'Accepting Appointments' : 'Not Accepting Appointments'}
                </div>
              </div>
            )}

            {/* Slots Preview */}
            <div className="mt-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Booked Slots</p>
              {Object.keys(profileData.slots_booked || {}).length === 0 ? (
                <p className="text-sm text-slate-400 m-0">No bookings yet</p>
              ) : (
                Object.entries(profileData.slots_booked).map(([date, slots]) => (
                  <div key={date} className="flex justify-between items-center py-2 px-3 bg-indigo-50/50 dark:bg-slate-700/50 rounded-xl mb-1.5 border border-indigo-100/50 dark:border-slate-600">
                    <span className="text-[13px] text-slate-700 dark:text-slate-300 font-semibold">{date.replace(/_/g, '/')}</span>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full px-2.5 py-0.5 font-semibold">{slots.length} booking{slots.length > 1 ? 's' : ''}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fees */}
          {isEditing && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 md:col-span-2">
              <SectionLabel>Consultation Fee</SectionLabel>
              <div className="flex items-center border-[1.5px] border-indigo-100 dark:border-slate-600 rounded-xl overflow-hidden bg-indigo-50/30 dark:bg-slate-900 focus-within:border-indigo-400 transition-colors max-w-[200px]">
                <span className="px-4 py-3 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-base border-r border-indigo-100 dark:border-slate-600">₹</span>
                <input
                  className="flex-1 border-none bg-transparent px-4 py-3 text-[15px] text-slate-700 dark:text-slate-300 font-sans outline-none"
                  type="number"
                  value={data.fees}
                  onChange={e => handleChange('fees', Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 text-white font-semibold text-sm rounded-xl px-6 py-3 shadow-lg z-50 animate-[slideUp_0.3s_ease] ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  )
}

const MetaChip = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-full px-3.5 py-1 text-[13px] text-indigo-600 dark:text-indigo-300 font-medium">
    <span>{icon}</span>
    <span>{label}</span>
  </div>
)

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.2px] m-0 mb-3">{children}</p>
)

export default DoctorProfile
