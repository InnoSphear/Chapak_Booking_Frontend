import { useState, useEffect } from 'react'
import { api } from '../services/api'

const SpecialDates = () => {
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ date: '', type: 'SPECIAL_PRICE', name: '', adultPrice: '', kidsPrice: '' })

  useEffect(() => {
    fetchDates()
  }, [])

  const fetchDates = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.settings.getSpecialDates()
      setDates(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching special dates:', err)
      setError('Failed to load special dates')
      setDates([])
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        date: form.date,
        type: form.type,
        name: form.name,
        priceOverride: form.type === 'SPECIAL_PRICE' ? {
          adult: parseInt(form.adultPrice),
          kids: parseInt(form.kidsPrice)
        } : undefined
      }
      await api.settings.createSpecialDate(payload)
      setEditing(null)
      setForm({ date: '', type: 'SPECIAL_PRICE', name: '', adultPrice: '', kidsPrice: '' })
      fetchDates()
    } catch (err) {
      alert('Failed to save')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this special date?')) {
      await api.settings.deleteSpecialDate(id)
      fetchDates()
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchDates} className="btn-primary">Retry</button>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Special Dates & Holidays</h1>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Special Date</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input"
              >
                <option value="SPECIAL_PRICE">Special Price Day</option>
                <option value="CLOSED">Closed (No Booking)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="e.g., Independence Day"
            />
          </div>

          {form.type === 'SPECIAL_PRICE' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adult Price (₹)</label>
                <input
                  type="number"
                  value={form.adultPrice}
                  onChange={(e) => setForm({ ...form, adultPrice: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kids Price (₹)</label>
                <input
                  type="number"
                  value={form.kidsPrice}
                  onChange={(e) => setForm({ ...form, kidsPrice: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary">Add Special Date</button>
        </form>
      </div>

      <div className="space-y-4">
        {dates.map((d) => (
          <div key={d._id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{d.name || new Date(d.date).toLocaleDateString()}</h3>
                <span className={`px-2 py-1 rounded text-xs ${d.type === 'CLOSED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {d.type === 'CLOSED' ? 'Closed' : 'Special Price'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{new Date(d.date).toLocaleDateString()}</p>
              {d.type === 'SPECIAL_PRICE' && d.priceOverride && (
                <p className="text-sm text-gray-600">₹{d.priceOverride.adult} (Adult) | ₹{d.priceOverride.kids} (Kids)</p>
              )}
            </div>
            <button onClick={() => handleDelete(d._id)} className="text-red-600 text-sm hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpecialDates
