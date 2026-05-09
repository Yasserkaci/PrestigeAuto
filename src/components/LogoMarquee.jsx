import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LOGOS = ['bmw.png', 'audi.svg', 'volk.svg', 'mer.png'];

const LogoMarquee = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;

    const animation = gsap.to(marquee, {
      x: -marquee.scrollWidth / 2,
      duration: 25,
      ease: 'none',
      repeat: -1,
    });

    const handleEnter = () => gsap.to(animation, { timeScale: 0.2, duration: 1 });
    const handleLeave = () => gsap.to(animation, { timeScale: 1,   duration: 1 });

    marquee.addEventListener('mouseenter', handleEnter);
    marquee.addEventListener('mouseleave', handleLeave);

    return () => {
      animation.kill();
      marquee.removeEventListener('mouseenter', handleEnter);
      marquee.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section className="relative py-3 bg-black border-t border-white/5 overflow-hidden">
      <div className="flex overflow-hidden">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-32 items-center py-4">
          {[...LOGOS, ...LOGOS].map((file, i) => {
            const brand = file.split('.')[0]
              .replace('volk', 'volkswagen')
              .replace('mer', 'mercedes-benz');
            return (
              <img
                key={i}
                src={`/${file}`}
                alt={`${brand} logo`}
                loading="lazy"
                className="h-12 md:h-16 w-auto object-contain hover:opacity-100 transition-opacity duration-700 hover:grayscale-0 cursor-pointer"
              />
            );
          })}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export { LogoMarquee };
