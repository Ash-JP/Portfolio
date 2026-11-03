"use client";

import { motion, useMotionValue, AnimatePresence, useSpring, useMotionTemplate } from "framer-motion";
import { portfolioData } from "@/lib/data";
import {
  ArrowUpRight, AtSign, Home, Send, Plus, Briefcase,
  Award, GraduationCap, Sparkles, FileText, CheckCircle2,
  Terminal, Layers, Cpu, Database, Wrench, Quote
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { IglooStyleIcons } from "@/components/ThreeDIcons";
import { ThreeDBackground } from "@/components/ThreeDBackground";
import { AgentTerminalModal } from "@/components/AgentTerminalModal";
import { IntroAnimation } from "@/components/IntroAnimation";

// Apple-style Bezier Curve
const smoothEase = [0.16, 1, 0.3, 1];

// Shared Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smoothEase }
  }
};

// --- Magnetic Element Component ---
function MagneticElement({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.25);
    y.set(middleY * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Apple-Style Floating Nav Dock with Embedded Agent Tool Trigger ---
function FloatingNav({
  activePage,
  setActivePage,
  onOpenAgent
}: {
  activePage: string;
  setActivePage: (p: string) => void;
  onOpenAgent: () => void;
}) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Overview' },
    { id: 'projects', icon: Briefcase, label: 'Projects & Reviews' },
    { id: 'contact', icon: AtSign, label: 'Contact' },
  ];

  return (
    <>
      {/* Desktop Floating Island Dock */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2.5 items-start">
        <div className="flex flex-col gap-2.5 bg-[#181426]/75 backdrop-blur-2xl border border-[#9893ad]/20 p-2.5 rounded-3xl shadow-[0_16px_50px_rgba(19,17,30,0.6),inset_0_1px_1px_rgba(212,206,226,0.1)]">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <MagneticElement key={item.id}>
                <motion.button
                  onClick={() => {
                    setActivePage(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group relative flex items-center h-11 rounded-2xl overflow-hidden transition-all duration-300 ease-out
                    ${isActive ? 'bg-[#352a54]/60 text-[#f5f3ff] border border-[#9893ad]/40 shadow-[0_0_25px_rgba(67,52,107,0.4)]' : 'text-[#9893ad] hover:bg-[#292242]/40 hover:text-[#d4cee2] border border-transparent'}
                  `}
                  initial={{ width: 44 }}
                  whileHover={{ width: 180 }}
                >
                  <div className="w-11 h-11 flex items-center justify-center shrink-0">
                    <item.icon size={19} className={isActive ? "text-[#d4cee2]" : "text-[#9893ad] group-hover:text-[#d4cee2]"} />
                  </div>
                  <span className="font-semibold text-xs tracking-wider uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 font-[family-name:var(--font-space-grotesk)]">
                    {item.label}
                  </span>
                </motion.button>
              </MagneticElement>
            );
          })}

          <div className="w-8 h-px bg-[#9893ad]/15 mx-auto my-1" />

          {/* Dedicated Agent CLI Dock Trigger */}
          <MagneticElement>
            <motion.button
              onClick={onOpenAgent}
              className="group relative flex items-center h-11 rounded-2xl overflow-hidden transition-all duration-300 ease-out bg-[#1e1930]/60 hover:bg-[#292242]/70 border border-[#9893ad]/25 text-[#d4cee2] shadow-[0_0_15px_rgba(67,52,107,0.2)]"
              initial={{ width: 44 }}
              whileHover={{ width: 180 }}
              title="Launch AI Agent CLI"
            >
              <div className="w-11 h-11 flex items-center justify-center shrink-0 relative">
                <Terminal size={18} className="text-[#d4cee2] group-hover:scale-110 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#c4b5fd] animate-pulse" />
              </div>
              <span className="font-semibold text-xs tracking-wider uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 font-mono">
                Agent Terminal
              </span>
            </motion.button>
          </MagneticElement>
        </div>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex lg:hidden items-center justify-center gap-2 bg-[#181426]/85 backdrop-blur-2xl border border-[#9893ad]/20 p-2 rounded-full shadow-[0_10px_40px_rgba(19,17,30,0.8)]">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-all shrink-0
                ${isActive ? 'bg-[#352a54]/60 text-[#f5f3ff] border border-[#9893ad]/40' : 'text-[#9893ad] hover:text-[#d4cee2]'}
              `}
            >
              <item.icon size={19} />
            </button>
          );
        })}
        <div className="w-px h-6 bg-[#9893ad]/20 mx-1"></div>
        <button
          onClick={onOpenAgent}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#1e1930]/60 text-[#d4cee2] border border-[#9893ad]/25 relative"
          title="Open Agent Terminal"
        >
          <Terminal size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#c4b5fd] animate-pulse" />
        </button>
      </div>
    </>
  );
}

