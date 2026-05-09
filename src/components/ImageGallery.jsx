import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  { ref: 'bm1', src: '/pics/bm5.jpg', alt: 'Gallery 1', style: { top: '10%', left: '5%',  width: '50%', height: '20%' } },
  { ref: 'bm2', src: '/pics/bm1.jpg', alt: 'Gallery 2', style: { top: '10%', left: '73%', width: '22%', height: '55%' } },
  { ref: 'bm3', src: '/pics/bm3.jpg', alt: 'Gallery 3', style: { top: '35%', left: '30%', width: '38%', height: '32%' }, center: true },
  { ref: 'bm4', src: '/pics/bm4.jpg', alt: 'Gallery 4', style: { top: '40%', left: '5%',  width: '18%', height: '50%' } },
  { ref: 'bm5', src: '/pics/bm2.jpg', alt: 'Gallery 5', style: { top: '75%', right: '5%', width: '55%', height: '30%' } },
];

const ImageGallery = () => {
  const sectionRef = useRef(null);
  const bm1Ref = useRef(null);
  const bm2Ref = useRef(null);
  const bm3Ref = useRef(null);
  const bm4Ref = useRef(null);
  const bm5Ref = useRef(null);
  const midRef = useRef(null);

  const imgRefs = [bm1Ref, bm2Ref, bm3Ref, bm4Ref, bm5Ref];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.innerWidth < 768) return;

      gsap.set(imgRefs.map((r) => r.current), { filter: 'brightness(0.8)' });
      gsap.set(bm3Ref.current, { zIndex: 50 });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .to(bm3Ref.current, { scale: 2.2, boxShadow: '0px 20px 80px rgba(0,0,0,0.9)', ease: 'none' }, 0)
        .to(bm2Ref.current, { scale: 5.2, xPercent:  560, yPercent: -560, ease: 'none' }, 0)
        .to(bm1Ref.current, { scale: 5.2, xPercent: -560, yPercent: -560, ease: 'none' }, 0)
        .to(bm4Ref.current, { scale: 5.2, xPercent: -560, yPercent:  560, ease: 'none' }, 0)
        .to(bm5Ref.current, { scale: 5.2, xPercent:  480, yPercent:  560, ease: 'none' }, 0)
        .to(midRef.current,  { filter: 'grayscale(0%)' }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full bg-[#050505] overflow-hidden flex items-center justify-center z-10 md:h-screen"
    >
      {/* Gallery label */}
      <div className="absolute top-[8%] left-[5vw] flex items-center z-50">
        <span className="h-px w-8 bg-white/20 mr-4" />
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-['Doto']">
          Prestige // Gallery
        </p>
      </div>

      {/* Mobile: simple grid */}
      <div className="md:hidden w-full px-5 py-24 grid grid-cols-2 gap-2">
        <img src="/pics/bm5.jpg" alt="Gallery 1" className="rounded w-full h-36 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        <img src="/pics/bm1.jpg" alt="Gallery 2" className="rounded w-full h-36 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        <img src="/pics/bm3.jpg" alt="Gallery 3" className="col-span-2 rounded w-full h-44 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        <img src="/pics/bm4.jpg" alt="Gallery 4" className="rounded w-full h-36 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        <img src="/pics/bm2.jpg" alt="Gallery 5" className="rounded w-full h-36 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
      </div>

      {/* Desktop: scroll-animated mosaic */}
      <div className="hidden md:block relative w-[85vw] max-w-275 m-auto aspect-video">

        {/* bm1 - Top Left */}
        <div ref={bm1Ref} className="absolute overflow-hidden shadow-xl" style={IMAGES[0].style}>
          <img src={IMAGES[0].src} alt={IMAGES[0].alt} className="w-full h-full rounded object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>

        {/* bm2 - Right Vertical */}
        <div ref={bm2Ref} className="absolute overflow-hidden shadow-xl" style={IMAGES[1].style}>
          <img src={IMAGES[1].src} alt={IMAGES[1].alt} className="w-full h-full rounded object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>

        {/* bm3 - Center (expands on scroll) */}
        <div ref={bm3Ref} className="absolute border border-white/10 overflow-hidden shadow-2xl origin-center will-change-transform" style={IMAGES[2].style}>
          <img ref={midRef} src={IMAGES[2].src} alt={IMAGES[2].alt} className="w-full h-full rounded object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>

        {/* bm4 - Left Vertical */}
        <div ref={bm4Ref} className="absolute overflow-hidden shadow-xl" style={IMAGES[3].style}>
          <img src={IMAGES[3].src} alt={IMAGES[3].alt} className="w-full h-full rounded object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>

        {/* bm5 - Bottom Right */}
        <div ref={bm5Ref} className="absolute overflow-hidden shadow-xl" style={IMAGES[4].style}>
          <img src={IMAGES[4].src} alt={IMAGES[4].alt} className="w-full h-full rounded object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
