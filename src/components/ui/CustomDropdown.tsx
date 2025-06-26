'use client'

import { useState } from 'react'

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  label 
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium tracking-wider text-gray-400 uppercase mb-2">{label}</label>
      <div 
        className="relative bg-[#363748] rounded-2xl cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-5 flex justify-between items-center">
          <span className="text-white text-lg">
            {options.find(opt => opt.value === value)?.label}
          </span>
          <svg 
            className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute w-full mt-2 py-2 bg-[#363748] rounded-2xl shadow-lg z-50 overflow-hidden">
            {options.map((option) => (
              <div
                key={option.value}
                className={`mx-2 px-4 py-3 cursor-pointer transition-colors duration-200 rounded-xl
                          ${option.value === value 
                            ? 'text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-[#404255]'}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}