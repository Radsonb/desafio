'use client'
import React from 'react'

const Card = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const classes = `
    bg-white dark:bg-gray-800 
    rounded-lg 
    shadow-lg 
    border border-gray-200 dark:border-gray-700
    ${className}
  `.trim()

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card