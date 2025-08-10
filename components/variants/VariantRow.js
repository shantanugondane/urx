'use client'

export default function VariantRow({ 
  variant, 
  options, 
  isChild = false,
  variantPrices,
  variantAvailability,
  onPriceChange,
  onAvailabilityChange
}) {
  const indentClass = isChild ? 'pl-8' : ''

  const handlePriceChange = (e) => {
    onPriceChange(variant.id, e.target.value)
  }

  const handleAvailabilityChange = (e) => {
    onAvailabilityChange(variant.id, parseInt(e.target.value) || 0)
  }

  return (
    <div className={`px-4 py-3 hover:bg-gray-50 transition-colors ${indentClass}`}>
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6">
          <span className="text-sm text-gray-900">{variant.title}</span>
        </div>
        <div className="col-span-3">
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">₹</span>
            <input
              type="text"
              value={variantPrices[variant.id] || ''}
              onChange={handlePriceChange}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="col-span-3">
          <input
            type="number"
            value={variantAvailability[variant.id] || 0}
            onChange={handleAvailabilityChange}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>
      </div>
    </div>
  )
}
