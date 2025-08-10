'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import VariantRow from './VariantRow'

export default function VariantGroupRow({ 
  groupValue, 
  variants, 
  options, 
  groupBy, 
  isExpanded, 
  onToggle 
}) {
  const [price, setPrice] = useState('')
  const [available, setAvailable] = useState(0)

  const groupOptionIndex = options.findIndex(opt => opt.name === groupBy)
  const otherOptions = options.filter((_, index) => index !== groupOptionIndex)

  const renderColorSwatch = (value) => {
    if (groupBy.toLowerCase() === 'color') {
      const colorMap = {
        'black': '#000000',
        'white': '#ffffff',
        'red': '#ff0000',
        'blue': '#0000ff',
        'green': '#00ff00',
        'yellow': '#ffff00',
        'purple': '#800080',
        'orange': '#ffa500',
        'pink': '#ffc0cb',
        'brown': '#a52a2a',
        'gray': '#808080',
        'grey': '#808080'
      }
      
      const color = colorMap[value.toLowerCase()] || '#e5e7eb'
      return (
        <div 
          className="w-3 h-3 rounded-full border border-gray-300 mr-2"
          style={{ backgroundColor: color }}
        />
      )
    }
    return null
  }

  return (
    <>
      <div className="bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 flex items-center">
            <button
              onClick={onToggle}
              className="mr-2 text-gray-400 hover:text-gray-600"
              aria-label={isExpanded ? 'Collapse group' : 'Expand group'}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center">
              {renderColorSwatch(groupValue)}
              <span className="font-medium text-gray-900">{groupValue}</span>
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {variants.length} variant{variants.length !== 1 ? 's' : ''}
            </span>
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
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100 text-gray-500 focus:outline-none"
              disabled
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-white">
          {variants.map(variant => (
            <VariantRow
              key={variant.id}
              variant={variant}
              options={options}
              isChild={true}
            />
          ))}
        </div>
      )}
    </>
  )
}
