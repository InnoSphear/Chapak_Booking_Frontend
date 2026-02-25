import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchBookings()
  }, [page])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await api.bookings.getAll({ page, search })
      setBookings(data.bookings || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchBookings()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Bookings</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full sm:w-40 md:w-64"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">Search</button>
        </form>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4 sm:p-8 text-center">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="p-4 sm:p-8 text-center text-gray-500">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Customer</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Tickets</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className="font-mono text-xs sm:text-sm">{booking.bookingId}</span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                      <p className="text-xs sm:text-sm font-medium">{booking.customer.name}</p>
                      <p className="text-xs text-gray-500">{booking.customer.mobile}</p>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      {new Date(booking.visitDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
                      A: {booking.tickets.adult}, K: {booking.tickets.kids}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">
                      ₹{booking.pricing.finalAmount}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                        booking.payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.payment.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      {booking.verified ? (
                        <span className="text-green-600 text-xs sm:text-sm">✓</span>
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Bookings
