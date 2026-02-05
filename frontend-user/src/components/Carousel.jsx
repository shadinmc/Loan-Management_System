// src/components/Carousel.jsx
import { useState, useEffect, useRef } from 'react';

/**
 * Carousel Component
 * Premium fintech design with solid colors
 */
export default function Carousel({
  items = [],
  autoPlay = false,
  interval = 3000,
  showDots = true,
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, items.length, interval]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <div
      className={`carousel ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Image carousel"
    >
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="carousel-slide"
              aria-hidden={index !== currentIndex}
            >
              {item}
            </div>
          ))}
        </div></div>

      {showDots && items.length > 1 && (
        <div className="carousel-dots" role="tablist">
          {items.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style>{carouselStyles}</style>
    </div>
  );
}

const carouselStyles = `
  .carousel {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .carousel-container {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .carousel-track {
    display: flex;
    width: 100%;
    transition: transform 0.4s ease;
  }

  .carousel-slide {
    flex: 0 0 100%;
    width: 100%;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 24px;
  }

  .carousel-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  .carousel-dot.active {
    background: #2DBE60;
    transform: scale(1.2);
  }

  .carousel-dot:hover:not(.active) {
    background: rgba(255, 255, 255, 0.5);
  }

  .carousel-dot:focus-visible {
    outline: 2px solid #2DBE60;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    .carousel-dots {
      margin-top: 16px;
    }

    .carousel-dot {
      width: 8px;
      height: 8px;
    }
  }
`;
