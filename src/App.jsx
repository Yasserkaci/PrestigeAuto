import { useEffect, useRef, useState } from 'react'
import { gsap } from "gsap";
import { MessageCircle, Trophy, ChevronRight, Menu, X } from 'lucide-react';
import { TextPlugin } from "gsap/TextPlugin";
import { LogoMarquee } from './components/LogoMarquee'
import ImageGallery from './components/ImageGallery'
import AboutUs from './components/AboutUs'
import ContactSection from './components/Contact'
import Location from './components/Location'
import Footer from './components/Footer'

gsap.registerPlugin(TextPlugin);

const NAV_ITEMS = [
  { label: 'Gallery',  href: '#gallery'  },
  { label: 'About',    href: '#about'    },
  { label: 'Location', href: '#location' },
  { label: 'Contact',  href: '#contact'  },
];

const CUSTOM_CLIP = "polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px))";

function App() {
  const headerRef = useRef(null);
  const videoRef = useRef(null);
  const typingTextRef = useRef(null);
  const subtextRef = useRef(null);
  const btnRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const handleVideoEnd = () => {
    const tl = gsap.timeline();

    tl.to(headerRef.current, { y: -1, opacity: 1, duration: 0.3, ease: "expo.out" })
      .to(btnRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.5");

    tl.to(typingTextRef.current, {
      duration: 0.3,
      text: { value: "PRESTIGE IN EVERY MILE.", delimiter: "" },
      ease: "none",
    });

    tl.to(".spec-line", {
      duration: 0.2,
      stagger: 0.5,
      text: (_, target) => ({ value: target.getAttribute("data-text"), delimiter: "" }),
      ease: "none",
    }, "-=0.5");

    tl.to(subtextRef.current, { opacity: 0.6, y: 0, duration: 0.8, ease: "power2.out" }, "-=1");
  };

  useEffect(() => {
    gsap.set(headerRef.current, { y: -120, opacity: 0 });
    gsap.set(subtextRef.current, { opacity: 0, y: 10 });
    gsap.set(btnRef.current, { scale: 0.8, opacity: 0 });

    if (isMobile) {
      // No video on mobile — run hero animations immediately
      handleVideoEnd();
    } else if (videoRef.current) {
      gsap.to(videoRef.current, { opacity: 1, duration: 1.5 });
    }
  }, [isMobile]);

  return (
    <>
      <div className="relative w-full md:h-screen overflow-hidden bg-black font-sans">

        {/* Mobile background gradient (replaces video) */}
        <div className="md:hidden absolute inset-0 bg-linear-to-b from-zinc-900 via-black to-black z-0" />

        {/* Desktop video background */}
        {!isMobile && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-0"
          >
            <source src="/bg.mp4" type="video/mp4" />
          </video>
        )}

        {/* Desktop overlay */}
        <div className="hidden md:block absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80 z-10" />

        {/* Header */}
        <div ref={headerRef} className="fixed top-0 left-1/2 -translate-x-1/2 w-[95vw] md:w-[80vw] max-w-300 z-50">
          <div className="bg-white p-px" style={{ clipPath: CUSTOM_CLIP }}>
            <header
              className="w-full bg-[#111111]/95 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 py-2 h-15"
              style={{ clipPath: CUSTOM_CLIP }}
            >
              <a href="#top" className="text-white" aria-label="Home">
                <Trophy size={20} />
              </a>
              <nav className="hidden md:flex space-x-10">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="flex items-center gap-2">
                <a
                  href="#contact"
                  aria-label="Contact"
                  className="group flex items-center justify-center w-9 h-9 rounded-full border border-white/30 hover:bg-white transition-all"
                >
                  <MessageCircle size={16} className="text-white group-hover:text-black" />
                </a>
                <button
                  className="md:hidden flex items-center justify-center w-9 h-9 text-white"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>
              </div>
            </header>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-100 flex flex-col items-center justify-center">
            <button
              className="absolute top-6 right-6 text-white"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
            <nav className="flex flex-col items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[13px] uppercase tracking-[0.4em] text-gray-300 hover:text-white transition-all"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Hero Text — relative flow on mobile, absolute on desktop */}
        <div className="relative md:absolute z-20 pt-32 md:pt-0 px-5 md:px-0 md:left-[5vw] md:top-[25%] max-w-full md:max-w-125 border-l border-white/10 md:pl-5">
          <h2 className="text-white text-[10px] tracking-[0.5em] uppercase opacity-40 mb-3">
            Prestige Company // {new Date().getFullYear()} Collection
          </h2>
          <div className="flex items-baseline">
            <h1 ref={typingTextRef} className="text-white text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] min-h-[1em]" />
            <span className="inline-block w-1 h-[0.8em] bg-white ml-2 animate-pulse" />
          </div>
          <p ref={subtextRef} className="text-white mt-6 text-[11px] tracking-[0.2em] uppercase opacity-0">
            Featuring the Skoda Fabia Monte Carlo. <br /> Premium rental and international export.
          </p>
        </div>

        {/* CTA Button — relative flow on mobile, absolute bottom-center on desktop */}
        <div className="relative md:absolute md:inset-0 z-30 flex justify-center pt-10 pb-16 md:pt-0 md:pb-0 md:items-end md:py-[7vw] pointer-events-none">
          <button
            ref={btnRef}
            className="pointer-events-auto px-6 md:px-8 py-3 border border-white/60 bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white hover:text-black transition-all duration-500 group"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
          >
            Explore Fleet <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Specs — desktop only */}
        <div className="hidden md:block absolute right-[5vw] bottom-[10%] z-20 text-right font-['Doto']">
          <div className="space-y-1">
            <p className="spec-line text-[12px] text-white/40 tracking-widest uppercase" data-text="Transmission: DSG 7-Speed" />
            <p className="spec-line text-[14px] text-white tracking-[0.2em] uppercase" data-text="Engine: 1.5 TSI Monte Carlo" />
            <p className="spec-line text-[12px] text-white/40 tracking-widest uppercase" data-text="Availability: Immediate Export" />
          </div>
          <div className="mt-4 h-px w-32 bg-linear-to-l from-white/40 to-transparent ml-auto" />
        </div>
      </div>

      <LogoMarquee />
      <ImageGallery />
      <AboutUs />
      <Location />
      <ContactSection />
      <Footer />
    </>
  );
}

export default App;
