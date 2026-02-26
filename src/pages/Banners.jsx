import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'

const Banners = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(null)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', imagePublicId: '',
    linkUrl: '', isActive: true, displayOrder: 0, startDate: '', endDate: ''
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    const data = await api.banners.getAll()
    setBanners(data)
    setLoading(false)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      console.log('Uploading file:', file.name)
      const result = await api.cloudinary.upload(file)
      console.log('Upload result:', result)
      if (result.url) {
        setForm({ ...form, imageUrl: result.url, imagePublicId: result.publicId })
        console.log('Form updated with imageUrl:', result.url)
      } else {
        alert('Failed to get image URL from upload')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Failed to upload image')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.imageUrl) {
      alert('Please upload an image first')
      return
    }
    
    console.log('Submitting banner with imageUrl:', form.imageUrl)
    
    try {
      if (editing) {
        await api.banners.update(editing, form)
      } else {
        console.log('Creating banner with form:', JSON.stringify(form))
        const result = await api.banners.create(form)
        console.log('Banner create result:', result)
        if (result.message && result.error) {
          alert('Error: ' + result.error)
        }
      }
      setEditing(null)
      setForm({
        title: '', description: '', imageUrl: '', imagePublicId: '',
        linkUrl: '', isActive: true, displayOrder: 0, startDate: '', endDate: ''
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchBanners()
    } catch (err) {
      console.error('Submit error:', err)
      alert('Failed to save banner')
    }
  }
      console.error('Failed to save banner:', err)
      alert('Failed to save banner: ' + (err.message || 'Unknown error'))
    }
  }

  const handleEdit = (banner) => {
    setEditing(banner._id)
    setForm({
      title: banner.title,
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      imagePublicId: banner.imagePublicId || '',
      linkUrl: banner.linkUrl || '',
      isActive: banner.isActive,
      displayOrder: banner.displayOrder,
      startDate: banner.startDate?.split('T')[0] || '',
      endDate: banner.endDate?.split('T')[0] || ''
    })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this banner?')) {
      await api.banners.delete(id)
      fetchBanners()
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Banner Management</h1>

      <div className="card p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Banner' : 'Add New Banner'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {form.imageUrl && (
              <div className="mt-2 relative inline-block">
                <img src={form.imageUrl} alt="Preview" className="h-24 rounded" />
                <button type="button" onClick={() => setForm({ ...form, imageUrl: '', imagePublicId: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (optional)</label>
              <input
                type="url"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                className="input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bannerActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="bannerActive" className="text-sm text-gray-700">Active</label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={uploading}>
              {editing ? 'Update' : 'Add'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm({
                title: '', description: '', imageUrl: '', imagePublicId: '',
                linkUrl: '', isActive: true, displayOrder: 0, startDate: '', endDate: ''
              })}} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner._id} className="card overflow-hidden">
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{banner.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {banner.description && <p className="text-sm text-gray-500 mt-1">{banner.description}</p>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(banner)} className="text-sky-600 text-sm hover:underline">Edit</button>
                <button onClick={() => handleDelete(banner._id)} className="text-red-600 text-sm hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Banners
