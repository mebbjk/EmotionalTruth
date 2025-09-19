// Created a reusable Modal component.
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={handleBackdropClick}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end p-4 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};