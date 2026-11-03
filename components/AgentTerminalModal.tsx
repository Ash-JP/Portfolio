"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Sparkles, CornerDownLeft, ArrowUpRight } from "lucide-react";
import { portfolioData } from "@/lib/data";

type CommandLog = {
  command: string;
  output: React.ReactNode;
  isError?: boolean;
};

interface AgentTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentTerminalModal({ isOpen, onClose }: AgentTerminalModalProps) {
  const [input, setInput] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const initialLogs: CommandLog[] = [
    {
      command: "agent --init",
      output: (
        <div className="flex flex-col gap-1.5 text-slate-300">
          <div className="text-purple-300 font-bold flex items-center gap-2">
            <Sparkles size={14} className="text-purple-400" />
            AashrayOS Intelligence Agent v2.5 initialized.
          </div>
          <div className="text-purple-200/60 text-xs">
            Query technical capabilities, inspect verified production systems, or run diagnostic commands.
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Type <span className="text-purple-300 font-bold">help</span> or click any suggestion below to execute.
          </div>
        </div>
      )
    }
  ];

  const [logs, setLogs] = useState<CommandLog[]>(initialLogs);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let output: React.ReactNode = "";
    let isError = false;

    const parts = trimmed.split(" ");
    const baseCmd = parts[0].toLowerCase();

