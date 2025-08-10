'use client'

import { ChevronDown } from 'lucide-react'

export default function GroupBySelect({ value, onChange, options }) {
  const optionNames = ['none', ...options.map(opt => opt.name)]

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {optionNames.map((name) => (
          <option key={name} value={name}>
            {name === 'none' ? 'None' : name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}
