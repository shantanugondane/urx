'use client'

import { Edit3, GripVertical } from 'lucide-react'

export default function OptionPills({ 
  option, 
  onEdit, 
  onDelete, 
  onToggle,
  isOpen,
  isFirst, 
  index,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop
}) {
  return (
    <div className={[
      "grid grid-cols-[20px_1fr] items-start",
      isFirst ? "bg-gray-50" : "bg-white border-t border-gray-200"
    ].join(" ")}>
      <div className="p-4 md:p-5">
        <GripVertical className="h-4 w-4 text-gray-400 mt-1" />
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left p-4 md:p-5 hover:bg-gray-50/60"
      >
        <div className="text-base font-semibold text-gray-900 mb-2">{option.name}</div>
        <div className="flex flex-wrap gap-2">
          {option.values.map((value, valueIndex) => (
            <span
              key={valueIndex}
              className="inline-flex items-center rounded-md bg-gray-200/70 px-3 py-1 text-sm text-gray-800"
            >
              {value}
            </span>
          ))}
        </div>
      </button>
    </div>
  )
}
