'use client'

import { useState } from 'react'

export default function VariantRow({ variant, options, isChild = false }) {
  const [price, setPrice] = useState(variant.price || '')
  const [available, setAvailable] = useState(variant.available || 0)

  const indentClass = isChild ? 'pl-8' : ''

  return (
    <div className={`px-4 py-3 hover:bg-gray-50 transition-colors ${indentClass}`}>
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6">
          <span className="text-sm text-gray-900">{variant.title}</span>
        </div>
        <div className="col-span-3">
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">₹</span>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="col-span-3">
          <input
            type="number"
            value={available}
            onChange={(e) => setAvailable(parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>
      </div>
    </div>
  )
}
