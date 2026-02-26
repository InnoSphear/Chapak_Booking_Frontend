import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../services/api'
import logo from '../assets/logo.png'

const BookingStatus = () => {
  const { id } = useParams()
  const [bookingId, setBookingId] = useState('')
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const ticketRef = useRef(null)

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

  const downloadTicket = async () => {
    if (!booking?.qrCode) return
    
    const visitDate = new Date(booking.visitDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const ticketContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Ticket - ${booking.bookingId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
    .ticket { border: 2px solid #0284c7; border-radius: 10px; padding: 20px; }
    .header { text-align: center; background: #0284c7; color: white; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0; }
    .qr { text-align: center; margin: 20px 0; }
    .qr img { width: 200px; height: 200px; }
    .details { margin: 20px 0; }
    .details p { margin: 8px 0; }
    .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <h1>Chapak Water Park</h1>
      <p>Entry Ticket</p>
    </div>
    <div class="qr">
      <img src="${booking.qrCode}" alt="QR Code" />
    </div>
    <div class="details">
      <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
      <p><strong>Visit Date:</strong> ${visitDate}</p>
      <p><strong>Name:</strong> ${booking.customer.name}</p>
      <p><strong>Adults:</strong> ${booking.tickets.adult}</p>
      <p><strong>Kids:</strong> ${booking.tickets.kids}</p>
      <p><strong>Total Paid:</strong> ₹${booking.pricing.finalAmount}</p>
      <p><strong>Status:</strong> ${booking.payment.status}</p>
    </div>
    <div class="footer">
      <p>Show this QR code at the entrance</p>
      <p>Thank you for visiting Chapak Water Park!</p>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>
    `

    const printWindow = window.open('', '_blank')
    printWindow.document.write(ticketContent)
    printWindow.document.close()
  }

  const sendToWhatsApp = async () => {
    setSending(true)
    try {
      const result = await api.bookings.sendTicket(booking.bookingId, 'whatsapp')
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank')
      }
    } catch (err) {
      alert('Failed to send to WhatsApp')
    }
    setSending(false)
  }

  const sendSMS = async () => {
    setSending(true)
    try {
      const result = await api.bookings.sendTicket(booking.bookingId, 'sms')
      if (result.smsUrl) {
        window.location.href = result.smsUrl
      }
    } catch (err) {
      alert('Failed to open SMS')
    }
    setSending(false)
  }

  const sendBoth = async () => {
    setSending(true)
    try {
      const result = await api.bookings.sendTicket(booking.bookingId, 'both')
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank')
      }
      setTimeout(() => {
        if (result.smsUrl) {
          window.location.href = result.smsUrl
        }
        setSending(false)
      }, 1000)
    } catch (err) {
      alert('Failed to send')
      setSending(false)
    }
  }

  const visitDate = booking ? new Date(booking.visitDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : ''

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
            <div className="border-t pt-4" ref={ticketRef}>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono font-bold text-lg">{booking.bookingId}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.verified ? '✓ Verified' : 'Pending'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Visit Date:</strong> {visitDate}</p>
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

              <div className="mt-4 space-y-2">
                <button
                  onClick={downloadTicket}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Ticket
                </button>

                {booking.payment.status === 'PAID' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={sendToWhatsApp}
                      disabled={sending}
                      className="btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      onClick={sendSMS}
                      disabled={sending}
                      className="btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      SMS
                    </button>
                  </div>
                )}

                {booking.payment.status === 'PAID' && (
                  <button
                    onClick={sendBoth}
                    disabled={sending}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Send WhatsApp & SMS
                  </button>
                )}
              </div>
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
