import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import logo from '../assets/logo.png'

const defaultBanners = [
  {
    _id: '1',
    title: 'Welcome to Chapak Water Park',
    description: 'Enjoy a splashing good time with your family!',
    imageUrl: 'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=1200'
  },
  {
    _id: '2',
    title: 'Special Weekend Offer',
    description: 'Get amazing discounts on all tickets!',
    imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=1200'
  },
  {
    _id: '3',
    title: 'Kids Day Out',
    description: 'Fun rides for the whole family!',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-68c894913dbb?w=1200'
  }
]

const BannerSlider = () => {
  const [banners, setBanners] = useState(defaultBanners)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    api.banners.getActive()
      .then(data => {
        if (data && data.length > 0) {
          setBanners(data)
        }
      })
      .catch(() => {
        // Use default banners on error
      })
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  return (
    <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl">
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-500 ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl md:text-3xl font-bold">{banner.title}</h2>
            {banner.description && <p className="text-sm mt-1 opacity-90">{banner.description}</p>}
          </div>
        </div>
      ))}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === current ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const BookingForm = () => {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [kids, setKids] = useState(0)
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState({ name: '', email: '', mobile: '' })
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (date && date >= today && (adults > 0 || kids > 0)) {
      calculatePricing()
    } else if (adults === 0 && kids === 0) {
      setPricing(null)
    }
  }, [date, adults, kids])

  const calculatePricing = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await api.bookings.calculate({ visitDate: date, adults, kids })
      
      if (result && result.isClosed) {
        setError('Park is closed on this date. Please select another date.')
        setPricing(null)
      } else if (result && result.message && result.message.includes('at least one ticket')) {
        setPricing(null)
      } else if (result && result.finalAmount !== undefined) {
        setPricing(result)
      } else {
        const baseAdult = 800
        const baseKids = 500
        const baseAmount = (adults * baseAdult) + (kids * baseKids)
        setPricing({
          pricing: { adultPrice: baseAdult, kidsPrice: baseKids, type: 'weekday' },
          baseAmount,
          discount: 0,
          finalAmount: baseAmount
        })
      }
    } catch (err) {
      console.error('Pricing error:', err)
      const baseAdult = 800
      const baseKids = 500
      const baseAmount = (adults * baseAdult) + (kids * baseKids)
      setPricing({
        pricing: { adultPrice: baseAdult, kidsPrice: baseKids, type: 'weekday' },
        baseAmount,
        discount: 0,
        finalAmount: baseAmount
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (adults === 0 && kids === 0) {
      setError('Please select at least one ticket')
      return
    }
    
    if (!customer.name || !customer.mobile) {
      setError('Please provide your name and mobile number')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      const result = await api.bookings.create({
        visitDate: date,
        adults,
        kids,
        customer
      })
      if (result.bookingId) {
        setBooking(result)
        setStep(3)
      } else {
        setError(result.message || 'Failed to create booking')
      }
    } catch (err) {
      setError('Failed to create booking')
    }
    setLoading(false)
  }

  const handlePayment = async () => {
    if (!booking) return
    setLoading(true)
    try {
      const paymentResult = await api.bookings.paymentSuccess(booking.bookingId, {
        transactionId: 'TXN' + Date.now(),
        paymentId: 'PAY' + Date.now()
      })
      if (paymentResult.payment?.status === 'PAID') {
        setBooking(paymentResult)
      }
    } catch (err) {
      setError('Payment verification failed')
    }
    setLoading(false)
  }

  if (step === 3 && booking) {
    return (
      <div className="card p-8 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-4">Booking ID: <span className="font-mono font-bold">{booking.bookingId}</span></p>
        
        {booking.qrCode && (
          <div className="mb-4">
            <img src={booking.qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
            <p className="text-xs text-gray-500 mt-2">Show this QR code at the entrance</p>
          </div>
        )}

        <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
          <p><strong>Visit Date:</strong> {new Date(booking.visitDate).toLocaleDateString()}</p>
          <p><strong>Adults:</strong> {booking.tickets.adult}</p>
          <p><strong>Kids:</strong> {booking.tickets.kids}</p>
          <p><strong>Total:</strong> ₹{booking.pricing.finalAmount}</p>
        </div>

        <Link to={`/booking/${booking.bookingId}`} className="btn-primary block w-full">
          View Booking Details
        </Link>
      </div>
    )
  }

  return (
    <div className="card p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Tickets</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Visit Date</label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adults (18+ years)</label>
            <input
              type="number"
              min="0"
              value={adults}
              onChange={(e) => setAdults(Math.max(0, parseInt(e.target.value) || 0))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kids (below 12 years)</label>
            <input
              type="number"
              min="0"
              value={kids}
              onChange={(e) => setKids(Math.max(0, parseInt(e.target.value) || 0))}
              className="input"
            />
          </div>
        </div>

        {loading && <p className="text-center text-gray-500">Loading pricing...</p>}
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {pricing && !error && (
          <div className="bg-sky-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Adult (₹{pricing.pricing.adultPrice} × {adults})</span>
              <span>₹{pricing.pricing.adultPrice * adults}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Kids (₹{pricing.pricing.kidsPrice} × {kids})</span>
              <span>₹{pricing.pricing.kidsPrice * kids}</span>
            </div>
            {pricing.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>Discount ({pricing.offer})</span>
                <span>-₹{pricing.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t">
              <span>Total</span>
              <span>₹{pricing.finalAmount}</span>
            </div>
          </div>
        )}

        {step === 2 && pricing && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={customer.mobile}
                onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {step === 1 && pricing && !error && adults + kids > 0 && (
            <button type="button" onClick={() => setStep(2)} className="btn-primary flex-1">
              Continue
            </button>
          )}
          {step === 1 && (!pricing || adults + kids === 0) && (
            <p className="text-sm text-gray-500 text-center w-full">
              {date ? 'Please select at least one ticket to continue' : 'Please select a date to see pricing'}
            </p>
          )}
          {step === 2 && (
            <>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                Back
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

const Home = () => {
  return (
    <div className="min-h-screen pb-24 content-wrapper">
      <header className="bg-sky-600 text-white py-3 sm:py-4 px-4 sm:px-6 shadow-lg relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-8 bg-white/10 transform -skew-x-12 -translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto flex justify-between items-center relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-10 sm:h-12 w-10 sm:w-12 object-contain rounded-lg bg-white/10 p-1" />
            <h1 className="text-lg sm:text-2xl font-bold">Chapak Water Park</h1>
          </Link>
          <Link to="/admin" className="text-xs sm:text-sm hover:text-sky-200">Admin Login</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <BannerSlider />
        
        <div className="mt-8">
          <BookingForm />
        </div>

        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold mb-4">Check Your Booking</h3>
          <Link to="/booking-status" className="btn-secondary inline-block">
            View Booking Status
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
