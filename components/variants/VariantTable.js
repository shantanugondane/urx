'use client'

import { useState, useEffect } from 'react'
import { Search, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react'
import GroupBySelect from './GroupBySelect'
import VariantGroupRow from './VariantGroupRow'
import VariantRow from './VariantRow'

export default function VariantTable({ 
  variants, 
  options, 
  groupBy, 
  onGroupByChange, 
  query, 
  onQueryChange, 
  expandedGroups, 
  onToggleGroup, 
  onExpandAll, 
  onCollapseAll,
  variantPrices,
  variantAvailability,
  onPriceChange,
  onAvailabilityChange,
  getPriceRange
}) {
  const [showSearch, setShowSearch] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [allExpanded, setAllExpanded] = useState(false)

  const filteredVariants = variants.filter(variant => 
    query === '' || variant.title.toLowerCase().includes(query.toLowerCase())
  )

  const groupedVariants = groupBy === 'none' ? null : 
    filteredVariants.reduce((groups, variant) => {
      const groupValue = variant.values[options.findIndex(opt => opt.name === groupBy)]
      if (!groups[groupValue]) {
        groups[groupValue] = []
      }
      groups[groupValue].push(variant)
      return groups
    }, {})

  // Sync allExpanded state with expandedGroups
  useEffect(() => {
    if (groupBy === 'none') {
      setAllExpanded(false)
      return
    }
    
    const groupValues = Object.keys(groupedVariants || {})
    const expandedCount = groupValues.filter(value => expandedGroups[value]).length
    
    if (expandedCount === 0) {
      setAllExpanded(false)
    } else if (expandedCount === groupValues.length) {
      setAllExpanded(true)
    }
    // If some are expanded but not all, keep the current state
  }, [expandedGroups, groupBy, groupedVariants])

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
  }

  const handleExpandAll = () => {
    if (groupBy !== 'none') {
      if (allExpanded) {
        onCollapseAll()
        setAllExpanded(false)
      } else {
        onExpandAll()
        setAllExpanded(true)
      }
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="mt-8">
        {/* Title is already on page above */}
        
        {/* Table Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">Group by</span>
                <GroupBySelect
                  value={groupBy}
                  onChange={onGroupByChange}
                  options={options}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Header Row */}
          <div className="bg-gray-50/50 px-6 py-4">
            <div className="grid grid-cols-[40px_60px_1fr_120px_120px] items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
              </div>
              <div></div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">Variant</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700">Price</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700">Available</span>
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {filteredVariants.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <div className="text-sm">No variants found matching your search.</div>
              </div>
            ) : groupBy === 'none' ? (
              filteredVariants.map(variant => (
                <VariantRow
                  key={variant.id}
                  variant={variant}
                  options={options}
                  variantPrices={variantPrices}
                  variantAvailability={variantAvailability}
                  onPriceChange={onPriceChange}
                  onAvailabilityChange={onAvailabilityChange}
                  isSelected={selectAll}
                />
              ))
            ) : (
              Object.entries(groupedVariants).map(([groupValue, groupVariants], index, array) => (
                <VariantGroupRow
                  key={groupValue}
                  groupValue={groupValue}
                  variants={groupVariants}
                  options={options}
                  groupBy={groupBy}
                  isExpanded={expandedGroups[groupValue]}
                  onToggle={() => onToggleGroup(groupValue)}
                  variantPrices={variantPrices}
                  variantAvailability={variantAvailability}
                  onPriceChange={onPriceChange}
                  onAvailabilityChange={onAvailabilityChange}
                  getPriceRange={getPriceRange}
                  isSelected={selectAll}
                  isLast={index === array.length - 1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
