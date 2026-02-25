import { useState, useEffect } from 'react'
import { api } from '../services/api'

const Offers = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', type: 'percentage', value: '',
    applicableTo: 'both', validFrom: '', validTo: '',
    maxUsagePerDay: '', priority: 0, isActive: true, allowStacking: false,
    minTickets: 1, maxDiscount: ''
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    const data = await api.offers.getAll()
    setOffers(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (payload.maxUsagePerDay === '') payload.maxUsagePerDay = null
      if (payload.maxDiscount === '') payload.maxDiscount = null
      
      if (editing) {
        await api.offers.update(editing, payload)
      } else {
        await api.offers.create(payload)
      }
      setEditing(null)
      setForm({
        name: '', description: '', type: 'percentage', value: '',
        applicableTo: 'both', validFrom: '', validTo: '',
        maxUsagePerDay: '', priority: 0, isActive: true, allowStacking: false,
        minTickets: 1, maxDiscount: ''
      })
      fetchOffers()
    } catch (err) {
      alert('Failed to save offer')
    }
  }

  const handleEdit = (offer) => {
    setEditing(offer._id)
    setForm({
      name: offer.name,
      description: offer.description || '',
      type: offer.type,
      value: offer.value,
      applicableTo: offer.applicableTo,
      validFrom: offer.validFrom?.split('T')[0] || '',
      validTo: offer.validTo?.split('T')[0] || '',
      maxUsagePerDay: offer.maxUsagePerDay || '',
      priority: offer.priority,
      isActive: offer.isActive,
      allowStacking: offer.allowStacking,
      minTickets: offer.minTickets,
      maxDiscount: offer.maxDiscount || ''
    })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this offer?')) {
      await api.offers.delete(id)
      fetchOffers()
    }
  }

  const offerTypes = [
    { value: 'buy1get1', label: 'Buy 1 Get 1 Free' },
    { value: 'buy2get1', label: 'Buy 2 Get 1 Free' },
    { value: 'buy3get1', label: 'Buy 3 Get 1 Free' },
    { value: 'kids_discount', label: 'Kids Discount' },
    { value: 'percentage', label: 'Percentage Discount' },
    { value: 'flat', label: 'Flat Discount (₹)' }
  ]

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Offers & Discounts</h1>

      <div className="card p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Offer' : 'Create New Offer'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input"
                required
              >
                {offerTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.type === 'flat' ? 'Discount Amount (₹)' : 'Discount Value (%)'}
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
              <select
                value={form.applicableTo}
                onChange={(e) => setForm({ ...form, applicableTo: e.target.value })}
                className="input"
              >
                <option value="both">Both</option>
                <option value="adults">Adults Only</option>
                <option value="kids">Kids Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
              <input
                type="date"
                value={form.validFrom}
                onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
              <input
                type="date"
                value={form.validTo}
                onChange={(e) => setForm({ ...form, validTo: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Tickets</label>
              <input
                type="number"
                value={form.minTickets}
                onChange={(e) => setForm({ ...form, minTickets: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Usage/Day</label>
              <input
                type="number"
                value={form.maxUsagePerDay}
                onChange={(e) => setForm({ ...form, maxUsagePerDay: e.target.value })}
                className="input"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (₹)</label>
              <input
                type="number"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                className="input"
                placeholder="No limit"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {editing ? 'Update' : 'Create'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm({
                name: '', description: '', type: 'percentage', value: '',
                applicableTo: 'both', validFrom: '', validTo: '',
                maxUsagePerDay: '', priority: 0, isActive: true, allowStacking: false,
                minTickets: 1, maxDiscount: ''
              })}} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <div key={offer._id} className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{offer.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {offer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {offer.type === 'percentage' ? `${offer.value}% off` : 
                 offer.type === 'flat' ? `₹${offer.value} off` : 
                 offer.type.replace('get', ' Get ')} | {offer.applicableTo}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(offer)} className="text-sky-600 text-sm hover:underline">Edit</button>
              <button onClick={() => handleDelete(offer._id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Offers
