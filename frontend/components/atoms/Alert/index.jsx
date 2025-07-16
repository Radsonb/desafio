'use client'
import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  className = '',
  ...props 
}) => {
  const types = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: 'text-green-400'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: 'text-red-400'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-400'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-400'
    }
  }

  const style = types[type]
  
  const getPrefix = () => {
    switch (type) {
      case 'error': return 'Erro! '
      case 'success': return 'Sucesso! '
      case 'warning': return 'Atenção! '
      default: return ''
    }
  }

  const classes = `
    border rounded-md p-4 
    ${style.bg} 
    ${style.text} 
    ${className}
  `.trim()

  return (
    <div className={classes} {...props}>
      <div className="flex">
        <div className="flex-1">
          <span className="font-medium">{getPrefix()}</span>
          {message}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`
                  inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${style.text} hover:bg-opacity-20
                `}
              >
                <span className="sr-only">Fechar</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert