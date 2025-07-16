'use client'
import React from 'react'

const Checkbox = ({ 
  id,
  checked,
  onChange,
  label,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  )
}

export default Checkbox