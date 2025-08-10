'use client'

import { useState } from 'react'
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
  onCollapseAll 
}) {
  const [showSearch, setShowSearch] = useState(false)

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

  const totalInventory = variants.reduce((sum, variant) => sum + (variant.available || 0), 0)

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {options.length > 1 && (
            <>
              <span className="text-sm text-gray-600">Group by</span>
              <GroupBySelect
                value={groupBy}
                onChange={onGroupByChange}
                options={options}
              />
            </>
          )}
          
          {groupBy !== 'none' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Variant</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={onExpandAll}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Expand all
                </button>
                <span className="text-gray-400">/</span>
                <button
                  onClick={onCollapseAll}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Collapse all
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showSearch ? (
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search variants..."
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
          
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-6">Variant</div>
            <div className="col-span-3">Price</div>
            <div className="col-span-3">Available</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {groupBy === 'none' ? (
            filteredVariants.map(variant => (
              <VariantRow
                key={variant.id}
                variant={variant}
                options={options}
              />
            ))
          ) : (
            Object.entries(groupedVariants).map(([groupValue, groupVariants]) => (
              <VariantGroupRow
                key={groupValue}
                groupValue={groupValue}
                variants={groupVariants}
                options={options}
                groupBy={groupBy}
                isExpanded={expandedGroups[groupValue]}
                onToggle={() => onToggleGroup(groupValue)}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total inventory at Sai Road Gokuldham Colony Goregaon: {totalInventory} available
      </div>
    </div>
  )
}
