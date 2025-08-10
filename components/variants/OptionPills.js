'use client'

import { Edit3 } from 'lucide-react'

export default function OptionPills({ option, onEdit, onDelete }) {
  return (
    <div className="mb-4">
      <div 
        className="inline-flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={onEdit}
      >
        <span className="text-sm font-medium text-gray-900">{option.name}</span>
        <div className="flex items-center gap-1">
          {option.values.map((value, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
            >
              {value}
            </span>
          ))}
        </div>
        <Edit3 className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  )
}
