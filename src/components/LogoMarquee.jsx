import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LogoMarquee = () => {
  const marqueeRef = useRef(null);

  // List your filenames here exactly as they appear in your public folder
  const logoFiles = [
    "bmw.png",
    "audi.svg",
    "volk.svg",
    "mer.png",
  ];

  useEffect(() => {
    const marquee = marqueeRef.current;
    const scrollWidth = marquee.scrollWidth;
    
    // Seamless infinite loop logic
    const animation = gsap.to(marquee, {
      x: -scrollWidth / 2, 
      duration: 25, // Speed control
      ease: "none",
      repeat: -1,
    });

    // Interaction: Slow down on hover
    const handleEnter = () => gsap.to(animation, { timeScale: 0.2, duration: 1 });
    const handleLeave = () => gsap.to(animation, { timeScale: 1, duration: 1 });

    marquee.addEventListener("mouseenter", handleEnter);
    marquee.addEventListener("mouseleave", handleLeave);

    return () => {
      animation.kill();
      marquee.removeEventListener("mouseenter", handleEnter);
      marquee.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className="relative py-3 bg-black border-t border-white/5 overflow-hidden">
   
      
      <div className="flex overflow-hidden">
        <div 
          ref={marqueeRef}
          className="flex whitespace-nowrap gap-32 items-center py-4"
        >
          {/* Double the array for the seamless loop effect */}
          {[...logoFiles, ...logoFiles].map((file, index) => (
            <img 
              key={index}
              src={`/${file}`} 
              alt="Car Brand Logo"
              className="h-12 md:h-16 w-auto object-contain  hover:opacity-100 transition-opacity duration-700  hover:grayscale-0 cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* Edge Softening Gradients */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export  {LogoMarquee};