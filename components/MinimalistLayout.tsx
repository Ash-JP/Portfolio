"use client";

import { motion, useMotionValue, useTransform, AnimatePresence, useSpring, useMotionTemplate } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowUpRight, MessageSquare, AtSign, Home, Send, Plus, Briefcase
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { IglooStyleIcons } from "@/components/ThreeDIcons";
import { ThreeDBackground } from "@/components/ThreeDBackground";

// Premium Apple-style Bezier Curve
const smoothEase = [0.16, 1, 0.3, 1];

// Shared Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemUp = {
  hidden: { opacity: 0, y: 30 },
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
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
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

// --- Left Expanding Dock ---
function FloatingNav({ activePage, setActivePage }: { activePage: string, setActivePage: (p: string) => void }) {
  const router = useRouter();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'projects', icon: Briefcase, label: 'Projects & Reviews' },
    { id: 'contact', icon: AtSign, label: 'Contact' },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 items-start">
        <button
          onClick={() => router.push("/")}
          className="group flex items-center justify-center w-12 h-12 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-full text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all shadow-lg mb-4"
          title="Back to Gate"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        </button>

        <div className="flex flex-col gap-3 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-3 rounded-3xl shadow-2xl">
          {navItems.map((item) => (
            <MagneticElement key={item.id}>
              <motion.button
                onClick={() => {
                  setActivePage(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative flex items-center h-12 rounded-2xl overflow-hidden transition-all duration-300 ease-out
                  ${activePage === item.id ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}
                `}
                initial={{ width: 48 }}
                whileHover={{ width: 180 }}
              >
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <item.icon size={20} />
                </div>
                <span className="font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 font-[family-name:var(--font-space-grotesk)]">
                  {item.label}
                </span>
              </motion.button>
            </MagneticElement>
          ))}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex lg:hidden items-center justify-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => router.push("/")}
          className="w-12 h-12 flex items-center justify-center rounded-full text-zinc-400 hover:text-emerald-400 transition-all shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-px h-8 bg-zinc-800 mx-1"></div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActivePage(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shrink-0
              ${activePage === item.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}
            `}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    </>
  );
}

// --- Matrix Background Component ---
function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const letters = '0123456789'.split('');
    const fontSize = 16;
    let columns = width / fontSize;
    let drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100;
    }

    const draw = () => {
      // Semi-transparent zinc-950 to create trail effect
      ctx.fillStyle = 'rgba(9, 9, 11, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Emerald color, slightly more visible
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 90);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      columns = width / fontSize;
      const newDrops = [];
      for (let x = 0; x < columns; x++) {
        newDrops[x] = drops[x] !== undefined ? drops[x] : Math.random() * -100;
      }
      drops = newDrops;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5] opacity-75"
    />
  );
}

