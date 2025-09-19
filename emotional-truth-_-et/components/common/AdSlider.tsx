import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

export const AdSlider: React.FC = () => {
  const { ads } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = useCallback(() => {
    if (ads.length === 0) return;
    setCurrentIndex(prev => (prev === 0 ? ads.length - 1 : prev - 1));
  }, [ads.length]);

  const goToNext = useCallback(() => {
    if (ads.length === 0) return;
    setCurrentIndex(prev => (prev === ads.length - 1 ? 0 : prev + 1));
  }, [ads.length]);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext, ads.length]);

  if (!ads || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentIndex];

  const handleAdClick = () => {
    window.open(currentAd.link, '_blank', 'noopener,noreferrer');
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent ad click
    goToPrev();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent ad click
    goToNext();
  };

  const handleDotClick = (e: React.MouseEvent, slideIndex: number) => {
    e.stopPropagation(); // Prevent ad click
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full container mx-auto h-52 my-4 group">
      {/* Clickable background and content */}
      <div
        onClick={handleAdClick}
        className="w-full h-full rounded-md bg-center bg-cover duration-500 cursor-pointer"
        style={{ backgroundImage: `url(${currentAd.imageUrl})` }}
        role="button"
        tabIndex={0}
        aria-label={`Ad: ${currentAd.title}`}
        onKeyDown={(e) => e.key === 'Enter' && handleAdClick()}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md pointer-events-none">
          <h3 className="text-white text-2xl font-semibold p-4 text-center">{currentAd.title}</h3>
        </div>
      </div>

      {/* Left Arrow */}
      <div
        onClick={handlePrevClick}
        className="absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        role="button"
        aria-label="Previous ad"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </div>

      {/* Right Arrow */}
      <div
        onClick={handleNextClick}
        className="absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        role="button"
        aria-label="Next ad"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </div>

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center py-2 z-10">
        {ads.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={(e) => handleDotClick(e, slideIndex)}
            className={`text-2xl cursor-pointer p-1 ${currentIndex === slideIndex ? 'text-white' : 'text-gray-400'}`}
            role="button"
            aria-label={`Go to ad ${slideIndex + 1}`}
          >
            ●
          </div>
        ))}
      </div>
    </div>
  );
};
