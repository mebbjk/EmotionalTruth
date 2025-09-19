// Created a reusable Select component.
import React from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = ({ children, className, ...props }) => {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDownIcon className="h-4 w-4" />
      </div>
    </div>
  );
};
