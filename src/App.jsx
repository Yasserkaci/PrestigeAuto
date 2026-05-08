import { useEffect, useRef } from 'react'
import './App.css'
import { gsap } from "gsap";
import { MessageCircle, Trophy, ChevronRight } from 'lucide-react';
import { TextPlugin } from "gsap/TextPlugin";
import {LogoMarquee} from './components/LogoMarquee'

import ImageGallery from './components/ImageGallery'
import AboutUs from './components/AboutUs'
import ContactSection from './components/Contact'

import Location from './components/Location'

gsap.registerPlugin(TextPlugin);

function App() {
  const headerRef = useRef(null);
  const videoRef = useRef(null);
  const typingTextRef = useRef(null);
  const subtextRef = useRef(null);
  const specRef = useRef(null);
  const btnRef = useRef(null);

  const handleVideoEnd = () => {
    const tl = gsap.timeline();

    // 1. Header and Central Button
    tl.to(headerRef.current, { y: -1, opacity: 1, duration: .3, ease: "expo.out" })
      .to(btnRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.5");

    // 2. Main Typing Animation
    tl.to(typingTextRef.current, {
      duration: .3,
      text: { value: "PRESTIGE IN EVERY MILE.", delimiter: "" },
      ease: "none",
    });

    // 3. Bottom Right Specs Typing
    tl.to(".spec-line", {
      duration: .2,
      stagger: 0.5,
      text: (i, target) => ({
        value: target.getAttribute("data-text"),
        delimiter: "",
      }),
      ease: "none",
    }, "-=0.5");

    // 4. Final Subtext Fade
    tl.to(subtextRef.current, { opacity: 0.6, y: 0, duration: 0.8, ease: "power2.out" }, "-=1");
  };

  useEffect(() => {
    gsap.set(headerRef.current, { y: -120, opacity: 0 });
    gsap.set(subtextRef.current, { opacity: 0, y: 10 });
    gsap.set(btnRef.current, { scale: 0.8, opacity: 0 });
    gsap.to(videoRef.current, { opacity: 1, duration: 1.5 });
  }, []);

  const navItems = ['Gallery', 'Superpowers', 'Why us', 'Process', 'Testimonial'];
  const customClipShape = "polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px))";

  return (
    <>
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      
      {/* Background Video Layer */}
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

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />

      {/* Header Container */}
      <div ref={headerRef} className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1200px] z-50">
        <div className="bg-white p-[1px]" style={{ clipPath: customClipShape }}>
          <header className="w-full bg-[#111111]/95 backdrop-blur-xl flex items-center justify-between px-8 py-2 h-[60px]" style={{ clipPath: customClipShape }}>
            <Trophy size={20} className="text-white" />
            <nav className="hidden md:flex space-x-10">
              {navItems.map((item) => (
                <a key={item} href="#" className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all">
                  {item}
                </a>
              ))}
            </nav>
            <a href="#" className="group flex items-center justify-center w-9 h-9 rounded-full border border-white/30 hover:bg-white transition-all">
              <MessageCircle size={16} className="text-white group-hover:text-black" />
            </a>
          </header>
        </div>
      </div>

      {/* Main Hero (Left Side) */}
      <div className="absolute left-[5vw] top-[25%] z-20 max-w-[500px] border-l border-white/10 pl-5">
        <h2 className="text-white text-[10px] tracking-[0.5em] uppercase opacity-40 mb-3">Prestige Company // 2024 Collection</h2>
        <div className="flex items-baseline">
          <h1 ref={typingTextRef} className="text-white text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] min-h-[1em]"></h1>
          <span className="inline-block w-1 h-[0.8em] bg-white ml-2 animate-pulse" />
        </div>
        <p ref={subtextRef} className="text-white mt-6 text-[11px] tracking-[0.2em] uppercase opacity-0">
          Featuring the Skoda Fabia Monte Carlo. <br /> Premium rental and international export.
        </p>
      </div>

      {/* Central CTA Button */}
      <div className="absolute  inset-0 flex items-end py-[7vw] justify-center z-30 pointer-events-none">
        <button 
          ref={btnRef}
          className="pointer-events-auto px-8 py-3 border border-white/60 bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white hover:text-black transition-all duration-500 group"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
        >
          Explore Fleet <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Right Bottom Specs (Doto Font) */}
      <div className="absolute right-[5vw] bottom-[10%] z-20 text-right font-['Doto']">
        <div className="space-y-1">
          <p className="spec-line text-[12px] text-white/40 tracking-widest uppercase" data-text="Transmission: DSG 7-Speed"></p>
          <p className="spec-line text-[14px] text-white tracking-[0.2em] uppercase" data-text="Engine: 1.5 TSI Monte Carlo"></p>
          <p className="spec-line text-[12px] text-white/40 tracking-widest uppercase" data-text="Availability: Immediate Export"></p>
        </div>
        <div className="mt-4 h-[1px] w-32 bg-gradient-to-l from-white/40 to-transparent ml-auto" />
      </div>
          
    </div>
    <LogoMarquee/>
    <ImageGallery/>
    <AboutUs/>
    <Location/>
    <ContactSection/>
 
    </>
  )
}

export default App;