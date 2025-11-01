'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * LazyImage component with intersection observer
 * Only loads images when they're about to enter the viewport
 */
const LazyImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  placeholder = '/music.svg',
  rootMargin = '50px' // Start loading 50px before entering viewport
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // If no IntersectionObserver support, load immediately
    if (!('IntersectionObserver' in window)) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: rootMargin,
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [src, rootMargin]);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${!isLoaded && imageSrc !== placeholder ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && imageSrc !== placeholder && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse rounded-lg" />
      )}
    </div>
  );
};

export default LazyImage;
