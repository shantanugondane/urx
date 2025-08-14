'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { PlusCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cartesianProduct } from '../../lib/variants'
import OptionEditor from './OptionEditor'
import OptionPills from './OptionPills'
import VariantTable from './VariantTable'

export default function VariantsCard() {
  const [options, setOptions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [groupBy, setGroupBy] = useState('none')
  const [query, setQuery] = useState('')
  const [expandedGroups, setExpandedGroups] = useState({})
  const [variantPrices, setVariantPrices] = useState({})
  const [variantAvailability, setVariantAvailability] = useState({})
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const editorRefs = useRef({})

  // Load options from localStorage on mount
  useEffect(() => {
    try {
      const savedOptions = localStorage.getItem('variants_options_v1')
      if (savedOptions) {
        const parsedOptions = JSON.parse(savedOptions)
        setOptions(parsedOptions)
      }
      
      // Load saved prices and availability
      const savedPrices = localStorage.getItem('variants_prices_v1')
      if (savedPrices) {
        setVariantPrices(JSON.parse(savedPrices))
      }
      
      const savedAvailability = localStorage.getItem('variants_availability_v1')
      if (savedAvailability) {
        setVariantAvailability(JSON.parse(savedAvailability))
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error)
    }
  }, [])

  // Save options to localStorage whenever options change
  useEffect(() => {
    localStorage.setItem('variants_options_v1', JSON.stringify(options))
  }, [options])

  // Save prices and availability to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('variants_prices_v1', JSON.stringify(variantPrices))
  }, [variantPrices])

  useEffect(() => {
    localStorage.setItem('variants_availability_v1', JSON.stringify(variantAvailability))
  }, [variantAvailability])

  const variants = useMemo(() => cartesianProduct(options), [options])

  // Initialize prices and availability for new variants
  useEffect(() => {
    const newPrices = { ...variantPrices }
    const newAvailability = { ...variantAvailability }
    
    variants.forEach(variant => {
      if (!(variant.id in newPrices)) {
        newPrices[variant.id] = ''
      }
      if (!(variant.id in newAvailability)) {
        newAvailability[variant.id] = 0
      }
    })
    
    setVariantPrices(newPrices)
    setVariantAvailability(newAvailability)
  }, [variants])

  // Handle price change for a variant
  const handlePriceChange = (variantId, newPrice, isMainVariant = false) => {
    setVariantPrices(prev => {
      const updated = { ...prev, [variantId]: newPrice }
      
      // If this is a main variant, update all its sub-variants to the same price
      if (isMainVariant && groupBy !== 'none') {
        const mainVariant = variants.find(v => v.id === variantId)
        if (mainVariant) {
          const groupOptionIndex = options.findIndex(opt => opt.name === groupBy)
          const mainValue = mainVariant.values[groupOptionIndex]
          
          // Update all variants in the same group to the new price
          variants.forEach(variant => {
            if (variant.values[groupOptionIndex] === mainValue && variant.id !== variantId) {
              updated[variant.id] = newPrice
            }
          })
        }
      }
      
      return updated
    })
  }

  // Handle availability change for a variant
  const handleAvailabilityChange = (variantId, newAvailability) => {
    setVariantAvailability(prev => ({
      ...prev,
      [variantId]: newAvailability
    }))
  }

  // Get price range for a group of variants
  const getPriceRange = (groupVariants) => {
    const prices = groupVariants
      .map(v => variantPrices[v.id])
      .filter(p => p && p !== '')
      .map(p => parseFloat(p))
      .filter(p => !isNaN(p))
    
    if (prices.length === 0) return ''
    if (prices.length === 1) return `₹ ${prices[0].toFixed(2)}`
    
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? `₹ ${min.toFixed(2)}` : `₹ ${min.toFixed(2)} - ${max.toFixed(2)}`
  }

  const handleAddOption = () => {
    if (options.length >= 3) return
    
    const newOption = {
      id: `option-${Date.now()}`,
      name: '',
      values: ['']
    }
    setOptions(prev => [...prev, newOption])
    setEditingId(newOption.id)
  }

  const handleSaveOption = (updatedOption) => {
    setOptions(prev => {
      const newOptions = prev.map(opt => 
        opt.id === updatedOption.id ? updatedOption : opt
      )
      
      // Update groupBy if we're grouping by the edited option and its name changed
      const oldOption = prev.find(opt => opt.id === updatedOption.id)
      if (oldOption && groupBy === oldOption.name && groupBy !== updatedOption.name) {
        setGroupBy(updatedOption.name)
      }
      
      return newOptions
    })
    
    // Close the editor immediately
    setEditingId(null)
  }

  const handleDeleteOption = (optionId) => {
    setOptions(prev => prev.filter(opt => opt.id !== optionId))
    setEditingId(null)
    
    // Reset groupBy if we're grouping by the deleted option
    const deletedOption = options.find(opt => opt.id === optionId)
    if (deletedOption && groupBy === deletedOption.name) {
      setGroupBy(options.length === 2 ? options.find(opt => opt.id !== optionId)?.name || 'none' : 'none')
    }
  }

  const handleEditOption = (option) => {
    setEditingId(option.id)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleToggleEdit = (optionId) => {
    const newEditingId = editingId === optionId ? null : optionId
    setEditingId(newEditingId)
    
    // Scroll the newly opened editor into view
    if (newEditingId && editorRefs.current[newEditingId]) {
      setTimeout(() => {
        editorRefs.current[newEditingId]?.scrollIntoView({ 
          behavior: "smooth", 
          block: "nearest" 
        })
      }, 100) // Small delay to ensure animation has started
    }
  }

  const toggleGroupExpansion = (groupValue) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupValue]: !prev[groupValue]
    }))
  }

  const expandAllGroups = () => {
    const newExpanded = {}
    if (groupBy !== 'none') {
      const groupValues = [...new Set(variants.map(v => v.values[options.findIndex(opt => opt.name === groupBy)]))]
      groupValues.forEach(value => {
        newExpanded[value] = true
      })
    }
    setExpandedGroups(newExpanded)
  }

  const collapseAllGroups = () => {
    setExpandedGroups({})
  }

  // Drag and drop handlers
  const handleDragStart = useCallback((index) => {
    setDraggedIndex(index)
  }, [])

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    setOptions(prevOptions => {
      const newOptions = [...prevOptions]
      const draggedOption = newOptions[draggedIndex]
      newOptions.splice(draggedIndex, 1)
      newOptions.splice(dropIndex, 0, draggedOption)
      return newOptions
    })

    setDraggedIndex(null)
    setDragOverIndex(null)
  }, [draggedIndex])

  if (options.length === 0 && !editingId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-[20px] font-semibold text-gray-800 mb-3">Variants</h2>
        <button
          onClick={handleAddOption}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 shadow-sm hover:bg-gray-50 transition-colors font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          Add options like size or color
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-[20px] font-semibold text-gray-800 mb-6">Variants</h2>
      
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mb-8">
        {options.map((option, index) => (
          <div key={option.id}>
            {/* Option header row */}
            <OptionPills
              option={option}
              onEdit={() => handleEditOption(option)}
              onDelete={() => handleDeleteOption(option.id)}
              onToggle={() => handleToggleEdit(option.id)}
              isOpen={editingId === option.id}
              isFirst={index === 0}
              index={index}
              isDragging={draggedIndex === index}
              isDragOver={dragOverIndex === index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
            
            {/* Animated editor slot directly under header */}
            <AnimatePresence initial={false}>
              {editingId === option.id && (
                <motion.div
                  key={`editor-${option.id}`}
                  ref={el => editorRefs.current[option.id] = el}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="border-t border-gray-200 overflow-hidden"
                >
                  <div className="p-4 md:p-5">
                    <OptionEditor
                      option={option}
                      variant="bare"
                      onSave={handleSaveOption}
                      onCancel={handleCancel}
                      onDelete={() => handleDeleteOption(option.id)}
                      existingOptions={options}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        
        {/* Add another option row inside the same container */}
        <div className="border-t border-gray-200 bg-white p-4">
          <button 
            onClick={handleAddOption}
            className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-900"
          >
            <PlusCircle className="h-5 w-5 text-gray-600" />
            Add another option
          </button>
        </div>
      </div>
      
      {variants.length > 0 && (
        <VariantTable
          variants={variants}
          options={options}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          query={query}
          onQueryChange={setQuery}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroupExpansion}
          onExpandAll={expandAllGroups}
          onCollapseAll={collapseAllGroups}
          variantPrices={variantPrices}
          variantAvailability={variantAvailability}
          onPriceChange={handlePriceChange}
          onAvailabilityChange={handleAvailabilityChange}
          getPriceRange={getPriceRange}
        />
      )}
    </div>
  )
}
