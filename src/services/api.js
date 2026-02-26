const API_URL = import.meta.env.VITE_API_URL || 'https://chapak-booking-backend.onrender.com/api'

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

export const api = {
  auth: {
    login: (data) => fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    
    changePassword: (data) => fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),

    updateEmail: (data) => fetch(`${API_URL}/auth/update-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),

    getUsers: () => fetch(`${API_URL}/auth/users`, {
      headers: getHeaders()
    }).then(res => res.json()),

    createUser: (data) => fetch(`${API_URL}/auth/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),

    deleteUser: (id) => fetch(`${API_URL}/auth/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json())
  },

  bookings: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return fetch(`${API_URL}/bookings?${query}`, {
        headers: getHeaders()
      }).then(res => res.json())
    },

    getById: (id) => fetch(`${API_URL}/bookings/${id}`).then(res => res.json()),

    calculate: (data) => fetch(`${API_URL}/bookings/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

    create: (data) => fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

    paymentSuccess: (id, data) => fetch(`${API_URL}/bookings/${id}/payment-success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

    paymentFailed: (id) => fetch(`${API_URL}/bookings/${id}/payment-failed`, {
      method: 'POST',
      headers: getHeaders()
    }).then(res => res.json()),

    getStats: () => fetch(`${API_URL}/bookings/stats/dashboard`, {
      headers: getHeaders()
    }).then(res => res.json()),

    getTicket: (id) => fetch(`${API_URL}/bookings/${id}/ticket`).then(res => res.json()),

    sendTicket: (id, method) => fetch(`${API_URL}/bookings/${id}/send-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method })
    }).then(res => res.json())
  },

  pricing: {
    getAll: () => fetch(`${API_URL}/pricing`).then(res => res.json()),
    getByType: (type) => fetch(`${API_URL}/pricing/${type}`).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/pricing`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id, data) => fetch(`${API_URL}/pricing/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_URL}/pricing/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json())
  },

  offers: {
    getAll: () => fetch(`${API_URL}/offers`).then(res => res.json()),
    getActive: () => fetch(`${API_URL}/offers/active`).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/offers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id, data) => fetch(`${API_URL}/offers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_URL}/offers/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json())
  },

  banners: {
    getAll: () => fetch(`${API_URL}/banners`).then(res => res.json()),
    getActive: () => fetch(`${API_URL}/banners/active`).then(res => res.json()),
    create: (data) => {
      console.log('Creating banner with data:', data)
      return fetch(`${API_URL}/banners`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      }).then(res => {
        console.log('Response status:', res.status)
        return res.json()
      })
    },
    update: (id, data) => fetch(`${API_URL}/banners/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_URL}/banners/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json())
  },

  settings: {
    getAll: () => fetch(`${API_URL}/settings`).then(res => res.json()),
    getByKey: (key) => fetch(`${API_URL}/settings/${key}`).then(res => res.json()),
    update: (data) => fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    getSpecialDates: () => fetch(`${API_URL}/settings/special-dates`).then(res => res.json()),
    createSpecialDate: (data) => fetch(`${API_URL}/settings/special-dates`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteSpecialDate: (id) => fetch(`${API_URL}/settings/special-dates/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json())
  },

  validation: {
    validate: (data) => fetch(`${API_URL}/validation/validate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    getToday: () => fetch(`${API_URL}/validation/today`, {
      headers: getHeaders()
    }).then(res => res.json())
  },

  cloudinary: {
    upload: async (file) => {
      const formData = new FormData()
      formData.append('image', file)
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/cloudinary/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      return res.json()
    },
    delete: (publicId) => fetch(`${API_URL}/cloudinary/delete/${publicId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json())
  }
}
