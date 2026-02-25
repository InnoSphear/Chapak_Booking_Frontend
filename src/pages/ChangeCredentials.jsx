import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import logo from '../assets/logo.png'

const ChangeCredentials = () => {
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { changePassword, user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    if (email && email !== user?.email) {
      const emailResult = await api.auth.updateEmail({ newEmail: email, password: currentPassword })
      if (emailResult.message) {
        setSuccess('Email updated successfully')
      } else {
        setError(emailResult.message || 'Failed to update email')
        setLoading(false)
        return
      }
    }

    if (newPassword) {
      const pwdResult = await changePassword(currentPassword, newPassword)
      if (pwdResult.message) {
        setSuccess('Password changed successfully')
        setTimeout(() => navigate('/admin/dashboard'), 1500)
      } else {
        setError(pwdResult.message || 'Failed to change password')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 p-4 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 320" className="w-full h-48 md:h-64">
          <path fill="rgba(255,255,255,0.2)" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="h-20 w-20 mx-auto mb-4 object-contain rounded-xl bg-white/10 p-2" />
          <h1 className="text-3xl font-bold text-white">Chapak Water Park</h1>
          <p className="text-sky-100 mt-2">Change Your Credentials</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">First Time Login</h2>
          <p className="text-sm text-gray-600 mb-6">Please update your email and password for security.</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder={user?.email || 'newemail@example.com'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Updating...' : 'Update Credentials'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangeCredentials
