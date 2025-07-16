'use client'
import React from 'react'
import { FireIcon } from '@heroicons/react/24/outline' 

const AuthTemplate = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div >
              <FireIcon className='w-16 h-16 text-red-600' />
            </div>
            
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              VenderGas
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 sm:px-0">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 VenderGas. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}

export default AuthTemplate