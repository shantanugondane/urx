'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function GroupBySelect({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const optionNames = ['none', ...options.map(opt => opt.name)]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (selectedValue) => {
    onChange(selectedValue)
    setIsOpen(false)
  }

  const getDisplayName = (name) => {
    return name === 'none' ? 'None' : name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-[120px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
      >
        <span>{getDisplayName(value)}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
          {optionNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleSelect(name)}
              className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors duration-150 flex items-center justify-between ${
                value === name
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{getDisplayName(name)}</span>
              {value === name && (
                <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
