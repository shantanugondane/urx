'use client'

export default function VariantRow({ 
  variant, 
  options, 
  isChild = false,
  variantPrices,
  variantAvailability,
  onPriceChange,
  onAvailabilityChange,
  isSelected,
  getVariantTitle
}) {
  const handlePriceChange = (e) => {
    const newPrice = e.target.value
    onPriceChange(variant.id, newPrice, false) // false = not a main variant
  }

  const handleAvailabilityChange = (e) => {
    onAvailabilityChange(variant.id, parseInt(e.target.value) || 0)
  }

  const variantTitle = getVariantTitle ? getVariantTitle(variant) : variant.title

  return (
    <div className={`px-4 py-3 border-t border-gray-200 ${isChild ? 'bg-gray-50' : 'bg-white'}`}>
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
        <div className="relative">
          {isChild ? (
            <div className="h-12 w-12 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          ) : (
            <div className="h-12 w-12 rounded-lg border border-gray-200 bg-white grid place-items-center text-gray-400">
              <div className="w-5 h-5 text-center text-gray-400">+</div>
            </div>
          )}
        </div>
        
        {/* Variant Name Area */}
        <div className={`flex flex-col ${isChild ? 'relative' : ''}`}>
          {isChild && (
            <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
          )}
          <span className={`font-medium ${isChild ? 'text-gray-800 text-sm' : 'text-gray-900 text-base'}`}>
            {variantTitle}
          </span>
          {isChild && (
            <span className="text-xs text-gray-500 mt-1">Variant option</span>
          )}
        </div>
        
        {/* Price Input */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-8 h-10 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-600 text-sm font-medium">
            ₹
          </div>
          <input
            type="text"
            value={variantPrices[variant.id] || ''}
            onChange={handlePriceChange}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-colors"
            placeholder="0.00"
          />
        </div>
        
        {/* Available Input */}
        <div>
          <input
            type="number"
            value={variantAvailability[variant.id] || 0}
            onChange={handleAvailabilityChange}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-gray-800 placeholder:text-gray-400 bg-white focus:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-colors"
            min="0"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  )
}
