// src/components/Carousel.jsx
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({
  items = [],
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
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
    setCurrentIndex(index);};

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
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
    >
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="carousel-slide">
              {item}
            </div>
          ))}
        </div>

        {showArrows && items.length > 1 && (
          <>
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={goToPrevious}
              type="button"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={goToNext}
              type="button"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {showDots && items.length > 1 && (
        <div className="carousel-dots">
          {items.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              type="button"
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
    border-radius: 16px;
  }

  .carousel-track {
    display: flex;
    width: 100%;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .carousel-slide {
    flex: 0 0 100%;
    width: 100%;
  }

  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .carousel-arrow:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  .carousel-arrow-left {
    left: 24px;
  }

  .carousel-arrow-right {
    right: 24px;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
  }

  .carousel-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: var(--bg-tertiary);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .carousel-dot.active {
    background: var(--accent-primary);
    transform: scale(1.2);
  }

  .carousel-dot:hover {
    background: var(--accent-primary);
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .carousel-arrow {
      width: 40px;
      height: 40px;
    }

    .carousel-arrow-left {
      left: 12px;
    }

    .carousel-arrow-right {
      right: 12px;
    }
  }
`;
