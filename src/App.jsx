import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Home from './pages/Home'
import BookingStatus from './pages/BookingStatus'
import Login from './pages/Login'
import ChangeCredentials from './pages/ChangeCredentials'
import AdminLayout from './pages/AdminLayout'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Validation from './pages/Validation'
import Pricing from './pages/Pricing'
import Offers from './pages/Offers'
import Banners from './pages/Banners'
import SpecialDates from './pages/SpecialDates'
import Users from './pages/Users'
import Settings from './pages/Settings'

const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (!user) return <Navigate to="/admin" replace />
  
  if (requireSuperAdmin && user.role !== 'super_admin') {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking-status" element={<BookingStatus />} />
      <Route path="/booking/:id" element={<BookingStatus />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Login />} />
      <Route path="/admin/change-credentials" element={<ChangeCredentials />} />
      <Route path="/admin/bookings" element={<Navigate to="/admin/dashboard/bookings" replace />} />
      <Route path="/admin/validation" element={<Navigate to="/admin/dashboard/validation" replace />} />
      <Route path="/admin/pricing" element={<Navigate to="/admin/dashboard/pricing" replace />} />
      <Route path="/admin/offers" element={<Navigate to="/admin/dashboard/offers" replace />} />
      <Route path="/admin/banners" element={<Navigate to="/admin/dashboard/banners" replace />} />
      <Route path="/admin/special-dates" element={<Navigate to="/admin/dashboard/special-dates" replace />} />
      <Route path="/admin/users" element={<Navigate to="/admin/dashboard/users" replace />} />
      <Route path="/admin/settings" element={<Navigate to="/admin/dashboard/settings" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="validation" element={<Validation />} />
        <Route path="pricing" element={
          <ProtectedRoute requireSuperAdmin>
            <Pricing />
          </ProtectedRoute>
        } />
        <Route path="offers" element={
          <ProtectedRoute requireSuperAdmin>
            <Offers />
          </ProtectedRoute>
        } />
        <Route path="banners" element={
          <ProtectedRoute requireSuperAdmin>
            <Banners />
          </ProtectedRoute>
        } />
        <Route path="special-dates" element={
          <ProtectedRoute requireSuperAdmin>
            <SpecialDates />
          </ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute requireSuperAdmin>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute requireSuperAdmin>
            <Settings />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
