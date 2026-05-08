import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ImageGallery = () => {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null); // The actual moving parts
  
  const bm1Ref = useRef(null); 
  const bm2Ref = useRef(null); 
  const bm3Ref = useRef(null); 
  const bm4Ref = useRef(null); 
  const bm5Ref = useRef(null); 
  const midRef = useRef(null); 

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Initial state: Full brightness
      gsap.set([bm1Ref.current, bm2Ref.current, bm3Ref.current, bm4Ref.current, bm5Ref.current], { 
        filter: 'brightness(.8)' 
      });
      gsap.set(bm3Ref.current, { zIndex: 50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          // '+=100%' means the animation happens over 1 full viewport scroll
          // This makes it feel much faster and lets you move to the next section quickly
          end: '+=100%', 
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true, // Recalculates on window resize
        }
      });
      
      tl.to(bm3Ref.current, { 
        scale: 2.2,         
          boxShadow: '0px 20px 80px rgba(0,0,0,0.9)',
          ease: 'none'
        }, 0)
        .to(bm2Ref.current, {scale: 5.2,  xPercent: 560, yPercent: -560, ease: 'none' }, 0)
        .to(bm1Ref.current, {scale: 5.2,  xPercent: -560, yPercent: -560, ease: 'none' }, 0)
        .to(bm4Ref.current, {scale: 5.2,  xPercent: -560, yPercent: 560, ease: 'none' }, 0)
        .to(bm5Ref.current, {scale: 5.2,  xPercent: 480, yPercent: 560, ease: 'none' }, 0)
        .to(midRef.current, {filter: 'grayscale(0%)'}, 0);

    });

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      // h-screen and items-center are critical for the perfect center
      className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center z-10"
    >
      <div className="absolute top-[8%] left-[5vw] flex items-center z-50">
        <span className="h-[1px] w-8 bg-white/20 mr-4"></span>
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-['Doto']">
          Prestige // Gallery
        </p>
      </div>

      {/* The Wrapper holds the mosaic - aspect ratio keeps it consistent */}
      <div 
        ref={wrapperRef}
        className="relative w-[85vw] max-w-[1100px] m-auto aspect-video"
      >
        
        {/* bm1 - Top Left */}
        <div ref={bm1Ref} className="absolute   overflow-hidden shadow-xl" style={{ top: '10%', left: '5%', width: '50%', height: '20%' }}>
          <img src="/pics/bm5.jpg" alt="bm1" className="w-full  rounded  grayscale hover:grayscale-0  transition-all duration-700 h-full object-cover" />
        </div>

        {/* bm2 - Right Vertical */}
        <div ref={bm2Ref} className="absolute  overflow-hidden shadow-xl" style={{ top: '10%', left: '73%', width: '22%', height: '55%' }}>
          <img src="/pics/bm1.jpg" alt="bm2" className="w-full rounded  grayscale hover:grayscale-0  transition-all duration-700  h-full object-cover" />
        </div>

        {/* bm3 - Center Expansion */}
        <div ref={bm3Ref} className="absolute  border border-white/10 overflow-hidden shadow-2xl origin-center will-change-transform" style={{ top: '35%', left: '30%', width: '38%', height: '32%' }}>
          <img src="/pics/bm3.jpg" ref={midRef} alt="bm3" className="w-full rounded  grayscale hover:grayscale-0  transition-all duration-700  h-full object-cover" />
        </div>

        {/* bm4 - Left Vertical */}
        <div ref={bm4Ref} className="absolute  overflow-hidden shadow-xl" style={{ top: '40%', left: '5%', width: '18%', height: '50%' }}>
          <img src="/pics/bm4.jpg" alt="bm4" className="w-full rounded  grayscale hover:grayscale-0  transition-all duration-700  h-full object-cover" />
        </div>

        {/* bm5 - Bottom Right */}
        <div ref={bm5Ref} className="absolute  overflow-hidden shadow-xl" style={{ top: '75%', right: '5%', width: '55%', height: '30%' }}>
          <img src="/pics/bm2.jpg" alt="bm5" className="w-full rounded  grayscale hover:grayscale-0  transition-all duration-700  h-full object-cover" />
        </div>

      </div>
    </section>
  );
};

export default ImageGallery;