// Category Icons Mapping for Skills Arsenal
function getCategoryIcon(cat: string) {
  switch (cat) {
    case "Programming Languages":
      return <Cpu size={16} className="text-purple-400" />;
    case "Frameworks & Tech":
      return <Layers size={16} className="text-fuchsia-400" />;
    case "Tools & Platforms":
      return <Wrench size={16} className="text-violet-400" />;
    case "Core Areas":
      return <Database size={16} className="text-indigo-400" />;
    default:
      return <Sparkles size={16} className="text-purple-400" />;
  }
}

// --- Main Minimalist Layout ---
export function MinimalistLayout() {
  const [activePage, setActivePage] = useState("home");
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  // Intro animation state — plays only once on the first time the website is opened
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  // Supabase Reviews State
  const [liveReviews, setLiveReviews] = useState<any[]>(portfolioData.reviews || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setLiveReviews(data);
        }
      } catch (err) {
        console.error("Supabase fetch failed", err);
      }
    };
    fetchReviews();
  }, []);

  // Subtle Interactive Cursor Spotlight with Lavender Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(192, 132, 252, 0.05), transparent 75%)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Review Carousel Timer
  useEffect(() => {
    if (activePage !== "projects" || isReviewFormOpen || liveReviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % liveReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activePage, isReviewFormOpen, liveReviews.length]);

  return (
    <div className="bg-[#13111e] min-h-screen text-[#d4cee2] font-[family-name:var(--font-inter)] selection:bg-[#43346b]/50 selection:text-[#f5f3ff] relative overflow-x-clip">
      
      {/* Cinematic Intro — plays once on initial website load */}
      {!introComplete && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

      {/* Embedded Agent Terminal Modal */}
      <AgentTerminalModal 
        isOpen={isAgentOpen} 
        onClose={() => setIsAgentOpen(false)} 
      />

      {/* Atmospheric Twilight Radial Auras (Extracted from Video Reference) */}
      <div className="fixed top-[22%] left-[4%] w-[520px] h-[520px] bg-[#352a54]/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#352a54]/18 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#43346b]/18 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Precision Hairline Background Grid (Apple Architectural Style) */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(212, 206, 226, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(212, 206, 226, 0.05) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(circle at 50% 30%, #000 30%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 30%, #000 30%, transparent 90%)"
        }}
      />

      {/* Global Interactive Cursor Spotlight */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{
          background: spotlightBackground,
          mixBlendMode: "screen",
        }}
      />

      {/* 3D Modern Luxury Sculpture in Background */}
      {/* Smoothly glides & morphs across activePage without re-triggering intro logo */}
      <ThreeDBackground introComplete={introComplete} activePage={activePage} />

      <FloatingNav 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenAgent={() => setIsAgentOpen(true)}
      />

      {/* Main Content Layout: Compact responsive structure on mobile, static sticky on desktop */}
      <div className="mx-auto min-h-screen max-w-screen-xl px-4 py-8 pb-28 md:px-12 md:py-20 lg:px-24 lg:pl-32 lg:py-0 lg:pb-0 flex flex-col lg:flex-row gap-8 lg:gap-16 relative z-10">

        {/* Left Column (100% STATIC STICKY PROFILE: Locked to viewport height on desktop, streamlined on mobile) */}
        <header className="lg:sticky lg:top-0 lg:h-screen lg:self-start lg:w-5/12 lg:flex lg:flex-col lg:justify-center text-center lg:text-left items-center lg:items-start shrink-0 overflow-hidden py-4 lg:py-0">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1.2, ease: smoothEase }}
            className="flex flex-col items-center lg:items-start w-full"
          >
            {/* Profile Picture with Ambient Twilight Halo — compact on mobile */}
            <div className="mb-4 sm:mb-7 relative flex-shrink-0 group">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#43346b]/60 via-[#352a54]/50 to-[#292242]/60 blur-md group-hover:blur-lg transition-all duration-700 opacity-80 group-hover:opacity-100" />
              <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 relative rounded-full overflow-hidden border-2 border-[#9893ad]/20 group-hover:border-[#d4cee2]/60 transition-all duration-700 shadow-2xl bg-[#1e1930]/90">
                <img 
                  src="/profile.png" 
                  alt={portfolioData.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Name with Metallic Silk-to-Lavender Gradient — responsive size */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-[family-name:var(--font-syne)] uppercase">
              <span className="bg-gradient-to-b from-[#f5f3ff] via-[#d4cee2] to-[#9893ad] bg-clip-text text-transparent">
                {portfolioData.name}
              </span>
            </h1>

            {/* Titles — compact wrapped chips on mobile */}
            <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm font-mono tracking-wider uppercase text-[#d4cee2]/90">
              <span>B.Tech CSE (AI & ML)</span>
              <span className="text-[#5d5a70]">•</span>
              <span>Full Stack</span>
              <span className="text-[#5d5a70]">•</span>
              <span>UI/UX</span>
              <span className="text-[#5d5a70]">•</span>
              <span>Tech Lead</span>
            </div>

            {/* Concise Bio */}
            <p className="mt-3.5 sm:mt-5 max-w-sm leading-relaxed text-[#9893ad] text-xs sm:text-sm md:text-base font-light">
              Designing and engineering high-impact digital products where intelligent problem-solving meets modern architectural precision.
            </p>

            {/* Clean Apple-Style Action Buttons — compact row on mobile */}
            <div className="mt-5 sm:mt-7 flex flex-col gap-2.5 sm:gap-3 w-full max-w-sm">
              <div className="flex items-center gap-2.5 sm:gap-3 w-full">
                <a
                  href="/api/v1/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[#1e1930]/60 hover:bg-[#292242]/70 border border-[#9893ad]/20 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#d4cee2] hover:text-white transition-all flex items-center justify-center gap-2 group shadow-[inset_0_1px_1px_rgba(212,206,226,0.1)] backdrop-blur-md"
                >
                  <FileText size={13} className="text-[#c4b5fd] group-hover:scale-110 transition-transform" />
                  Resume
                </a>
                <button
                  onClick={() => {
                    setActivePage("contact");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[#352a54]/50 hover:bg-[#352a54]/80 border border-[#9893ad]/30 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#f5f3ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(67,52,107,0.3)] hover:shadow-[0_0_25px_rgba(67,52,107,0.5)] backdrop-blur-md"
                >
                  <AtSign size={13} />
                  Get in Touch
                </button>
              </div>

              {/* Agent CLI Feature Button */}
              <button
                onClick={() => setIsAgentOpen(true)}
                className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1e1930]/80 via-[#292242]/80 to-[#1e1930]/80 hover:from-[#292242] hover:to-[#352a54] border border-[#9893ad]/25 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#d4cee2] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(67,52,107,0.2)] backdrop-blur-md"
              >
                <Terminal size={13} className="text-[#c4b5fd]" />
                <span>Launch Agent CLI Tool</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c4b5fd] animate-pulse ml-1" />
              </button>
            </div>

            {/* Static Left Footer */}
            <div className="hidden lg:block text-xs font-mono text-[#9893ad]/50 tracking-wider pt-7">
              AashrayOS Minimalist Perspective · v2.5
            </div>
          </motion.div>
        </header>

        {/* Right Column (Scrollable Dynamic Content) */}
        <main className="pt-6 lg:w-7/12 lg:py-24 flex flex-col pb-24">
          <AnimatePresence mode="wait">
            {introComplete && (
            <>

            {/* PAGE: HOME / OVERVIEW */}
            {activePage === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
                className="flex flex-col gap-12 sm:gap-24"
              >
                {/* About Section */}
                <motion.section id="about" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-40px" }} variants={staggerContainer}>
                  <motion.div variants={itemUp} className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                    <h2 className="text-xl sm:text-3xl font-black uppercase text-white font-[family-name:var(--font-syne)] tracking-tight">
                      About & Philosophy
                    </h2>
                    <span className="flex-1 h-px bg-gradient-to-r from-[#43346b]/60 via-[#352a54]/30 to-transparent"></span>
                  </motion.div>

                  <motion.div variants={itemUp} className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#1e1930]/40 border border-[#9893ad]/15 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_12px_40px_rgba(19,17,30,0.6)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#43346b]/15 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-[#d4cee2] text-sm sm:text-base md:text-lg font-light leading-relaxed mb-4 sm:mb-6">
                      {portfolioData.bio}
                    </p>
                    
                    {/* Focus Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-[#9893ad]/15">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#c4b5fd] mt-1 shrink-0" />
                        <div>
                          <h4 className="text-xs font-mono uppercase text-white font-semibold">Web Development</h4>
                          <p className="text-xs text-[#9893ad] font-light mt-0.5">Production Next.js & React</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#d4cee2] mt-1 shrink-0" />
                        <div>
                          <h4 className="text-xs font-mono uppercase text-white font-semibold">AI & Machine Learning</h4>
                          <p className="text-xs text-[#9893ad] font-light mt-0.5">Computer Vision & PyTorch</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#a78bfa] mt-1 shrink-0" />
                        <div>
                          <h4 className="text-xs font-mono uppercase text-white font-semibold">Leadership</h4>
                          <p className="text-xs text-[#9893ad] font-light mt-0.5">IEEE & ISTE Management</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.section>

                {/* Experience Timeline */}
                <motion.section id="experience" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-40px" }} variants={staggerContainer}>
                  <motion.div variants={itemUp} className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                    <h2 className="text-xl sm:text-3xl font-black uppercase text-white font-[family-name:var(--font-syne)] tracking-tight">
                      Experience & Leadership
                    </h2>
                    <span className="flex-1 h-px bg-gradient-to-r from-[#43346b]/60 via-[#352a54]/30 to-transparent"></span>
                  </motion.div>

                  <div className="relative pl-5 sm:pl-6 border-l border-[#9893ad]/20 flex flex-col gap-6 sm:gap-10">
                    {portfolioData.experience.map((exp) => (
                      <motion.div 
                        key={exp.id} 
                        variants={itemUp} 
                        className="group relative transition-all"
                      >
                        {/* Glowing Node Dot on Timeline */}
                        <div className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#13111e] border-2 border-[#c4b5fd] group-hover:scale-125 group-hover:border-white transition-all duration-300 shadow-[0_0_12px_rgba(196,181,253,0.6)]" />

                        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1e1930]/40 border border-[#9893ad]/15 hover:border-[#d4cee2]/40 backdrop-blur-2xl transition-all duration-300 shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_8px_30px_rgba(19,17,30,0.5)]">
                          {/* Duration Badge */}
                          <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#292242]/70 border border-[#9893ad]/25 text-[#d4cee2] text-[10px] sm:text-[11px] font-mono uppercase tracking-wider mb-2.5 sm:mb-3">
                            {exp.duration}
                          </div>

                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-[#d4cee2] transition-colors font-[family-name:var(--font-syne)] uppercase tracking-tight">
                            {exp.role} <span className="text-[#5d5a70] font-normal">·</span> {exp.company}
                          </h3>

                          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#9893ad] font-light">
                            {exp.description}
                          </p>

                          <div className="mt-3.5 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                            {exp.tech.map((tech, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono bg-[#1e1930]/80 text-[#d4cee2] border border-[#9893ad]/20"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Education Section */}
                <motion.section id="education" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-40px" }} variants={staggerContainer}>
                  <motion.div variants={itemUp} className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                    <h2 className="text-xl sm:text-3xl font-black uppercase text-white font-[family-name:var(--font-syne)] tracking-tight">
                      Education
                    </h2>
                    <span className="flex-1 h-px bg-gradient-to-r from-[#43346b]/60 via-[#352a54]/30 to-transparent"></span>
                  </motion.div>

                  <motion.div variants={itemUp} className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#1e1930]/40 border border-[#9893ad]/15 hover:border-[#d4cee2]/40 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_8px_30px_rgba(19,17,30,0.5)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-[#c4b5fd] font-mono text-[11px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2">
                        <GraduationCap size={15} />
                        {portfolioData.education.duration}
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white font-[family-name:var(--font-syne)] uppercase tracking-tight">
                        {portfolioData.education.degree}
                      </h3>
                      <p className="text-[#9893ad] text-xs sm:text-sm mt-1 font-light">
                        {portfolioData.education.institution} — {portfolioData.education.location}
                      </p>
                    </div>

                    <div className="sm:self-center shrink-0">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-[#352a54]/40 border border-[#9893ad]/30 text-[#d4cee2] text-xs sm:text-sm font-mono font-bold shadow-[0_0_20px_rgba(67,52,107,0.25)]">
                        <span>CGPA:</span>
                        <span className="text-white text-sm sm:text-base">{portfolioData.education.cgpa}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.section>

                {/* Achievements Section */}
                <motion.section id="achievements" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-40px" }} variants={staggerContainer}>
                  <motion.div variants={itemUp} className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                    <h2 className="text-xl sm:text-3xl font-black uppercase text-white font-[family-name:var(--font-syne)] tracking-tight">
                      Honors & Awards
                    </h2>
                    <span className="flex-1 h-px bg-gradient-to-r from-[#43346b]/60 via-[#352a54]/30 to-transparent"></span>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                    {portfolioData.achievements.map((ach, i) => (
                      <motion.div 
                        key={i} 
                        variants={itemUp} 
                        className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1e1930]/40 border border-[#9893ad]/15 hover:border-[#d4cee2]/40 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_8px_30px_rgba(19,17,30,0.5)]"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-amber-300 mb-2 sm:mb-3">
                            <Award size={16} />
                            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider font-semibold">{ach.event}</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white font-[family-name:var(--font-syne)] uppercase tracking-tight mb-1.5 sm:mb-2">
                            {ach.title}
                          </h3>
                          <p className="text-[#9893ad] text-xs sm:text-sm font-light leading-relaxed">
                            {ach.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Skills Arsenal */}
                <motion.section id="skills" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-40px" }} variants={staggerContainer}>
                  <motion.div variants={itemUp} className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                    <h2 className="text-xl sm:text-3xl font-black uppercase text-white font-[family-name:var(--font-syne)] tracking-tight">
                      Technical Arsenal
                    </h2>
                    <span className="flex-1 h-px bg-gradient-to-r from-[#43346b]/60 via-[#352a54]/30 to-transparent"></span>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {portfolioData.skills.map((skillGroup, idx) => (
                      <motion.div
                        key={idx}
                        variants={itemUp}
                        className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1e1930]/40 border border-[#9893ad]/15 hover:border-[#d4cee2]/40 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_8px_30px_rgba(19,17,30,0.5)]"
                      >
                        <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#352a54]/40 border border-[#9893ad]/20 flex items-center justify-center">
                            {getCategoryIcon(skillGroup.category)}
                          </div>
                          <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#d4cee2] font-semibold">
                            {skillGroup.category}
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {skillGroup.items.map((skill, sIdx) => (
                            <motion.span
                              key={sIdx}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono bg-[#1e1930]/80 text-[#d4cee2] border border-[#9893ad]/20 hover:text-white hover:border-[#d4cee2]/50 hover:bg-[#352a54]/50 transition-all cursor-default"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </motion.div>
            )}

            {/* PAGE: PROJECTS & REVIEWS */}
            {activePage === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
                className="flex flex-col gap-24"
              >
                {/* Projects Showcase */}
                <motion.section id="projects" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-40px" }} variants={staggerContainer}>
                  <motion.div variants={itemUp} className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                    <h2 className="text-xl sm:text-3xl font-black uppercase text-white font-[family-name:var(--font-syne)] tracking-tight">
                      Selected Works ({portfolioData.projects.length})
                    </h2>
                    <span className="flex-1 h-px bg-gradient-to-r from-[#43346b]/60 via-[#352a54]/30 to-transparent"></span>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-8">
                    {portfolioData.projects.map((project) => (
                      <motion.div
                        key={project.id}
                        variants={itemUp}
                        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1e1930]/40 border border-[#9893ad]/15 hover:border-[#d4cee2]/50 backdrop-blur-2xl transition-all duration-500 shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_12px_40px_rgba(19,17,30,0.6)] hover:shadow-[0_0_40px_rgba(67,52,107,0.35)] flex flex-col"
                      >
                        {/* Media Viewport with Real Website Screenshot Hero */}
                        <div className="w-full h-44 sm:h-64 md:h-72 bg-[#13111e]/80 relative overflow-hidden">
                          {project.image ? (
                            <img 
                              src={project.image as string} 
                              alt={project.title} 
                              className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#9893ad] font-mono text-xs uppercase tracking-widest">
                              Case Study Preview
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#13111e] via-[#13111e]/50 to-transparent" />
                          
                          {/* Live/Status Badge */}
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-wider bg-[#13111e]/80 backdrop-blur-md text-[#d4cee2] border border-[#9893ad]/20 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c4b5fd]" />
                              {project.link !== "#" ? "Live Production" : "Engineered Solution"}
                            </span>
                          </div>

                          {project.link !== "#" && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono bg-[#352a54]/60 text-[#d4cee2] border border-[#9893ad]/30 backdrop-blur-xl hover:bg-[#43346b] hover:text-white transition-all shadow-[0_0_15px_rgba(67,52,107,0.3)]"
                            >
                              Live Site <ArrowUpRight size={12} className="sm:w-[13px] sm:h-[13px]" />
                            </a>
                          )}
                        </div>

                        {/* Content Container */}
                        <div className="p-4 sm:p-7 md:p-8 flex flex-col relative z-20 -mt-6 sm:-mt-8 bg-gradient-to-t from-[#13111e] via-[#13111e]/95 to-transparent">
                          <div className="flex items-start justify-between gap-4 mb-2 sm:mb-3">
                            <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-[#d4cee2] transition-colors flex items-center gap-2 font-[family-name:var(--font-syne)] uppercase tracking-tight">
                              {project.title}
                            </h3>
                          </div>

                          <p className="text-[#d4cee2]/80 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 font-light line-clamp-2 sm:line-clamp-none">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {project.tech.map((t, index) => (
                              <span 
                                key={index} 
                                className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#292242]/50 text-[#d4cee2] text-[10px] sm:text-xs font-mono rounded-lg sm:rounded-xl border border-[#9893ad]/20 backdrop-blur-sm"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Allies Say / Reviews Carousel */}
                <motion.section id="reviews" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-40px" }} variants={staggerContainer}>
                  <motion.div variants={itemUp} className="flex items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <h2 className="text-xl sm:text-3xl font-black uppercase text-white font-[family-name:var(--font-syne)] tracking-tight">
                        Allies & Feedback
                      </h2>
                      <span className="w-12 sm:w-16 h-px bg-[#43346b]/60 hidden sm:block"></span>
                    </div>

                    <button
                      onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                      className="text-[#d4cee2] text-[11px] sm:text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 hover:text-white transition-colors bg-[#1e1930]/60 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-[#9893ad]/25 backdrop-blur-md shadow-[0_0_15px_rgba(67,52,107,0.2)]"
                    >
                      {isReviewFormOpen ? "Close Form" : <><Plus size={13} /> Drop a Review</>}
                    </button>
                  </motion.div>

                  <div className="relative min-h-[340px] sm:min-h-[380px] w-full">
                    <AnimatePresence mode="wait">
                      {isReviewFormOpen ? (
                        <motion.form
                          key="review-form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: smoothEase } }}
                          exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                          className="bg-[#1e1930]/40 border border-[#9893ad]/15 p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col gap-3.5 sm:gap-4 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_12px_40px_rgba(19,17,30,0.6)]"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!supabase) {
                              alert("Review submitted! (Preview mode: configured when Supabase env is connected)");
                              setIsReviewFormOpen(false);
                              setReviewName(""); setReviewRole(""); setReviewText("");
                              return;
                            }
                            setIsSubmitting(true);
                            const { error } = await supabase
                              .from('reviews')
                              .insert([{ name: reviewName, role: reviewRole, text: reviewText }]);

                            setIsSubmitting(false);
                            if (!error) {
                              alert("Review submitted successfully! It will appear once approved.");
                              setIsReviewFormOpen(false);
                              setReviewName(""); setReviewRole(""); setReviewText("");
                            } else {
                              alert("Failed to submit review.");
                              console.error(error);
                            }
                          }}
                        >
                          <h3 className="text-base sm:text-lg font-bold text-white font-[family-name:var(--font-syne)] uppercase tracking-tight">Leave Feedback</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <input 
                              type="text" 
                              value={reviewName} 
                              onChange={e => setReviewName(e.target.value)} 
                              placeholder="Your Name" 
                              required 
                              className="bg-[#13111e]/60 border border-[#9893ad]/20 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-[#d4cee2] outline-none focus:border-[#d4cee2]/50 transition-colors text-xs sm:text-sm font-mono" 
                            />
                            <input 
                              type="text" 
                              value={reviewRole} 
                              onChange={e => setReviewRole(e.target.value)} 
                              placeholder="Your Role (e.g. Lead Engineer)" 
                              required 
                              className="bg-[#13111e]/60 border border-[#9893ad]/20 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-[#d4cee2] outline-none focus:border-[#d4cee2]/50 transition-colors text-xs sm:text-sm font-mono" 
                            />
                          </div>
                          <textarea 
                            value={reviewText} 
                            onChange={e => setReviewText(e.target.value)} 
                            placeholder="Share your experience working with Aashray..." 
                            required 
                            rows={4} 
                            className="bg-[#13111e]/60 border border-[#9893ad]/20 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-[#d4cee2] outline-none focus:border-[#d4cee2]/50 transition-colors resize-none text-xs sm:text-sm font-mono"
                          />
                          <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-gradient-to-r from-[#43346b] via-[#352a54] to-[#292242] hover:from-[#544280] hover:to-[#3e3063] text-white font-bold text-xs uppercase tracking-wider font-mono px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-[#9893ad]/30 transition-all self-end flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(67,52,107,0.3)]"
                          >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                          </button>
                        </motion.form>
                      ) : (
                        <motion.div
                          key="review-carousel"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: smoothEase } }}
                          exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                          className="bg-[#1e1930]/40 border border-[#9893ad]/15 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl flex items-center justify-center overflow-hidden relative backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_12px_40px_rgba(19,17,30,0.6)]"
                        >
                          <Quote className="absolute top-6 left-6 sm:top-8 sm:left-8 text-white/[0.03] w-20 h-20 sm:w-28 sm:h-28 pointer-events-none" />
                          <AnimatePresence mode="wait">
                            {liveReviews.length > 0 && (
                              <motion.div
                                key={currentReview}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.5, ease: smoothEase }}
                                className="w-full relative z-10"
                              >
                                <p className="text-base sm:text-lg md:text-xl text-[#d4cee2] leading-relaxed mb-6 sm:mb-8 font-light italic">
                                  &ldquo;{liveReviews[currentReview]?.text}&rdquo;
                                </p>
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#292242]/80 border border-[#9893ad]/30 flex items-center justify-center font-bold text-[#d4cee2] uppercase font-mono shadow-[0_0_15px_rgba(67,52,107,0.2)] text-xs sm:text-sm">
                                    {liveReviews[currentReview]?.name?.charAt(0) || "A"}
                                  </div>
                                  <div>
                                    <h4 className="text-white font-bold font-[family-name:var(--font-syne)] uppercase tracking-tight text-sm sm:text-base">
                                      {liveReviews[currentReview]?.name}
                                    </h4>
                                    <p className="text-[#9893ad] text-[11px] sm:text-xs font-mono">
                                      {liveReviews[currentReview]?.role}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}

          </AnimatePresence>

                          {/* Indicators */}
                          <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {liveReviews.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setCurrentReview(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${currentReview === i ? 'bg-[#d4cee2] w-6 shadow-[0_0_8px_rgba(212,206,226,0.8)]' : 'bg-[#9893ad]/30 w-1.5'}`}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

          </AnimatePresence>
                  </div>
                </motion.section>
              </motion.div>
            )}

            {/* PAGE: CONTACT */}
            {activePage === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
                className="flex flex-col gap-6 sm:gap-8 pt-2"
              >
                <motion.div initial="hidden" animate="show" variants={staggerContainer} className="text-center lg:text-left">
                  <motion.h2 variants={itemUp} className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 font-[family-name:var(--font-syne)] uppercase tracking-tight">
                    Let&apos;s Build Together.
                  </motion.h2>
                  <motion.p variants={itemUp} className="text-[#9893ad] text-xs sm:text-sm md:text-base max-w-lg font-light leading-relaxed">
                    Have an interesting project, collaboration opportunity, or just want to connect? Send a note or reach out directly.
                  </motion.p>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: smoothEase }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const name = (formData.get("name") as string) || "";
                    const email = (formData.get("email") as string) || "";
                    const message = (formData.get("message") as string) || "";
                    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
                    const body = encodeURIComponent(`Hi Aashray,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolioData.contactEmail)}&su=${subject}&body=${body}`;
                    window.open(gmailUrl, "_blank");
                  }}
                  className="bg-[#1e1930]/40 border border-[#9893ad]/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full flex flex-col gap-3.5 sm:gap-4 shadow-[inset_0_1px_1px_rgba(212,206,226,0.08),0_12px_40px_rgba(19,17,30,0.6)] relative overflow-hidden backdrop-blur-2xl"
                >
                  <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#43346b]/15 rounded-full blur-[80px] pointer-events-none" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 relative z-10">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-[#d4cee2]/80">Your Name</label>
                      <input 
                        name="name" 
                        type="text" 
                        required 
                        placeholder="Ada Lovelace" 
                        className="bg-[#13111e]/60 border border-[#9893ad]/20 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-[#d4cee2] outline-none focus:border-[#d4cee2]/50 transition-colors w-full text-xs sm:text-sm font-mono" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-[#d4cee2]/80">Your Email</label>
                      <input 
                        name="email" 
                        type="email" 
                        required 
                        placeholder="ada@example.com" 
                        className="bg-[#13111e]/60 border border-[#9893ad]/20 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-[#d4cee2] outline-none focus:border-[#d4cee2]/50 transition-colors w-full text-xs sm:text-sm font-mono" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 relative z-10">
                    <label className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-[#d4cee2]/80">Message</label>
                    <textarea 
                      name="message" 
                      required 
                      rows={3} 
                      placeholder="Tell me about your vision or idea..." 
                      className="bg-[#13111e]/60 border border-[#9893ad]/20 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-[#d4cee2] outline-none focus:border-[#d4cee2]/50 transition-colors w-full resize-none text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 bg-gradient-to-r from-[#43346b] via-[#352a54] to-[#292242] hover:from-[#544280] hover:to-[#3e3063] text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-[#9893ad]/30 transition-all w-full flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(67,52,107,0.35)] relative z-10 font-mono tracking-wider uppercase text-xs"
                  >
                    <Send size={14} className="sm:w-[15px] sm:h-[15px]" />
                    Send Transmission
                  </button>
                </motion.form>

                {/* 3D Morphing Icon Interactive Experience */}
                <motion.div variants={itemUp} className="w-full h-[180px] sm:h-[220px] mt-2">
                  <IglooStyleIcons />
                </motion.div>
              </motion.div>
            )}

            </>
            )}

          </AnimatePresence>

          {/* Footer */}
          <footer className="text-xs text-[#9893ad]/70 mt-auto border-t border-[#9893ad]/15 pt-8 font-mono text-center lg:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              Designed & Engineered by <span className="text-[#d4cee2] font-semibold">{portfolioData.name}</span>
            </p>
            <p className="text-[#9893ad]/50">
              Next.js · Three.js · Tailwind CSS
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}
