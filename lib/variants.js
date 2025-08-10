/**
 * Generate cartesian product of option values
 * @param {Array} options - Array of option objects with id, name, and values
 * @returns {Array} Array of variant objects
 */
export function cartesianProduct(options) {
  if (options.length === 0) return []
  
  const generateCombinations = (arrays, index = 0, current = []) => {
    if (index === arrays.length) {
      return [current]
    }
    
    const result = []
    for (let i = 0; i < arrays[index].length; i++) {
      result.push(...generateCombinations(arrays, index + 1, [...current, arrays[index][i]]))
    }
    return result
  }
  
  const optionValues = options.map(option => option.values)
  const combinations = generateCombinations(optionValues)
  
  return combinations.map((combination, index) => ({
    id: `variant-${index}`,
    title: combination.join(' / '),
    values: combination,
    price: '',
    available: 0
  }))
}

/**
 * Get unique option names
 * @param {Array} options - Array of option objects
 * @returns {Array} Array of unique option names
 */
export function getUniqueOptionNames(options) {
  return options.map(option => option.name)
}

/**
 * Validate option name uniqueness
 * @param {string} name - Option name to validate
 * @param {Array} options - Existing options
 * @param {string} excludeId - ID to exclude from validation
 * @returns {boolean} Whether the name is unique
 */
export function isOptionNameUnique(name, options, excludeId = null) {
  return !options.some(option => 
    option.id !== excludeId && option.name.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Validate option value uniqueness within an option
 * @param {Array} values - Array of values to validate
 * @returns {boolean} Whether all values are unique
 */
export function areOptionValuesUnique(values) {
  const trimmedValues = values.map(v => v.trim()).filter(v => v)
  const uniqueValues = new Set(trimmedValues)
  return uniqueValues.size === trimmedValues.length
}
