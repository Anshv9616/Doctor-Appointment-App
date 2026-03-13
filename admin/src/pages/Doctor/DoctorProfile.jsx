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
      <div style={styles.loadingWrapper}>
        <div style={styles.pulse}></div>
        <p style={styles.loadingText}>Loading profile...</p>
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
    <div style={styles.page}>
      {/* Background decoration */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />

      <div style={styles.container}>
        {/* Header Card */}
        <div style={styles.headerCard}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarRing}>
              <img
                src={profileData.image}
                alt={profileData.name}
                style={styles.avatar}
                onError={e => { e.target.src = 'https://via.placeholder.com/140' }}
              />
            </div>
            <div style={styles.availableBadge}>
              <span style={{
                ...styles.availableDot,
                background: profileData.available ? '#22c55e' : '#ef4444'
              }} />
              {profileData.available ? 'Available' : 'Unavailable'}
            </div>
          </div>

          <div style={styles.headerInfo}>
            <div style={styles.nameRow}>
              <h1 style={styles.doctorName}>Dr. {profileData.name}</h1>
              <span style={styles.specialityTag}>{profileData.speciality}</span>
            </div>
            <div style={styles.metaRow}>
              <MetaChip icon="🎓" label={profileData.degree} />
              <MetaChip icon="⏱" label={`${profileData.experience} yrs exp`} />
              <MetaChip icon="💳" label={`₹${profileData.fees} / visit`} />
            </div>
            <p style={styles.email}>✉ {profileData.email}</p>
          </div>

          <div style={styles.editBtnWrapper}>
            {!isEditing ? (
              <button style={styles.editBtn} onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <div style={styles.actionBtns}>
                <button style={{...styles.saveBtn, opacity: saving ? 0.7 : 1}} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button style={styles.cancelBtn} onClick={() => { setIsEditing(false); setEditData({ ...profileData }) }}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        {/* Body Grid */}
        <div style={styles.grid}>
          {/* About */}
          <div style={{ ...styles.card, gridColumn: 'span 2' }}>
            <SectionLabel>About</SectionLabel>
            {isEditing ? (
              <textarea
                style={styles.textarea}
                value={data.about}
                onChange={e => handleChange('about', e.target.value)}
                rows={4}
              />
            ) : (
              <p style={styles.aboutText}>{profileData.about || 'No bio provided.'}</p>
            )}
          </div>

          {/* Address */}
          <div style={styles.card}>
            <SectionLabel>Address</SectionLabel>
            {isEditing ? (
              <>
                <input
                  style={styles.input}
                  placeholder="Line 1"
                  value={data.address?.line1 || ''}
                  onChange={e => handleChange('address', { ...data.address, line1: e.target.value })}
                />
                <input
                  style={{ ...styles.input, marginTop: 10 }}
                  placeholder="Line 2"
                  value={data.address?.line2 || ''}
                  onChange={e => handleChange('address', { ...data.address, line2: e.target.value })}
                />
              </>
            ) : (
              <div style={styles.addressBlock}>
                <p style={styles.addressLine}>📍 {profileData.address?.line1}</p>
                <p style={styles.addressLine}>{profileData.address?.line2}</p>
              </div>
            )}
          </div>

          {/* Availability */}
          <div style={styles.card}>
            <SectionLabel>Availability</SectionLabel>
            {isEditing ? (
              <label style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Accept Appointments</span>
                <div
                  style={{
                    ...styles.toggle,
                    background: data.available ? '#6366f1' : '#d1d5db'
                  }}
                  onClick={() => handleChange('available', !data.available)}
                >
                  <div style={{
                    ...styles.toggleThumb,
                    transform: data.available ? 'translateX(22px)' : 'translateX(2px)'
                  }} />
                </div>
              </label>
            ) : (
              <div style={styles.availabilityDisplay}>
                <div style={{
                  ...styles.availabilityIndicator,
                  background: profileData.available ? '#dcfce7' : '#fee2e2',
                  color: profileData.available ? '#16a34a' : '#dc2626'
                }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: profileData.available ? '#16a34a' : '#dc2626',
                    display: 'inline-block', marginRight: 8
                  }} />
                  {profileData.available ? 'Accepting Appointments' : 'Not Accepting Appointments'}
                </div>
              </div>
            )}

            {/* Slots Preview */}
            <div style={{ marginTop: 20 }}>
              <p style={styles.slotTitle}>Booked Slots</p>
              {Object.keys(profileData.slots_booked || {}).length === 0 ? (
                <p style={styles.noSlots}>No bookings yet</p>
              ) : (
                Object.entries(profileData.slots_booked).map(([date, slots]) => (
                  <div key={date} style={styles.slotRow}>
                    <span style={styles.slotDate}>{date.replace(/_/g, '/')}</span>
                    <span style={styles.slotCount}>{slots.length} booking{slots.length > 1 ? 's' : ''}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fees */}
          {isEditing && (
            <div style={styles.card}>
              <SectionLabel>Consultation Fee</SectionLabel>
              <div style={styles.feeInputWrapper}>
                <span style={styles.feeSymbol}>₹</span>
                <input
                  style={styles.feeInput}
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
        <div style={{
          ...styles.toast,
          background: toast.type === 'success' ? '#22c55e' : '#ef4444',
        }}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  )
}

const MetaChip = ({ icon, label }) => (
  <div style={styles.chip}>
    <span>{icon}</span>
    <span>{label}</span>
  </div>
)

const SectionLabel = ({ children }) => (
  <p style={styles.sectionLabel}>{children}</p>
)

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f7ff',
    padding: '40px 24px',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgOrb1: {
    position: 'fixed', top: -120, right: -120,
    width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, #c7d2fe55, transparent 70%)',
    pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'fixed', bottom: -100, left: -100,
    width: 350, height: 350, borderRadius: '50%',
    background: 'radial-gradient(circle, #e0e7ff55, transparent 70%)',
    pointerEvents: 'none',
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  headerCard: {
    background: 'white',
    borderRadius: 24,
    padding: '32px 36px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 28,
    boxShadow: '0 4px 24px #6366f115',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  avatarSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
  },
  avatarRing: {
    width: 120, height: 120, borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
    padding: 3, boxShadow: '0 8px 24px #6366f130',
  },
  avatar: {
    width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
    border: '3px solid white',
  },
  availableBadge: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12, fontWeight: 600, color: '#374151',
    background: '#f3f4f6', borderRadius: 20, padding: '4px 12px',
  },
  availableDot: {
    width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 12,
  },
  doctorName: {
    fontSize: 28, fontWeight: 700, color: '#111827', margin: 0,
    letterSpacing: '-0.5px',
  },
  specialityTag: {
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: 'white', fontSize: 12, fontWeight: 600,
    borderRadius: 20, padding: '4px 14px',
  },
  metaRow: {
    display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12,
  },
  chip: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#f0f0ff', border: '1px solid #e0e7ff',
    borderRadius: 20, padding: '5px 14px',
    fontSize: 13, color: '#4f46e5', fontWeight: 500,
  },
  email: {
    fontSize: 13, color: '#6b7280', margin: 0,
  },
  editBtnWrapper: {
    marginLeft: 'auto',
  },
  editBtn: {
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: 'white', border: 'none', borderRadius: 12,
    padding: '10px 22px', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', boxShadow: '0 4px 12px #6366f130',
    transition: 'opacity 0.2s',
  },
  actionBtns: { display: 'flex', gap: 10 },
  saveBtn: {
    background: '#6366f1', color: 'white', border: 'none',
    borderRadius: 12, padding: '10px 20px', fontWeight: 600,
    fontSize: 14, cursor: 'pointer',
  },
  cancelBtn: {
    background: 'white', color: '#6b7280',
    border: '1.5px solid #e5e7eb', borderRadius: 12,
    padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  card: {
    background: 'white', borderRadius: 20,
    padding: '24px 28px',
    boxShadow: '0 2px 16px #6366f10d',
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: '1.2px', margin: '0 0 14px',
  },
  aboutText: {
    fontSize: 15, color: '#374151', lineHeight: 1.7, margin: 0,
  },
  textarea: {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e0e7ff', borderRadius: 12,
    padding: '12px 14px', fontSize: 14, color: '#374151',
    fontFamily: 'inherit', resize: 'vertical', outline: 'none',
    background: '#f8f7ff',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e0e7ff', borderRadius: 12,
    padding: '11px 14px', fontSize: 14, color: '#374151',
    fontFamily: 'inherit', outline: 'none', background: '#f8f7ff',
  },
  addressBlock: { display: 'flex', flexDirection: 'column', gap: 4 },
  addressLine: { fontSize: 15, color: '#374151', margin: 0 },
  availabilityDisplay: { marginBottom: 8 },
  availabilityIndicator: {
    display: 'inline-flex', alignItems: 'center',
    borderRadius: 12, padding: '8px 16px', fontSize: 14, fontWeight: 600,
  },
  toggleRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    cursor: 'pointer',
  },
  toggleLabel: { fontSize: 14, color: '#374151', fontWeight: 500 },
  toggle: {
    width: 46, height: 26, borderRadius: 13,
    position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
  },
  toggleThumb: {
    position: 'absolute', top: 2,
    width: 22, height: 22, borderRadius: '50%',
    background: 'white', boxShadow: '0 1px 4px #0002',
    transition: 'transform 0.3s',
  },
  slotTitle: {
    fontSize: 12, fontWeight: 700, color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10,
  },
  noSlots: { fontSize: 13, color: '#9ca3af' },
  slotRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 12px', background: '#f8f7ff', borderRadius: 10, marginBottom: 6,
  },
  slotDate: { fontSize: 13, color: '#374151', fontWeight: 600 },
  slotCount: {
    fontSize: 12, background: '#e0e7ff', color: '#4f46e5',
    borderRadius: 20, padding: '2px 10px', fontWeight: 600,
  },
  feeInputWrapper: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #e0e7ff', borderRadius: 12,
    overflow: 'hidden', background: '#f8f7ff',
  },
  feeSymbol: {
    padding: '11px 14px', background: '#ede9fe',
    color: '#6366f1', fontWeight: 700, fontSize: 16,
  },
  feeInput: {
    flex: 1, border: 'none', background: 'transparent',
    padding: '11px 14px', fontSize: 15, color: '#374151',
    fontFamily: 'inherit', outline: 'none',
  },
  loadingWrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: 16,
  },
  pulse: {
    width: 48, height: 48, borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  loadingText: { color: '#9ca3af', fontFamily: 'inherit' },
  toast: {
    position: 'fixed', bottom: 32, right: 32,
    color: 'white', fontWeight: 600, fontSize: 14,
    borderRadius: 14, padding: '14px 24px',
    boxShadow: '0 8px 24px #0002',
    zIndex: 1000,
    animation: 'slideUp 0.3s ease',
  },
}

export default DoctorProfile
