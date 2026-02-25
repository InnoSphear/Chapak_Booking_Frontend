import { useState, useEffect } from 'react'
import { api } from '../services/api'

const Pricing = () => {
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ type: '', adultPrice: '', kidsPrice: '', isActive: true })

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    const data = await api.pricing.getAll()
    setPricing(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.pricing.update(editing, form)
      } else {
        await api.pricing.create(form)
      }
      setForm({ type: '', adultPrice: '', kidsPrice: '', isActive: true })
      setEditing(null)
      fetchPricing()
    } catch (err) {
      alert('Failed to save pricing')
    }
  }

  const handleEdit = (p) => {
    setEditing(p._id)
    setForm({ type: p.type, adultPrice: p.adultPrice, kidsPrice: p.kidsPrice, isActive: p.isActive })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this pricing?')) {
      await api.pricing.delete(id)
      fetchPricing()
    }
  }

  const pricingTypes = [
    { value: 'weekday', label: 'Weekday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
    { value: 'holiday', label: 'Holiday' }
  ]

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Ticket Pricing</h1>

      <div className="card p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Pricing' : 'Add Pricing'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="input"
              required
            >
              <option value="">Select type</option>
              {pricingTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {editing ? 'Update' : 'Add'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm({ type: '', adultPrice: '', kidsPrice: '', isActive: true }) }} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {pricing.map((p) => (
          <div key={p._id} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg capitalize">{p.type}</h3>
              <span className={`px-2 py-1 rounded text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {p.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Adult:</span> ₹{p.adultPrice}</p>
              <p><span className="text-gray-500">Kids:</span> ₹{p.kidsPrice}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(p)} className="text-sky-600 text-sm hover:underline">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pricing
