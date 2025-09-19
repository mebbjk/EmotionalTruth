// Created the Footer component.
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-4 flex justify-center items-center">
            <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Emotional Truth. All Rights Reserved.
            </p>
      </div>
    </footer>
  );
};