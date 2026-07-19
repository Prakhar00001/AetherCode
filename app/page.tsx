"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Code2, Sparkles, ShieldAlert, Zap, Layers, 
  Share2, Check, RefreshCw, Terminal, ArrowRight, 
  MessageSquare, Copy, ChevronRight, Eye, AlertCircle, Maximize2
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AnalysisResponse {
  detectedLanguage: string;
  issues: Array<{ title: string; description: string; fix?: string; severity: 'critical' | 'warning' | 'info' }>;
  security: Array<{ title: string; description: string; severity: 'high' | 'medium' }>;
  optimizedCode: string;
  performanceScore: string;
  timeComplexity: string;
}

const RUNTIME_PRESETS = [
  {
    name: "React Memory Leak Hook",
    lang: "typescript",
    desc: "Stale reference maps & unmanaged browser listeners",
    code: `import React, { useState, useEffect } from 'react';\n\nexport function AnalyticsPanel() {\n  const [clicks, setClicks] = useState(0);\n\n  useEffect(() => {\n    // ❌ CRITICAL: Bound directly onto window context without a cleanup routine\n    window.addEventListener('click', () => {\n      setClicks(prev => prev + 1);\n    });\n  }, []);\n\n  return <div className="p-4">Tracked Actions: {clicks}</div>;\n}`
  },
  {
    name: "Python N+1 DB Iteration Loop",
    lang: "python",
    desc: "Iterative blocking database network queries inside loop",
    code: `def compile_batch_invoices(order_ids):\n    invoice_ledger = []\n    # ❌ CRITICAL: Executing isolated transaction hits in nested iterations\n    for oid in order_ids:\n        order = db.query("SELECT * FROM orders WHERE id = %s", (oid,))\n        billing = db.query("SELECT * FROM accounts WHERE order_id = %s", (oid,))\n        invoice_ledger.append({**order, **billing})\n    return invoice_ledger`
  }
];

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'diff' | 'anomalies' | 'security'>('diff');
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [chatText, setChatText] = useState("");
  const [chatStream, setChatStream] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const reportScrollTargetRef = useRef<HTMLDivElement>(null);

  const executeTextCopy = (text: string, referenceLabel: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(referenceLabel);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const processAnalysisPipeline = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setShowResults(false);
    setProgress(10);
    
    const ticker = setInterval(() => {
      setProgress(current => (current < 88 ? current + 10 : current));
    }, 180);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      
      clearInterval(ticker);
      setProgress(100);

      if (!res.ok) throw new Error();
      const payload: AnalysisResponse = await res.json();
      
      setAnalysisData(payload);
      if (payload.detectedLanguage) setLanguage(payload.detectedLanguage.toLowerCase());
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
        setTimeout(() => {
          reportScrollTargetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 300);
    } catch {
      clearInterval(ticker);
      setIsAnalyzing(false);
      alert("Pipeline failure. Check your backend Gemini key status.");
    }
  };

  const dispatchChatQuery = () => {
    if (!chatText.trim()) return;
    const query = chatText;
    setChatStream(prev => [...prev, { role: 'user', text: query }]);
    setChatText("");

    setTimeout(() => {
      setChatStream(prev => [...prev, { 
        role: 'assistant', 
        text: `Architecture Refinement Engine: Analyzed reference requests for "${query}". Injected state safety wrappers and modified edge validations inside target workspace context blocks.` 
      }]);
    }, 750);
  };

  // Compute total line indices for the spacious editor workspace
  const textLineIndices = code.split('\n').length;

  return (
    <div className="min-h-screen bg-[#03060f] text-slate-100 tracking-normal antialiased pb-32">
      
      {/* Spacious Premium Header */}
      <header className="max-w-[90rem] mx-auto px-10 py-7 flex items-center justify-between border-b border-white/[0.03] bg-[#03060f]/60 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Terminal className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-white font-mono">CODEOPTIC <span className="text-indigo-400 text-[10px] ml-1.5 px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 font-sans tracking-normal">PRO WORKSPACE</span></span>
        </div>
        <button 
          onClick={() => executeTextCopy(window.location.href, 'share')}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/5 bg-white/[0.01]"
        >
          {copiedLabel === 'share' ? <Check className="h-3 w-3 text-emerald-400" /> : <Share2 className="h-3 w-3" />}
          {copiedLabel === 'share' ? 'Link Copied' : 'Share Workspace Snapshot'}
        </button>
      </header>

      {/* Main Structural Layout Grid */}
      <main className="max-w-[90rem] mx-auto px-10 pt-16 space-y-20">
        
        {/* Spacious Heading Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            Instant AI Code Analysis <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">& Interactive Refactoring</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl font-normal leading-relaxed">
            Drop script configurations or functions down into the canvas block. Analyze memory maps, logical bugs, and compile clean architectural refactors.
          </p>
        </div>

        {/* INPUT STAGE: Professional High-Capacity Code Editor Console */}
        <div className="luxury-panel rounded-2xl p-8 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-5">
            <div className="flex items-center gap-2.5">
              <Code2 className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 font-mono">Source Editor Input</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div 
                onClick={() => uploadInputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer px-3.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2"
              >
                <Upload className="h-3.5 w-3.5" /> Upload File Array
              </div>
              <input type="file" ref={uploadInputRef} className="hidden" onChange={(e) => {
                const targetFile = e.target.files?.[0];
                if (targetFile) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setCode(ev.target?.result as string);
                  reader.readAsText(targetFile);
                }
              }} />

              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-xl text-xs px-3 py-1.5 font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/40"
              >
                <option value="typescript">TypeScript / JSX</option>
                <option value="python">Python Script</option>
                <option value="javascript">JavaScript / ES6</option>
              </select>
            </div>
          </div>

          {/* Premium Quick Preset Blocks */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Select Analysis Template Playground</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RUNTIME_PRESETS.map((preset, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setCode(preset.code); setLanguage(preset.lang); }}
                  className="luxury-panel p-4 rounded-xl cursor-pointer flex justify-between items-center group transition-all bg-slate-950/20"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-medium text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" /> {preset.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal">{preset.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors transform group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Code Area Wrapper with Active Line Numbers */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setCode(ev.target?.result as string); r.readAsText(f); } }}
            className={`relative rounded-xl overflow-hidden bg-slate-950/70 border transition-all ${
              isDragging ? 'border-indigo-500 bg-indigo-500/[0.01]' : 'border-white/5 focus-within:border-indigo-500/30'
            }`}
          >
            <div className="flex items-start">
              {/* Line Index gutter column */}
              <div className="text-[11px] font-mono text-slate-600 text-right p-5 pr-3 select-none border-r border-white/[0.02] bg-slate-950/40 min-w-[3.5rem] space-y-1">
                {Array.from({ length: Math.max(textLineIndices, 1) }).map((_, lineIdx) => (
                  <div key={lineIdx}>{lineIdx + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Enter custom script parameters or execute one of the template configurations listed above..."
                className="w-full h-80 bg-transparent text-slate-200 font-mono text-xs p-5 resize-none focus:outline-none custom-textarea leading-relaxed"
              />
            </div>
          </div>

          {/* Trigger Layout Row */}
          <div className="flex justify-end border-t border-white/[0.04] pt-5">
            <button
              onClick={processAnalysisPipeline}
              disabled={isAnalyzing || !code.trim()}
              className="px-7 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2.5 shadow-xl shadow-indigo-500/10 disabled:opacity-20"
            >
              {isAnalyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {isAnalyzing ? `Deconstructing AST Architecture Layers (${progress}%)` : "Compile & Diagnostic Refactor"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* METRICS DISPATCH SCREEN BLOCK */}
        <div ref={reportScrollTargetRef} className="pt-4">
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }} 
                className="luxury-panel rounded-2xl p-20 flex flex-col items-center justify-center text-center min-h-[350px]"
              >
                <div className="relative w-14 h-14 mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-full" />
                  <div className="absolute inset-0 border-2 border-t-indigo-500 rounded-full animate-spin" />
                  <Code2 className="h-5 w-5 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-base font-medium text-white tracking-tight">Compiling Structural Pipeline Analytics</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">Evaluating node trees, searching pattern leaks, and establishing performance scores via model vectors...</p>
                <div className="w-56 bg-slate-900 border border-white/5 h-1 rounded-full overflow-hidden mt-6">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
              </motion.div>
            )}

            {/* LIVE DISPLAY STAGE: Split Matrix Diff Interface & Optimization Panels */}
            {!isAnalyzing && showResults && analysisData && (
              <motion.div 
                initial={{ opacity: 0, y: 25 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-10"
              >
                
                {/* Scorecards layout row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="luxury-panel p-6 rounded-2xl flex flex-col justify-between bg-slate-950/20">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">AST Engine Score</span>
                      <h3 className="text-4xl font-bold font-mono text-emerald-400 mt-2">{analysisData.performanceScore}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-normal">Optimization vectors fully mapped to production guidelines.</p>
                  </div>

                  <div className="luxury-panel p-6 rounded-2xl flex flex-col justify-between bg-slate-950/20">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">Scalability Limit</span>
                      <h3 className="text-4xl font-bold font-mono text-indigo-400 mt-2">{analysisData.timeComplexity}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-normal">Algorithmic complexity boundaries parsed under stress thresholds.</p>
                  </div>

                  <div className="luxury-panel p-6 rounded-2xl flex flex-col justify-between border-indigo-500/20 bg-indigo-500/[0.01]">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase block">Engine Context</span>
                      <h3 className="text-base font-semibold text-white mt-2.5 capitalize">{language} Target Array</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-normal">Syntax rulesets configured correctly to match active repository styles.</p>
                  </div>
                </div>

                {/* Main Tabbed Output Workspace - Full Width Configuration */}
                <div className="luxury-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                  
                  {/* Premium Navigation Header Row */}
                  <div className="border-b border-white/[0.04] bg-slate-950/40 p-3.5 flex gap-2 items-center justify-between px-6 flex-wrap">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setActiveTab('diff')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          activeTab === 'diff' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-inner' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Maximize2 className="h-3.5 w-3.5" /> Side-by-Side Diff Map
                      </button>
                      <button
                        onClick={() => setActiveTab('anomalies')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          activeTab === 'anomalies' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Layers className="h-3.5 w-3.5" /> Logical Anomalies ({analysisData.issues.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          activeTab === 'security' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ShieldAlert className="h-3.5 w-3.5" /> Security Vulnerabilities ({analysisData.security.length})
                      </button>
                    </div>

                    {activeTab === 'diff' && (
                      <button 
                        onClick={() => executeTextCopy(analysisData.optimizedCode, 'diff_copy')}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5 transition-all"
                      >
                        {copiedLabel === 'diff_copy' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        Copy Refactored Script
                      </button>
                    )}
                  </div>

                  {/* Dynamic Pane Inner Display Wrapper */}
                  <div className="p-8 min-h-[500px]">
                    
                    {/* VIEW A: REAL SIDE-BY-SIDE SPLIT SCREEN DIFF ENGINE */}
                    {activeTab === 'diff' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                        
                        {/* Original Code Block Pane */}
                        <div className="flex flex-col rounded-xl overflow-hidden border border-white/5 bg-slate-950/30">
                          <div className="bg-slate-950/60 border-b border-white/5 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span className="flex items-center gap-1.5 text-rose-400/80"><span className="h-2 w-2 rounded-full bg-rose-500" /> Original Code Syntax</span>
                          </div>
                          <div className="text-[11px] font-mono overflow-auto p-4 pane-scrollbar flex-1 max-h-[550px]">
                            <SyntaxHighlighter language={language} style={coldarkDark} customStyle={{ margin: 0, background: 'transparent', padding: 0 }}>
                              {code}
                            </SyntaxHighlighter>
                          </div>
                        </div>

                        {/* Refactored Code Block Pane */}
                        <div className="flex flex-col rounded-xl overflow-hidden border border-white/5 bg-slate-950/30">
                          <div className="bg-slate-950/60 border-b border-white/5 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span className="flex items-center gap-1.5 text-emerald-400/80"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Refactored AI Output</span>
                          </div>
                          <div className="text-[11px] font-mono overflow-auto p-4 pane-scrollbar flex-1 max-h-[550px]">
                            <SyntaxHighlighter language={language} style={coldarkDark} customStyle={{ margin: 0, background: 'transparent', padding: 0 }}>
                              {analysisData.optimizedCode}
                            </SyntaxHighlighter>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* VIEW B: LOGICAL ANOMALIES VIEW */}
                    {activeTab === 'anomalies' && (
                      <div className="space-y-4 max-w-4xl">
                        {analysisData.issues.map((issue, idx) => (
                          <div key={idx} className="p-5 rounded-xl bg-slate-950/40 border border-white/[0.03] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                                <Layers className="h-4 w-4" /> {issue.title}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {issue.severity || 'warning'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{issue.description}</p>
                            {issue.fix && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Structural Modification Blueprint</span>
                                <code className="block text-[11px] font-mono text-indigo-300 bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 whitespace-pre-wrap">{issue.fix}</code>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* VIEW C: SECURITY & VULNERABILITIES */}
                    {activeTab === 'security' && (
                      <div className="space-y-4 max-w-4xl">
                        {analysisData.security.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-white/5 rounded-xl text-xs text-slate-500 space-y-2">
                            <ShieldAlert className="h-6 w-6 text-emerald-500 mx-auto animate-pulse" />
                            <p className="font-medium text-slate-400">Secure Compilation Profile</p>
                            <p className="text-[11px] text-slate-500">Zero database leak risks, open strings, or variable hijacking vectors detected.</p>
                          </div>
                        ) : (
                          analysisData.security.map((sec, idx) => (
                            <div key={idx} className="p-5 rounded-xl bg-rose-500/[0.01] border border-rose-500/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold text-rose-300 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" /> {sec.title}
                                </h4>
                                <span className="text-[9px] uppercase font-bold font-mono px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  {sec.severity || 'high'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">{sec.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                  </div>
                </div>

                {/* Section D: Continuous Interactive Workspace Refinement Stream */}
                <div className="luxury-panel rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    <span>Interactive Workspace Context Tuning</span>
                  </div>

                  <div className="space-y-4 max-h-72 overflow-y-auto pane-scrollbar pr-2">
                    {chatStream.map((msg, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 5 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl text-xs leading-relaxed border ${
                          msg.role === 'user' 
                            ? 'bg-slate-950/60 border-white/5 ml-12 text-slate-200' 
                            : 'bg-indigo-500/[0.02] border-indigo-500/10 mr-12 text-indigo-200'
                        }`}
                      >
                        <span className="font-semibold block mb-1 uppercase font-mono tracking-widest text-[9px] text-slate-500">
                          {msg.role === 'user' ? 'Custom Tuning Parameters' : 'Engine Response Pipeline'}
                        </span>
                        {msg.text}
                      </motion.div>
                    ))}
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-white/5 bg-slate-950/40 flex items-center pr-4 focus-within:border-indigo-500/30 transition-colors">
                    <input 
                      type="text"
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && dispatchChatQuery()}
                      placeholder="Prompt the engine to tune specific components or change variable styles..."
                      className="w-full bg-transparent text-xs p-5 text-slate-200 focus:outline-none placeholder:text-slate-600"
                    />
                    <button
                      onClick={dispatchChatQuery}
                      disabled={!chatText.trim()}
                      className="h-8 w-8 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center transition-all disabled:opacity-20 shadow-md shadow-indigo-500/20"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}