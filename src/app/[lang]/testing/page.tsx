'use client'

import { GetData } from '@/@core/hooks/use-query'
// 🧪 TEST ERROR SCENARIOS - See which handler gets triggered

import { useState } from 'react'

function TestErrorScenarios() {
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  // Test different error scenarios
  const test401Frontend = async () => {
    addResult('🧪 Testing Frontend 401...')
    try {
      // This will trigger frontend axios interceptor
      await fetch('/api/users/me', {
        headers: { Authorization: 'Bearer invalid_token' }
      })
    } catch (error) {
      addResult('❌ Frontend 401 test failed to trigger')
    }
  }

  const test500Frontend = async () => {
    addResult('🧪 Testing Frontend 500...')
    try {
      // This should trigger handleError()
      await fetch('/api/test-500-error')
    } catch (error) {
      addResult('✅ Frontend 500 should show toast via handleError()')
    }
  }

  const testServerError = () => {
    addResult('🧪 Testing Server-side error...')
    // This will test server-side error handling
    const { error } = GetData('/api/test-server-error', ['test', 'server-error'])
    if (error) {
      addResult('✅ Server error handled')
    }
  }

  return (
    <div className='space-y-4 p-4'>
      <h2 className='text-2xl font-bold'>🧪 Test Error Scenarios</h2>

      <div className='space-x-2'>
        <button onClick={test401Frontend} className='px-4 py-2 bg-red-500 text-white rounded'>
          Test Frontend 401
        </button>
        <button onClick={test500Frontend} className='px-4 py-2 bg-blue-500 text-white rounded'>
          Test Frontend 500
        </button>
        <button onClick={testServerError} className='px-4 py-2 bg-purple-500 text-white rounded'>
          Test Server Error
        </button>
        <button onClick={() => setTestResults([])} className='px-4 py-2 bg-gray-500 text-white rounded'>
          Clear Results
        </button>
      </div>

      <div className='bg-gray-50 p-4 rounded border'>
        <h3 className='font-bold mb-2'>Test Results:</h3>
        <div className='space-y-1 text-sm font-mono'>
          {testResults.length === 0 ? (
            <p className='text-gray-500'>No tests run yet...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className='p-1 bg-white rounded border'>
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className='bg-blue-50 border border-blue-200 p-4 rounded'>
        <h4 className='font-bold text-blue-800'>🔍 What to expect:</h4>
        <ul className='list-disc list-inside text-sm space-y-1'>
          <li>
            <strong>Frontend 401:</strong> Immediate redirect (no toast)
          </li>
          <li>
            <strong>Frontend 500:</strong> Toast message via handleError()
          </li>
          <li>
            <strong>Server Error:</strong> Depends on error type (401 = redirect, others = toast)
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TestErrorScenarios
