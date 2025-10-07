'use client'

import { useEffect, useState } from 'react'
import { getUserRoles, setUserRoles, clearUserRoles } from '@/utils/helper/cookieUtils'

export default function CookieDebug() {
  const [roles, setRoles] = useState<string | null>(null)

  useEffect(() => {
    // Get roles from cookie on component mount
    const userRoles = getUserRoles()
    setRoles(userRoles)
  }, [])

  const handleSetRoles = () => {
    setUserRoles('3')
    setRoles('3')
  }

  const handleClearRoles = () => {
    clearUserRoles()
    setRoles(null)
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-100">
      <h3 className="text-lg font-bold mb-4">Cookie Debug</h3>
      <div className="space-y-2">
        <p><strong>Current Roles:</strong> {roles || 'None'}</p>
        <div className="flex gap-2">
          <button 
            onClick={handleSetRoles}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set Roles to 3
          </button>
          <button 
            onClick={handleClearRoles}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Roles
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Check browser DevTools → Application → Cookies to see the actual cookie
        </p>
      </div>
    </div>
  )
}
