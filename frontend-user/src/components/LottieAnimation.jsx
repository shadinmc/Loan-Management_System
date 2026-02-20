import { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

export default function LottieAnimation({
  src,
  fallback = null,
  loop = true,
  autoplay = true,
  style = {},
  className = '',
  onComplete,
  speed = 1,
  hover = false,
  ...props
}) {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const lottieRef = useRef(null);

  useEffect(() => {
    const fetchAnimation = async () => {
      if (!src) {
        setIsLoading(false);
        setError(true);
        return;
      }

      try {
        setIsLoading(true);
        setError(false);

        const response = await fetch(src);
        if (!response.ok) throw new Error('Failed to fetch animation');

        const data = await response.json();
        setAnimationData(data);
      } catch (err) {
        console.warn('Lottie fetch failed:', src);
        setError(true);if (fallback) {
          setAnimationData(fallback);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimation();
  }, [src, fallback]);

  const handleMouseEnter = () => {
    if (hover && lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (hover && lottieRef.current) {
      lottieRef.current.stop();
    }
  };

  if (isLoading) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="lottie-loader" />
      </div>
    );
  }

  if (error && !animationData) {
    return null;
  }

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={hover ? false : autoplay}
        style={{ width: '100%', height: '100%' }}
        onComplete={onComplete}
        {...props}
      />
    </motion.div>
  );
}