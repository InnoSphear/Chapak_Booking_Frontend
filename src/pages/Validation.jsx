import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'

const Validation = () => {
  const [mode, setMode] = useState('search')
  const [bookingId, setBookingId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [todayStats, setTodayStats] = useState({ total: 0, verified: 0, pending: 0 })
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetchTodayStats()
  }, [])

  const fetchTodayStats = async () => {
    try {
      const data = await api.validation.getToday()
      setTodayStats(data)
    } catch (err) {
      console.error(err)
    }
  }

  const validateTicket = async () => {
    if (!bookingId.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await api.validation.validate({ bookingId: bookingId.trim() })
      setResult(response)
      if (response.valid) {
        fetchTodayStats()
      }
    } catch (err) {
      setError('Validation failed')
    }
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateTicket()
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Camera access denied')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Ticket Validation</h1>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="card p-2 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">Today's Total</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{todayStats.total}</p>
        </div>
        <div className="card p-2 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">Verified</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{todayStats.verified}</p>
        </div>
        <div className="card p-2 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">{todayStats.pending}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode('search'); stopCamera() }}
          className={`px-4 py-2 rounded-lg ${mode === 'search' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => { setMode('scan'); startCamera() }}
          className={`px-4 py-2 rounded-lg ${mode === 'scan' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          QR Scanner
        </button>
      </div>

      {mode === 'search' && (
        <div className="card p-6 max-w-md">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter Booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input flex-1"
              autoFocus
            />
            <button onClick={validateTicket} disabled={loading} className="btn-primary">
              {loading ? '...' : 'Validate'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-lg ${result.valid ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.valid ? (
                  <span className="text-green-600 text-2xl">✓</span>
                ) : (
                  <span className="text-red-600 text-2xl">✗</span>
                )}
                <span className={`font-semibold ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {result.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{result.message}</p>
              
              {result.booking && (
                <div className="text-sm bg-white p-3 rounded border">
                  <p><strong>ID:</strong> {result.booking.bookingId}</p>
                  <p><strong>Name:</strong> {result.booking.customer.name}</p>
                  <p><strong>Date:</strong> {new Date(result.booking.visitDate).toLocaleDateString()}</p>
                  <p><strong>Tickets:</strong> {result.booking.tickets.adult} Adult, {result.booking.tickets.kids} Kid</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {mode === 'scan' && (
        <div className="card p-6 max-w-md">
          <div className="relative">
            <video ref={videoRef} className="w-full rounded-lg" autoPlay playsInline />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Point camera at QR code to scan
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-4 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Validation
