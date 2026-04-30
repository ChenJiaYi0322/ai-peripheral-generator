'use client'

import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

interface Product {
  name: string
  tagline: string
  description: string
  features: Array<{
    title: string
    description: string
  }>
}

export default function Page() {
  const [productName, setProductName] = useState('')
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setError('请输入产品名称')
      return
    }

    setLoading(true)
    setError('')
    setProduct(null)

    try {
      const response = await fetch('/api/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName }),
      })

      if (!response.ok) {
        throw new Error('生成失败，请重试')
      }

      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '生成出错，请重试'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center border-b border-gray-100">
        <h1 className="text-5xl font-light tracking-tight text-black mb-4">
          产品灵感生成器
        </h1>
        <p className="text-lg text-gray-600 font-light">
          输入任何计算机外设，AI 将为您创建引人注目的营销内容
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Input Section */}
          <div className="mb-16 space-y-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="例如：无线鼠标、机械键盘、USB 集线器..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400"
                disabled={loading}
              />
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="px-8 bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>生成中</span>
                  </div>
                ) : (
                  '生成'
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Product Output Section */}
          {product && (
            <div className="space-y-12 animate-in fade-in duration-500">
              {/* Product Header */}
              <div className="space-y-4 pb-12 border-b border-gray-100">
                <h2 className="text-4xl font-light text-black">
                  {product.name}
                </h2>
                <p className="text-xl text-gray-600 font-light">
                  {product.tagline}
                </p>
                <p className="text-base text-gray-700 leading-relaxed max-w-xl">
                  {product.description}
                </p>
              </div>

              {/* Features Section */}
              <div className="space-y-8">
                <h3 className="text-2xl font-light text-black">主要功能</h3>
                <div className="space-y-8">
                  {product.features.map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="text-lg font-medium text-black">
                        {feature.title}
                      </h4>
                      <p className="text-base text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-8 border-t border-gray-100">
                <Button
                  onClick={() => {
                    setProductName('')
                    setProduct(null)
                  }}
                  className="px-8 py-3 bg-black text-white hover:bg-gray-800"
                >
                  生成其他产品
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!product && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base">
                输入产品名称开始生成营销内容
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-gray-100">
        <p className="text-sm text-gray-500">
          使用 AI 技术为您的产品创建完美的营销文案
        </p>
      </footer>
    </div>
  )
}
