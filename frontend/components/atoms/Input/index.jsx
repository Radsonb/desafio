'use client'
import React from 'react'

const Input = ({ 
  type = 'text',
  error = '',
  helperText = '',
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'input'
  const errorClasses = error ? 'input-error' : ''
  const iconClasses = Icon ? 'pl-10' : ''
  
  const classes = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`.trim()

  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={classes}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export default Input