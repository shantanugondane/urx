'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Image } from 'lucide-react'
import VariantRow from './VariantRow'

export default function VariantGroupRow({ 
  groupValue, 
  variants, 
  options, 
  groupBy, 
  isExpanded, 
  onToggle,
  variantPrices,
  variantAvailability,
  onPriceChange,
  onAvailabilityChange,
  getPriceRange,
  isSelected,
  isLast
}) {
  const groupOptionIndex = options.findIndex(opt => opt.name === groupBy)
  const otherOptions = options.filter((_, index) => index !== groupOptionIndex)

  // Get the main variant for this group
  const mainVariant = variants[0]
  const mainVariantId = mainVariant?.id

  // Get price range for display
  const priceRange = getPriceRange(variants)

  // Handle main variant price change (this will sync to all sub-variants)
  const handleMainPriceChange = (newPrice) => {
    // Validate the new price
    const parsedPrice = parseFloat(newPrice)
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return // Don't update if invalid price
    }
    
    // Update the main variant price - this will automatically sync to all sub-variants
    // because we pass isMainVariant=true and the parent component handles the syncing
    onPriceChange(mainVariantId, newPrice, true)
  }

  // Check if all child variants have the same price
  const allChildrenSamePrice = () => {
    const childPrices = variants
      .filter(v => v.id !== mainVariantId)
      .map(v => variantPrices[v.id])
      .filter(p => p && p !== '')
    
    if (childPrices.length === 0) return true
    if (childPrices.length === 1) return true
    
    const firstPrice = childPrices[0]
    return childPrices.every(price => price === firstPrice)
  }

  // Get the current price range or single price for display
  const getCurrentPriceDisplay = () => {
    const prices = variants
      .map(v => variantPrices[v.id])
      .filter(p => p && p !== '')
      .map(p => parseFloat(p))
      .filter(p => !isNaN(p))
    
    if (prices.length === 0) return ''
    if (prices.length === 1) return prices[0].toFixed(2)
    
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? min.toFixed(2) : `${min.toFixed(2)} - ${max.toFixed(2)}`
  }

  // Determine if parent should show as editable input or read-only range
  const shouldShowEditableParent = () => {
    // Show as editable when:
    // 1. All children have the same price, OR
    // 2. No prices are set yet (initial state)
    const childrenSamePrice = allChildrenSamePrice()
    const hasMainPrice = variantPrices[mainVariantId] && variantPrices[mainVariantId] !== ''
    const noPricesSet = variants.every(v => !variantPrices[v.id] || variantPrices[v.id] === '')
    
    return (childrenSamePrice && hasMainPrice) || noPricesSet
  }

  // Handle clicking on the price range to make it editable
  const handlePriceRangeClick = () => {
    // Get the current minimum price from children and set it as the parent price
    const childPrices = variants
      .filter(v => v.id !== mainVariantId)
      .map(v => variantPrices[v.id])
      .filter(p => p && p !== '')
      .map(p => parseFloat(p))
      .filter(p => !isNaN(p))
    
    if (childPrices.length > 0) {
      const minPrice = Math.min(...childPrices)
      handleMainPriceChange(minPrice.toString())
    }
  }

  // Handle main variant availability change
  const handleMainAvailabilityChange = (newAvailability) => {
    onAvailabilityChange(mainVariantId, newAvailability)
  }

  const getVariantTitle = (variant) => {
    if (groupBy.toLowerCase() === 'color') {
      const sizeValue = variant.values[options.findIndex(opt => opt.name.toLowerCase() === 'size')]
      return `${variant.values[groupOptionIndex]} / ${sizeValue || 'Medium'}`
    } else if (groupBy.toLowerCase() === 'size') {
      const colorValue = variant.values[options.findIndex(opt => opt.name.toLowerCase() === 'color')]
      return `${colorValue || 'Black'} / ${variant.values[groupOptionIndex]}`
    }
    return variant.title
  }

  // Ensure reactive updates when child prices change
  useEffect(() => {
    // This effect ensures the parent display updates when child prices change
    // The dependency on variantPrices ensures re-renders when prices update
  }, [variantPrices, variants])

  return (
    <>
      <div className={`px-4 py-4 border-t border-gray-200 ${isLast ? 'rounded-b-2xl' : ''} hover:bg-gray-200 hover:border-gray-300 transition-all duration-200`}>
        <div className="grid grid-cols-[40px_60px_1fr_120px_120px] items-center gap-4">
          {/* Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              className="h-4 w-4 rounded border-gray-300 text-gray-700"
            />
          </div>
          
          {/* Thumbnail */}
          <div className="h-12 w-12 rounded-lg border border-gray-200 bg-white grid place-items-center text-gray-400">
            <Image className="w-5 h-5" />
          </div>
          
          {/* Variant Name Area */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-900">{groupValue}</span>
            </div>
            <button
              onClick={onToggle}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors mt-1"
            >
              <span>{variants.length} variant{variants.length !== 1 ? 's' : ''}</span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {/* Price Input */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-10 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-600 text-sm font-medium">
                ₹
              </div>
              {shouldShowEditableParent() ? (
                <input
                  type="text"
                  value={variantPrices[mainVariantId] || ''}
                  onChange={(e) => handleMainPriceChange(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 px-3 text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-colors"
                  placeholder="0.00"
                />
              ) : (
                <div 
                  className="h-10 w-full rounded-lg border border-gray-300 px-3 text-gray-800 bg-white flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handlePriceRangeClick}
                >
                  {getCurrentPriceDisplay() || '0.00'}
                </div>
              )}
            </div>
          </div>
          
          {/* Available Input */}
          <div>
            <input
              type="number"
              value={variantAvailability[mainVariantId] || 0}
              onChange={(e) => handleMainAvailabilityChange(parseInt(e.target.value) || 0)}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-gray-800 placeholder:text-gray-400 bg-white focus:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-colors"
              min="0"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Child Variants */}
      {isExpanded && (
        <div className="bg-white">
          {variants.map(variant => (
            <VariantRow
              key={variant.id}
              variant={variant}
              options={options}
              isChild={true}
              variantPrices={variantPrices}
              variantAvailability={variantAvailability}
              onPriceChange={onPriceChange}
              onAvailabilityChange={onAvailabilityChange}
              isSelected={isSelected}
              getVariantTitle={getVariantTitle}
            />
          ))}
        </div>
      )}
    </>
  )
}
