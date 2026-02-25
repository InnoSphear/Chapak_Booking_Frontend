import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../services/api'
import logo from '../assets/logo.png'

const BookingStatus = () => {
  const { id } = useParams()
  const [bookingId, setBookingId] = useState('')
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      setBookingId(id)
      searchBookingById(id)
    }
  }, [id])

  const searchBookingById = async (bookingId) => {
    setLoading(true)
    setError('')
    try {
      const result = await api.bookings.getById(bookingId)
      if (result.bookingId) {
        setBooking(result)
      } else {
        setError('Booking not found')
        setBooking(null)
      }
    } catch (err) {
      setError('Failed to fetch booking')
    }
    setLoading(false)
  }

  const searchBooking = async () => {
    if (!bookingId.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await api.bookings.getById(bookingId)
      if (result.bookingId) {
        setBooking(result)
      } else {
        setError('Booking not found')
        setBooking(null)
      }
    } catch (err) {
      setError('Failed to fetch booking')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="bg-sky-600 text-white py-3 sm:py-4 px-4 sm:px-6 shadow-lg relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-3 bg-white/10 transform -skew-x-12"></div>
        <div className="max-w-4xl mx-auto flex justify-between items-center relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-10 sm:h-12 w-10 sm:w-12 object-contain rounded-lg bg-white/10 p-1" />
            <span className="text-lg sm:text-2xl font-bold">Chapak Water Park</span>
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8 content-wrapper">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Check Booking Status</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter Booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="input"
            />
            <button onClick={searchBooking} disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? '...' : 'Search'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {booking && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono font-bold text-lg">{booking.bookingId}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.verified ? '✓ Verified' : 'Pending'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Visit Date:</strong> {new Date(booking.visitDate).toLocaleDateString()}</p>
                <p><strong>Name:</strong> {booking.customer.name}</p>
                <p><strong>Email:</strong> {booking.customer.email}</p>
                <p><strong>Mobile:</strong> {booking.customer.mobile}</p>
                <p><strong>Adults:</strong> {booking.tickets.adult}</p>
                <p><strong>Kids:</strong> {booking.tickets.kids}</p>
                <p><strong>Total Paid:</strong> ₹{booking.pricing.finalAmount}</p>
                <p><strong>Payment Status:</strong> {booking.payment.status}</p>
              </div>

              {booking.verified && booking.verifiedAt && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-700 text-sm">✓ Verified on {new Date(booking.verifiedAt).toLocaleString()}</p>
                </div>
              )}

              {booking.qrCode && (
                <div className="mt-4 text-center">
                  <img src={booking.qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">Show this QR code at the entrance</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Link to="/" className="block text-center mt-4 text-sky-600 hover:underline">
          ← Back to Home
        </Link>
      </main>
    </div>
  )
}

export default BookingStatus
