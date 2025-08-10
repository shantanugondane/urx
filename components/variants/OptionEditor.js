'use client'

import { useState, useEffect } from 'react'
import { GripVertical, Trash2, X } from 'lucide-react'
import { isOptionNameUnique, areOptionValuesUnique } from '../../lib/variants'

export default function OptionEditor({ option, onSave, onCancel, onDelete, existingOptions }) {
  const [name, setName] = useState(option?.name || '')
  const [values, setValues] = useState(option?.values || [''])
  const [errors, setErrors] = useState({})
  const [draggedIndex, setDraggedIndex] = useState(null)

  useEffect(() => {
    setName(option?.name || '')
    setValues(option?.values || [''])
  }, [option])

  const validateForm = () => {
    const newErrors = {}
    
    if (!name.trim()) {
      newErrors.name = 'Option name is required'
    } else if (!isOptionNameUnique(name.trim(), existingOptions, option?.id)) {
      newErrors.name = 'Option name must be unique'
    }
    
    if (values.length === 0 || values.every(v => !v.trim())) {
      newErrors.values = 'At least one value is required'
    } else if (!areOptionValuesUnique(values)) {
      newErrors.values = 'Values must be unique'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = (e) => {
    if (e) {
      e.preventDefault()
    }
    
    if (validateForm()) {
      onSave({
        id: option?.id,
        name: name.trim(),
        values: values.map(v => v.trim()).filter(v => v)
      })
    }
  }

  const addValue = () => {
    setValues(prev => [...prev, ''])
  }

  const updateValue = (index, value) => {
    setValues(prev => prev.map((v, i) => i === index ? value : v))
  }

  const removeValue = (index) => {
    setValues(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter' && index === values.length - 1) {
      addValue()
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return
    }

    const newValues = [...values]
    const draggedValue = newValues[draggedIndex]
    
    // Remove the dragged item
    newValues.splice(draggedIndex, 1)
    
    // Insert at the new position
    newValues.splice(dropIndex, 0, draggedValue)
    
    setValues(newValues)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <form onSubmit={handleSave} className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">
          {option?.id ? 'Edit Option' : 'Add Option'}
        </h3>
        <div className="flex items-center gap-2">
          {option?.id && (
            <button
              onClick={onDelete}
              type="button"
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          )}
          <button
            onClick={onCancel}
            type="button"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Option name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="e.g., Size, Color, Material"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Option values
          </label>
          <div className="space-y-2">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                  draggedIndex === index ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateValue(index, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Value ${index + 1}`}
                />
                {values.length > 1 && (
                  <button
                    onClick={() => removeValue(index)}
                    type="button"
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addValue}
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add another value
            </button>
          </div>
          {errors.values && (
            <p className="text-red-600 text-xs mt-1">{errors.values}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Done
          </button>
          <button
            onClick={onCancel}
            type="button"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