// --- Main Layout ---
export function MinimalistLayout() {
  const [activePage, setActivePage] = useState("home");
  const [currentReview, setCurrentReview] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  // Supabase Reviews State
  const [liveReviews, setLiveReviews] = useState<any[]>(portfolioData.reviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!supabase) return; // Guard against missing env vars
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

  // Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.06), transparent 80%)`;

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
    <div className="bg-zinc-950 min-h-screen text-zinc-400 font-[family-name:var(--font-space-grotesk)] selection:bg-emerald-500/30 selection:text-emerald-200 relative">
      
      {/* Global Interactive Cursor Spotlight for Text */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{
          background: spotlightBackground,
          mixBlendMode: "screen",
        }}
      />

      {/* Matrix Background */}
      <MatrixBackground />

      {/* 3D Background Object (Replaces old Spotlight) */}
      <ThreeDBackground />

      <FloatingNav activePage={activePage} setActivePage={setActivePage} />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 pb-32 md:px-12 md:py-20 lg:px-24 lg:pl-32 lg:py-0 lg:pb-0 flex flex-col lg:flex-row gap-12 relative z-10">

        {/* Left Column (Sticky Profile) */}
        <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-5/12 lg:flex-col lg:py-24 text-center lg:text-left items-center lg:items-start">
          <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col items-center lg:items-start">
            {/* Optimal Profile Picture Location */}
            <motion.div variants={itemUp} className="mb-8 w-40 h-40 md:w-56 md:h-56 relative rounded-full overflow-hidden border-2 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex-shrink-0 group bg-emerald-950/30">
              <img 
                src="/profile.png" 
                alt={portfolioData.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            <motion.h1 variants={itemUp} className="text-4xl font-black tracking-tight text-zinc-100 sm:text-6xl font-[family-name:var(--font-syne)] uppercase">
              {portfolioData.name}
            </motion.h1>
            <motion.h2 variants={itemUp} className="mt-4 text-lg font-medium tracking-widest uppercase text-emerald-400 sm:text-xl font-[family-name:var(--font-space-grotesk)]">
              {portfolioData.titles.join(" • ")}
            </motion.h2>
            <motion.p variants={itemUp} className="mt-6 max-w-xs leading-relaxed text-zinc-400 text-lg font-light">
              I build pixel-perfect, engaging, and accessible digital experiences where design meets engineering.
            </motion.p>
          </motion.div>


        </header>


        {/* Right Column (Scrollable Dynamic Content) */}
        <main className="pt-12 lg:w-7/12 lg:py-24 flex flex-col pb-24">

          <AnimatePresence mode="wait">

            {/* PAGE: HOME */}
            {activePage === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: smoothEase }}
                className="flex flex-col gap-32"
              >
                {/* About Section */}
                <motion.section id="about" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-50px" }} variants={staggerContainer}>
                  <motion.h2 variants={itemUp} className="text-3xl md:text-5xl font-black uppercase text-zinc-100 mb-10 flex items-center gap-6 font-[family-name:var(--font-syne)] tracking-tight lg:hidden">
                    About
                    <span className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></span>
                  </motion.h2>
                  <div className="text-lg leading-relaxed text-zinc-400 flex flex-col gap-6 font-light">
                    <motion.p variants={itemUp}>
                      {portfolioData.bio}
                    </motion.p>
                  </div>
                </motion.section>

                {/* Experience Section */}
                <motion.section id="experience" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-50px" }} variants={staggerContainer}>
                  <motion.h2 variants={itemUp} className="text-3xl md:text-5xl font-black uppercase text-zinc-100 mb-12 flex items-center gap-6 font-[family-name:var(--font-syne)] tracking-tight">
                    Experience
                    <span className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></span>
                  </motion.h2>
                  <div className="flex flex-col gap-12">
                    {portfolioData.experience.map((exp) => (
                      <motion.div key={exp.id} variants={itemUp} className="group relative grid pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4 transition-all hover:!opacity-100">
                        <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:col-span-2">{exp.duration}</header>
                        <div className="z-10 sm:col-span-6">
                          <h3 className="font-medium leading-snug text-zinc-200">
                            <div className="inline-flex items-baseline font-bold leading-tight text-zinc-200 hover:text-emerald-400 group/link text-base">
                              <span>{exp.role} · {exp.company}</span>
                            </div>
                          </h3>
                          <p className="mt-2 text-sm leading-normal text-zinc-400 font-light">
                            {exp.description}
                          </p>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {exp.tech.map((tech, idx) => (
                              <li key={idx} className="flex items-center rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium leading-5 text-emerald-400 font-[family-name:var(--font-space-grotesk)]">
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Education Section */}
                <motion.section id="education" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-50px" }} variants={staggerContainer}>
                  <motion.h2 variants={itemUp} className="text-3xl md:text-5xl font-black uppercase text-zinc-100 mb-12 flex items-center gap-6 font-[family-name:var(--font-syne)] tracking-tight">
                    Education
                    <span className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></span>
                  </motion.h2>
                  <motion.div variants={itemUp} className="group relative grid pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4 transition-all hover:!opacity-100">
                    <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:col-span-2">{portfolioData.education.duration}</header>
                    <div className="z-10 sm:col-span-6">
                      <h3 className="font-medium leading-snug text-zinc-200">
                        <div className="inline-flex items-baseline font-bold leading-tight text-zinc-200 text-base">
                          <span>{portfolioData.education.degree}</span>
                        </div>
                      </h3>
                      <p className="mt-2 text-sm leading-normal text-zinc-400 font-light">
                        {portfolioData.education.institution} — {portfolioData.education.location}
                      </p>
                      <div className="mt-4 inline-flex items-center rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold leading-5 text-emerald-400 font-[family-name:var(--font-space-grotesk)]">
                        CGPA: {portfolioData.education.cgpa}
                      </div>
                    </div>
                  </motion.div>
                </motion.section>

                {/* Achievements Section */}
                <motion.section id="achievements" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-50px" }} variants={staggerContainer}>
                  <motion.h2 variants={itemUp} className="text-3xl md:text-5xl font-black uppercase text-zinc-100 mb-12 flex items-center gap-6 font-[family-name:var(--font-syne)] tracking-tight">
                    Achievements
                    <span className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></span>
                  </motion.h2>
                  <div className="flex flex-col gap-6">
                    {portfolioData.achievements.map((ach, i) => (
                      <motion.div key={i} variants={itemUp} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
                        <h3 className="font-bold text-zinc-200 font-[family-name:var(--font-space-grotesk)] text-lg mb-1">{ach.title}</h3>
                        <h4 className="text-emerald-400 text-sm font-bold mb-3">{ach.event}</h4>
                        <p className="text-zinc-400 text-sm font-light leading-relaxed">{ach.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Skills Section - Premium Compact Layout */}
                <motion.section id="skills" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-50px" }} variants={staggerContainer}>
                  <motion.h2 variants={itemUp} className="text-3xl md:text-5xl font-black uppercase text-zinc-100 mb-12 flex items-center gap-6 font-[family-name:var(--font-syne)] tracking-tight">
                    Arsenal
                    <span className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></span>
                  </motion.h2>
                  <motion.div variants={staggerContainer} className="flex flex-wrap gap-3 max-w-2xl">
                    {portfolioData.skills.flatMap(s => s.items).map((skill, i) => (
                      <motion.div
                        key={i}
                        variants={itemUp}
                        whileHover={{ y: -3, scale: 1.05 }}
                        className="relative group px-5 py-2.5 rounded-full bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-sm font-medium hover:text-white hover:border-emerald-500/50 transition-all cursor-default overflow-hidden font-[family-name:var(--font-space-grotesk)]"
                      >
                        {/* Hover Shimmer/Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                        <span className="relative z-10">{skill}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              </motion.div>
            )}

            {/* PAGE: PROJECTS */}
            {activePage === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: smoothEase }}
                className="flex flex-col gap-32"
              >
                {/* Bento Grid Projects */}
                <motion.section id="projects" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-50px" }} variants={staggerContainer}>
                  <motion.h2 variants={itemUp} className="text-3xl md:text-5xl font-black uppercase text-zinc-100 mb-12 flex items-center gap-6 font-[family-name:var(--font-syne)] tracking-tight">
                    Projects
                    <span className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></span>
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolioData.projects.map((project, i) => (
                      <motion.a
                        key={project.id}
                        href={project.link !== "#" ? project.link : undefined}
                        target={project.link !== "#" ? "_blank" : undefined}
                        rel={project.link !== "#" ? "noopener noreferrer" : undefined}
                        variants={itemUp}
                        className={`group relative rounded-3xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] flex flex-col ${project.colSpan} ${project.link !== "#" ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <div className="w-full h-48 sm:h-56 bg-zinc-800/30 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-800/50 transition-colors">
                          {(project.image) ? (
                            <img src={project.image as string} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 object-top" />
                          ) : (
                            <span className="text-zinc-600 font-mono text-xs tracking-widest uppercase relative z-0">Visual Representation</span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10" />
                        </div>
                        <div className="p-8 flex flex-col flex-1 relative z-20 -mt-12 bg-gradient-to-t from-zinc-900/90 via-zinc-900/90 to-transparent">
                          <h3 className="text-2xl font-black text-zinc-100 mb-3 group-hover:text-emerald-400 transition-colors flex items-center gap-2 font-[family-name:var(--font-syne)] uppercase tracking-tight">
                            {project.title}
                            {project.link !== "#" && (
                              <ArrowUpRight size={20} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                            )}
                          </h3>
                          <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1 font-light">
                            {project.description}
                          </p>
                          <ul className="flex flex-wrap gap-2">
                            {project.tech.map((t, index) => (
                              <li key={index} className="px-3 py-1 bg-emerald-950/30 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-900/50 font-[family-name:var(--font-space-grotesk)]">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.section>

                {/* Reviews Carousel & Form */}
                <motion.section id="reviews" initial="hidden" whileInView="show" viewport={{ once: false, margin: "-50px" }} variants={staggerContainer}>
                  <motion.div variants={itemUp} className="flex items-center gap-6 mb-12">
                    <motion.h2 className="text-3xl md:text-5xl font-black uppercase text-zinc-100 flex items-center gap-6 font-[family-name:var(--font-syne)] tracking-tight whitespace-nowrap">
                      Allies Say
                    </motion.h2>
                    <span className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent hidden md:block"></span>
                    <button
                      onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                      className="text-emerald-400 text-sm font-bold flex items-center gap-2 hover:text-emerald-300 transition-colors bg-emerald-950/30 px-4 py-2 rounded-full border border-emerald-900/50 whitespace-nowrap shrink-0"
                    >
                      {isReviewFormOpen ? "Close Form" : <><Plus size={16} /> Drop a Review</>}
                    </button>
                  </motion.div>
                  <div className="relative min-h-[420px] w-full">
                    <AnimatePresence mode="wait">
                      {isReviewFormOpen ? (
                        <motion.form
                          key="review-form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: smoothEase } }}
                          exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                          className="absolute inset-0 bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl flex flex-col gap-4"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!supabase) {
                              alert("Database connection is not configured. (Mocking success)");
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
                          <h3 className="text-xl font-bold text-zinc-200 mb-2 font-[family-name:var(--font-syne)] uppercase">Leave your feedback</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Your Name" required className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-emerald-500/50 transition-colors" />
                            <input type="text" value={reviewRole} onChange={e => setReviewRole(e.target.value)} placeholder="Your Role (e.g. Designer)" required className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-emerald-500/50 transition-colors" />
                          </div>
                          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write your review here..." required rows={4} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-emerald-500/50 transition-colors resize-none flex-1"></textarea>
                          <button type="submit" disabled={isSubmitting} className="bg-zinc-200 text-zinc-950 font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors self-end flex items-center gap-2 disabled:opacity-50">
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                          </button>
                        </motion.form>
                      ) : (
                        <motion.div
                          key="review-carousel"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: smoothEase } }}
                          exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                          className="absolute inset-0 bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 rounded-3xl flex items-center justify-center overflow-hidden"
                        >
                          <MessageSquare className="absolute top-8 left-8 text-zinc-800 w-16 h-16 opacity-30 pointer-events-none" />
                          <AnimatePresence mode="wait">
                            {liveReviews.length > 0 && (
                              <motion.div
                                key={currentReview}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5, ease: smoothEase }}
                                className="w-full relative z-10"
                              >
                                <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 font-light">
                                  &quot;{liveReviews[currentReview]?.text}&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 uppercase">
                                    {liveReviews[currentReview]?.name?.charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="text-zinc-100 font-bold font-[family-name:var(--font-syne)] uppercase">{liveReviews[currentReview]?.name}</h4>
                                    <p className="text-zinc-500 text-sm font-[family-name:var(--font-space-grotesk)]">{liveReviews[currentReview]?.role}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Carousel Indicators */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {liveReviews.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setCurrentReview(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-500 ease-out ${currentReview === i ? 'bg-emerald-400 w-6' : 'bg-zinc-700'}`}
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
                transition={{ duration: 0.6, ease: smoothEase }}
                className="flex flex-col gap-6 pt-0" /* Compacted gap to prevent scrolling */
              >
                <motion.div initial="hidden" animate="show" variants={staggerContainer} className="text-center mb-0">
                  <motion.h2 variants={itemUp} className="text-3xl md:text-5xl font-black text-zinc-200 mb-2 tracking-tight font-[family-name:var(--font-syne)] uppercase">
                    Let&apos;s Build Something.
                  </motion.h2>
                  <motion.p variants={itemUp} className="text-zinc-400 text-base max-w-md mx-auto font-light">
                    My inbox is always open. Fill out the form below or just shoot me an email directly!
                  </motion.p>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
                  action={`mailto:${portfolioData.contactEmail}`}
                  method="POST"
                  encType="text/plain"
                  className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl mx-auto flex flex-col gap-4 shadow-2xl relative overflow-hidden"
                >
                  {/* Subtle Glow */}
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-space-grotesk)]">Name</label>
                      <input name="name" type="text" required placeholder="John Doe" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-200 outline-none focus:border-emerald-500/50 transition-colors w-full text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-space-grotesk)]">Email</label>
                      <input name="email" type="email" required placeholder="john@example.com" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-200 outline-none focus:border-emerald-500/50 transition-colors w-full text-sm" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 relative z-10">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-space-grotesk)]">Message</label>
                    <textarea name="message" required rows={3} placeholder="What&apos;s on your mind?" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-200 outline-none focus:border-emerald-500/50 transition-colors w-full resize-none text-sm"></textarea>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 bg-emerald-500 text-emerald-950 font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors w-full flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] relative z-10 font-[family-name:var(--font-space-grotesk)] tracking-widest uppercase text-sm"
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                </motion.form>

                {/* 3D Morphing Icons tucked closely below the contact form to avoid scrolling */}
                <motion.div variants={itemUp} className="w-full max-w-2xl mx-auto h-[250px] mt-0">
                  <IglooStyleIcons />
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Footer */}
          <footer className="text-sm text-zinc-500 mt-auto border-t border-zinc-800/50 pt-8 font-[family-name:var(--font-space-grotesk)] text-center lg:text-left">
            <p>
              Designed in Figma and coded in VS Code by yours truly. Built with <b className="text-zinc-400">Next.js</b> and <b className="text-zinc-400">Tailwind CSS</b>, deployed with <b className="text-zinc-400">Vercel</b>.
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}
