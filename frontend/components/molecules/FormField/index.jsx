'use client'
import React from 'react'
import Label from '../../../components/atoms/Label'
import Input from '../../../components/atoms/Input'

const FormField = ({ 
  label, 
  name, 
  error, 
  required = false,
  icon,
  className = '',
  ...inputProps 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <div className="mb-2">
          <Label htmlFor={name} required={required}>
            {label}
          </Label>
        </div>
      )}
      <Input
        id={name}
        name={name}
        error={error}
        icon={icon}
        className='border border-gray-300 rounded-2xl p-2 w-full'
        {...inputProps}
      />
    </div>
  )
}

export default FormField