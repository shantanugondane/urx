'use client'

import { useState, useMemo, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'
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
      
      // If this is a main variant, update all its sub-variants
      if (isMainVariant && groupBy !== 'none') {
        const mainVariant = variants.find(v => v.id === variantId)
        if (mainVariant) {
          const groupOptionIndex = options.findIndex(opt => opt.name === groupBy)
          const mainValue = mainVariant.values[groupOptionIndex]
          
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

  if (options.length === 0 && !editingId) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Variants</h2>
        <button
          onClick={handleAddOption}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add options like size or color
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Variants</h2>
      
      {editingId ? (
        <OptionEditor
          option={options.find(opt => opt.id === editingId)}
          onSave={handleSaveOption}
          onCancel={handleCancel}
          onDelete={() => handleDeleteOption(editingId)}
          existingOptions={options}
        />
      ) : (
        <>
          {options.map(option => (
            <OptionPills
              key={option.id}
              option={option}
              onEdit={() => handleEditOption(option)}
              onDelete={() => handleDeleteOption(option.id)}
            />
          ))}
          
          {options.length < 3 && (
            <button
              onClick={handleAddOption}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors mt-2"
            >
              + Add another option
            </button>
          )}
          
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
        </>
      )}
    </div>
  )
}
