import { useState, useEffect } from 'react'
import { api } from '../services/api'

const Settings = () => {
  const [settings, setSettings] = useState({
    kidsAgeLimit: 12,
    parkName: 'Chapak Water Park',
    allowOfferStacking: false,
    stripe: { enabled: false, secretKey: '', publishableKey: '' },
    instamojo: { enabled: false, apiKey: '', authToken: '' }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const data = await api.settings.getAll()
    setSettings({
      kidsAgeLimit: data.kidsAgeLimit || 12,
      parkName: data.parkName || 'Chapak Water Park',
      allowOfferStacking: data.allowOfferStacking || false,
      stripe: data.stripe || { enabled: false, secretKey: '', publishableKey: '' },
      instamojo: data.instamojo || { enabled: false, apiKey: '', authToken: '' }
    })
    setLoading(false)
  }

  const handleSave = async (key, value) => {
    setSaving(true)
    try {
      await api.settings.update({ key, value })
      setSettings({ ...settings, [key]: value })
      alert('Saved!')
    } catch (err) {
      alert('Failed to save')
    }
    setSaving(false)
  }

  const handleNestedSave = async (parent, key, value) => {
    setSaving(true)
    try {
      let updated
      if (key === 'saveAll') {
        updated = value
      } else {
        updated = { ...settings[parent], [key]: value }
      }
      await api.settings.update({ key: parent, value: updated })
      setSettings({ ...settings, [parent]: updated })
      alert('Saved!')
    } catch (err) {
      alert('Failed to save')
    }
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Settings</h1>

      <div className="space-y-4 sm:space-y-6">
        <div className="card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Park Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.parkName}
                  onChange={(e) => setSettings({ ...settings, parkName: e.target.value })}
                  className="input flex-1"
                />
                <button onClick={() => handleSave('parkName', settings.parkName)} disabled={saving} className="btn-primary">
                  Save
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kids Age Limit (years)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.kidsAgeLimit}
                  onChange={(e) => setSettings({ ...settings, kidsAgeLimit: parseInt(e.target.value) })}
                  className="input w-32"
                />
                <button onClick={() => handleSave('kidsAgeLimit', settings.kidsAgeLimit)} disabled={saving} className="btn-primary">
                  Save
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Children below this age qualify for kids ticket</p>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.allowOfferStacking}
                  onChange={(e) => setSettings({ ...settings, allowOfferStacking: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Allow multiple offers to stack</span>
              </label>
              <button onClick={() => handleSave('allowOfferStacking', settings.allowOfferStacking)} disabled={saving} className="btn-secondary mt-2">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Stripe Payment Gateway</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.stripe.enabled}
                onChange={(e) => setSettings({ ...settings, stripe: { ...settings.stripe, enabled: e.target.checked } })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Enable Stripe</span>
            </label>
            {settings.stripe.enabled && (
              <div className="space-y-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
                  <input
                    type="text"
                    value={settings.stripe.publishableKey}
                    onChange={(e) => setSettings({ ...settings, stripe: { ...settings.stripe, publishableKey: e.target.value } })}
                    className="input"
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={settings.stripe.secretKey}
                    onChange={(e) => setSettings({ ...settings, stripe: { ...settings.stripe, secretKey: e.target.value } })}
                    className="input"
                    placeholder="sk_test_..."
                  />
                </div>
                <button onClick={() => handleNestedSave('stripe', 'saveAll', settings.stripe)} disabled={saving} className="btn-primary">
                  Save Stripe Settings
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Instamojo Payment Gateway</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.instamojo.enabled}
                onChange={(e) => setSettings({ ...settings, instamojo: { ...settings.instamojo, enabled: e.target.checked } })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Enable Instamojo</span>
            </label>
            {settings.instamojo.enabled && (
              <div className="space-y-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="text"
                    value={settings.instamojo.apiKey}
                    onChange={(e) => setSettings({ ...settings, instamojo: { ...settings.instamojo, apiKey: e.target.value } })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                  <input
                    type="password"
                    value={settings.instamojo.authToken}
                    onChange={(e) => setSettings({ ...settings, instamojo: { ...settings.instamojo, authToken: e.target.value } })}
                    className="input"
                  />
                </div>
                <button onClick={() => handleNestedSave('instamojo', 'saveAll', settings.instamojo)} disabled={saving} className="btn-primary">
                  Save Instamojo Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
