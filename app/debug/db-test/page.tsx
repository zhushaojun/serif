'use client'

import { useState } from 'react'

export default function DatabaseTestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/db-test', {
        method: 'POST',
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testChatCreation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/create-test-chat', {
        method: 'POST',
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">数据库连接测试</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testDatabase}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mr-4"
        >
          {loading ? '测试中...' : '测试数据库连接'}
        </button>
        
        <button
          onClick={testChatCreation}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? '测试中...' : '测试聊天创建'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">测试结果:</h2>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  )
} 