    switch (baseCmd) {
      case "help":
        output = (
          <div className="flex flex-col gap-1.5 text-xs font-mono text-slate-300">
            <div className="text-purple-300 font-bold mb-1">AVAILABLE AGENT COMMANDS:</div>
            <div className="grid grid-cols-[110px_1fr] gap-y-1.5 gap-x-2">
              <span className="text-purple-300 font-semibold">whoami</span>
              <span className="text-slate-400">Candidate background, bio & vision</span>

              <span className="text-purple-300 font-semibold">projects</span>
              <span className="text-slate-400">List all production deployments & live case studies</span>

              <span className="text-purple-300 font-semibold">skills</span>
              <span className="text-slate-400">Examine full technical arsenal by category</span>

              <span className="text-purple-300 font-semibold">experience</span>
              <span className="text-slate-400">Leadership roles (IEEE, ISTE, Alchemy)</span>

              <span className="text-purple-300 font-semibold">education</span>
              <span className="text-slate-400">University, degree & GPA verification</span>

              <span className="text-purple-300 font-semibold">resume</span>
              <span className="text-slate-400">View and download official PDF resume</span>

              <span className="text-purple-300 font-semibold">contact</span>
              <span className="text-slate-400">Email transmission endpoint & channels</span>

              <span className="text-purple-300 font-semibold">clear</span>
              <span className="text-slate-400">Clear terminal buffer</span>

              <span className="text-purple-300 font-semibold">exit</span>
              <span className="text-slate-400">Close terminal agent modal</span>
            </div>
          </div>
        );
        break;

      case "whoami":
        output = (
          <div className="flex flex-col gap-2 text-xs font-mono text-slate-300">
            <div className="text-purple-300 font-bold text-sm">{portfolioData.name}</div>
            <div className="text-purple-200/70">{portfolioData.titles.join(" • ")}</div>
            <p className="text-slate-300 leading-relaxed font-sans text-sm mt-1">
              {portfolioData.bio}
            </p>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="flex flex-col gap-3 text-xs font-mono">
            <div className="text-purple-300 font-bold">DEPLOYED PRODUCTION CASE STUDIES ({portfolioData.projects.length}):</div>
            <div className="flex flex-col gap-2">
              {portfolioData.projects.map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200 font-bold">{p.title}</span>
                    {p.link !== "#" && (
                      <a 
                        href={p.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                      >
                        Visit <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{p.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.tech.map((t, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="flex flex-col gap-2 text-xs font-mono">
            <div className="text-purple-300 font-bold">TECHNICAL ARSENAL:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {portfolioData.skills.map((s, i) => (
                <div key={i} className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-purple-200 font-bold text-[11px] mb-1">{s.category}</div>
                  <div className="text-slate-400">{s.items.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "experience":
        output = (
          <div className="flex flex-col gap-2.5 text-xs font-mono">
            <div className="text-purple-300 font-bold">ORGANIZATIONAL LEADERSHIP:</div>
            {portfolioData.experience.map((e) => (
              <div key={e.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-purple-200 font-bold">
                  <span>{e.role} · {e.company}</span>
                  <span className="text-slate-500 text-[10px]">{e.duration}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs mt-1">{e.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "education":
        output = (
          <div className="flex flex-col gap-1 text-xs font-mono text-slate-300">
            <div className="text-purple-300 font-bold">{portfolioData.education.degree}</div>
            <div className="text-slate-300">{portfolioData.education.institution} · {portfolioData.education.location}</div>
            <div className="text-slate-400">{portfolioData.education.duration}</div>
            <div className="text-purple-300 font-bold mt-1">Verified CGPA: {portfolioData.education.cgpa}</div>
          </div>
        );
        break;

      case "contact":
        output = (
          <div className="flex flex-col gap-1.5 text-xs font-mono text-slate-300">
            <div className="text-purple-300 font-bold">COMMUNICATION CHANNELS:</div>
            <div>Direct Email: <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolioData.contactEmail)}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">{portfolioData.contactEmail}</a></div>
            <div>LinkedIn: <a href={portfolioData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">aashray-j-pramod-contactme</a></div>
            <div>GitHub: <a href={portfolioData.socials.github} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">github.com</a></div>
          </div>
        );
        break;

      case "resume":
      case "cv":
        output = (
          <div className="flex flex-col gap-2 text-xs font-mono text-slate-300">
            <div className="text-purple-300 font-bold">OFFICIAL CURRICULUM VITAE:</div>
            <div>Download or inspect official PDF:</div>
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-purple-300 hover:text-white underline"
            >
              Open Resume (PDF) <ArrowUpRight size={13} />
            </a>
          </div>
        );
        break;

      case "clear":
        setLogs([]);
        setInput("");
        return;

      case "exit":
      case "quit":
        onClose();
        return;

      default:
        output = (
          <span className="text-rose-400 font-mono text-xs">
            Command not recognized: &quot;{baseCmd}&quot;. Type <span className="underline cursor-pointer text-purple-300" onClick={() => executeCommand("help")}>help</span> for commands.
          </span>
        );
        isError = true;
    }

    setLogs((prev) => [...prev, { command: trimmed, output, isError }]);
    setInput("");
  };

  const quickPrompts = ["whoami", "projects", "skills", "experience", "contact", "help", "clear"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full bg-[#181426]/95 border border-[#9893ad]/25 rounded-3xl shadow-[0_16px_70px_rgba(19,17,30,0.85),inset_0_1px_1px_rgba(212,206,226,0.15)] flex flex-col relative overflow-hidden backdrop-blur-2xl transition-all duration-300
              ${isMaximized ? "h-[92vh] max-w-6xl" : "h-[75vh] max-w-3xl"}
            `}
          >
            {/* Ambient Twilight Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#352a54]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#43346b]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Apple Window Header */}
            <div className="h-12 bg-[#1e1930]/60 border-b border-[#9893ad]/15 flex items-center px-4 justify-between select-none relative z-10 shrink-0 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClose} 
                  className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all border border-black/20" 
                  title="Close Terminal"
                />
                <button 
                  onClick={() => setIsMaximized(!isMaximized)} 
                  className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all border border-black/20" 
                  title="Toggle Size"
                />
                <button 
                  onClick={() => executeCommand("clear")} 
                  className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all border border-black/20" 
                  title="Clear Output"
                />
                <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <TerminalIcon size={13} className="text-purple-400" />
                  aashray@agent-cli: ~ (interactive mode)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  title={isMaximized ? "Restore" : "Maximize"}
                >
                  {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Terminal Logs Viewport */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 text-xs sm:text-sm font-mono relative z-10 scrollbar-thin scrollbar-thumb-white/10">
              {logs.map((log, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-semibold">
                    <span className="text-slate-500">guest@aashray:~$</span>
                    <span className="text-white">{log.command}</span>
                  </div>
                  <div className={log.isError ? "text-rose-400 pl-4 border-l border-rose-500/30" : "pl-4 border-l border-purple-500/40"}>
                    {log.output}
                  </div>
                </div>
              ))}

              {/* Live Input Line */}
              <div className="flex items-center gap-2 text-purple-300 font-semibold pt-2">
                <span className="text-slate-500 shrink-0">guest@aashray:~$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      executeCommand(input);
                    }
                  }}
                  placeholder="Type a command (or click suggestion below)..."
                  className="flex-1 bg-transparent outline-none text-white font-mono text-xs sm:text-sm caret-purple-400 placeholder:text-slate-600"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
                <button 
                  onClick={() => executeCommand(input)}
                  className="text-slate-400 hover:text-purple-300 transition-colors p-1"
                  title="Execute"
                >
                  <CornerDownLeft size={14} />
                </button>
              </div>
              <div ref={endRef} />
            </div>

            {/* Quick Suggestions Chips Bar */}
            <div className="px-4 py-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto relative z-10 scrollbar-none backdrop-blur-md">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300/70 shrink-0 mr-1 flex items-center gap-1">
                <Sparkles size={11} className="text-purple-400" /> Suggestions:
              </span>
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => executeCommand(p)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] hover:bg-purple-500/20 text-purple-200 hover:text-white border border-white/[0.08] hover:border-purple-400/40 transition-all shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
