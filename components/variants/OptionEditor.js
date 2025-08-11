'use client'

import { useState, useEffect, useRef } from 'react'
import { GripVertical, Trash2, X } from 'lucide-react'
import { isOptionNameUnique, areOptionValuesUnique } from '../../lib/variants'

export default function OptionEditor({ option, onSave, onCancel, onDelete, existingOptions, variant = "bare" }) {
  const [name, setName] = useState(option?.name || '')
  const [values, setValues] = useState(option?.values || [''])
  const [errors, setErrors] = useState({})
  const [draggedIndex, setDraggedIndex] = useState(null)
  const nameInputRef = useRef(null)

  useEffect(() => {
    setName(option?.name || '')
    setValues(option?.values || [''])
  }, [option])

  // Focus the name input when the editor opens
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [])

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

  const addSpecificValue = (value) => {
    if (value.trim()) {
      setValues(prev => [...prev, value.trim()])
    }
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

  const Container = ({ children }) => variant === "bare"
    ? <>{children}</>
    : <div className="rounded-xl border border-gray-200 bg-white p-5">{children}</div>

  return (
    <Container>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Option name</label>
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`h-11 w-full rounded-lg border border-gray-300 px-3 text-[16px] text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none transition-colors ${
              errors.name ? 'border-red-300' : ''
            }`}
            placeholder="e.g., Size, Color, Material"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <div className="mb-1 text-sm font-medium text-gray-700">Option values</div>
          <div className="space-y-2">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-[18px_1fr] items-center gap-2 rounded-md transition-colors ${
                  draggedIndex === index ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateValue(index, e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 pr-10 text-[16px] text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none transition-colors"
                    placeholder={`Value ${index + 1}`}
                  />
                  {values.length > 1 && (
                    <button
                      onClick={() => removeValue(index)}
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-md p-1 hover:bg-gray-100 text-gray-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[18px_1fr] items-center gap-2 opacity-75">
              <div className="text-gray-300">
                <GripVertical className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Add option"
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-[16px] text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none transition-colors focus:opacity-100"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    addSpecificValue(e.target.value)
                    e.target.value = ''
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    addSpecificValue(e.target.value)
                    e.target.value = ''
                  }
                }}
              />
              <span></span>
            </div>
          </div>
          {errors.values && (
            <p className="text-red-600 text-xs mt-1">{errors.values}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-5">
          <button
            onClick={onDelete}
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[15px] text-red-600 hover:bg-gray-50 transition-colors"
          >
            Delete
          </button>
          <button
            type="submit"
            className="rounded-lg bg-gray-800 px-4 py-2 text-[15px] font-medium text-white shadow-sm hover:bg-gray-900 transition-colors"
          >
            Done
          </button>
        </div>
      </form>
    </Container>
  )
}
