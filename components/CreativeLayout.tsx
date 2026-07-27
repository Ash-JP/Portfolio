"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Terminal as TerminalIcon } from "lucide-react";
import { portfolioData } from "@/lib/data";

type CommandLog = {
  command: string;
  output: React.ReactNode;
  isError?: boolean;
};

export function CreativeLayout() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      command: "welcome",
      output: (
        <div className="text-emerald-400">
          Welcome to AashrayOS v1.0.0. Type 'help' to see available commands.
        </div>
      )
    }
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let output: React.ReactNode = "";
    let isError = false;

    const parts = trimmed.split(" ");
    const baseCmd = parts[0].toLowerCase();

    switch (baseCmd) {
      case "help":
        output = (
          <div className="flex flex-col gap-1 text-zinc-300">
            <div>Available commands:</div>
            <div className="grid grid-cols-[100px_1fr] gap-2 ml-4 mt-2">
              <span className="text-emerald-400">whoami</span><span>About me</span>
              <span className="text-emerald-400">ls</span><span>List projects</span>
              <span className="text-emerald-400">cat</span><span>Read a file (e.g. 'cat skills.json')</span>
              <span className="text-emerald-400">clear</span><span>Clear terminal</span>
              <span className="text-emerald-400">exit</span><span>Return to minimalist layout</span>
            </div>
          </div>
        );
        break;
      case "whoami":
        output = <div className="text-zinc-300">{portfolioData.bio}</div>;
        break;
      case "ls":
        output = (
          <div className="flex flex-col gap-1">
            {portfolioData.projects.map(p => (
              <div key={p.id} className="text-emerald-300">- {p.title}</div>
            ))}
            <div className="text-zinc-400 mt-2">skills.json</div>
          </div>
        );
        break;
      case "cat":
        if (parts[1] === "skills.json") {
          output = (
            <pre className="text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(portfolioData.skills, null, 2)}
            </pre>
          );
        } else {
          output = `cat: ${parts[1] || ''}: No such file or directory`;
          isError = true;
        }
        break;
      case "clear":
        setLogs([]);
        setInput("");
        return;
      case "exit":
        router.push("/");
        return;
      default:
        output = `Command not found: ${baseCmd}`;
        isError = true;
    }

    setLogs(prev => [...prev, { command: trimmed, output, isError }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 3D CRT Effect Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_100%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      
      <div className="w-full max-w-4xl h-[80vh] bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col relative z-10 overflow-hidden">
        {/* Terminal Header */}
        <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <div className="mx-auto text-xs text-zinc-500 flex items-center gap-2">
            <TerminalIcon size={14} /> aashray@backend-server
          </div>
          <button onClick={() => router.push("/")} className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors ml-auto flex items-center gap-1">
            <ArrowLeft size={12} /> Exit
          </button>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 text-sm md:text-base scrollbar-thin scrollbar-thumb-zinc-800">
          {logs.map((log, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">aashray@server:~$</span>
                <span className="text-zinc-100">{log.command}</span>
              </div>
              <div className={log.isError ? "text-red-400" : ""}>
                {log.output}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">aashray@server:~$</span>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCommand(input);
                }
              }}
              className="flex-1 bg-transparent outline-none text-zinc-100 caret-emerald-500"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
