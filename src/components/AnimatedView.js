const { useState, useEffect, useRef } = React;

window.AnimatedView = function AnimatedView({
  children,
  animation = 'fade-up', // fade-up, scale-in, slide-left, slide-right
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = '',
  style = {},
  once = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && domRef.current) observer.unobserve(domRef.current);
        } else if (!once) {
          setIsVisible(false);
        }
      });
    }, { threshold, rootMargin: '0px 0px -5% 0px' });
    
    if (domRef.current) observer.observe(domRef.current);
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
      observer.disconnect();
    };
  }, [threshold, once]);

  const classes = [
    'animated-view',
    nim-,
    isVisible ? 'is-visible' : '',
    className
  ].filter(Boolean).join(' ');

  return React.createElement(
    'div',
    {
      ref: domRef,
      className: classes,
      style: {
        ...style,
        '--anim-delay': ${delay}ms,
        '--anim-duration': ${duration}ms
      }
    },
    children
  );
};
