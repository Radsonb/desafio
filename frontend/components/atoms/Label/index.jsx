'use client'
import React from 'react'

const Label = ({ 
  children, 
  required = false, 
  htmlFor,
  className = '',
  ...props 
}) => {
  const classes = `block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`.trim()

  return (
    <label htmlFor={htmlFor} className={classes} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

export default Label