"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Code2, Sparkles, ShieldAlert, 
  Zap, Layers, Share2, Check, RefreshCw, Terminal
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AnalysisResponse {
  detectedLanguage: string;
  issues: Array<{ title: string; description: string; fix?: string }>;
  security: Array<{ title: string; description: string }>;
  optimizedCode: string;
  performanceScore: string;
  timeComplexity: string;
}

const EXAMPLES = [
  {
    name: "React Memory Leak",
    lang: "typescript",
    code: `import React, { useState, useEffect } from 'react';\n\nexport function UserDashboard() {\n  const [data, setData] = useState(null);\n\n  useEffect(() => {\n    // ❌ BUG: Added but never removed\n    window.addEventListener('resize', () => {\n      console.log(window.innerWidth);\n    });\n  }, []);\n\n  return <div>Dashboard</div>;\n}`
  },
  {
    name: "Python N+1 Database Performance Loop",
    lang: "python",
    code: `def process_user_data(user_ids):\n    results = []\n    for user_id in user_ids:\n        # ❌ PERFORMANCE: Database hit inside iterative loop execution\n        user = db.query("SELECT * FROM users WHERE id = %s", (user_id,))\n        results.append(user)\n    return results`
  }
];

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'issues' | 'security' | 'optimized'>('issues');
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCodeChange = (val: string) => {
    setCode(val);
    if (val.includes('def ') || val.includes('import os')) {
      setLanguage('python');
    } else if (val.includes('import React') || val.includes('const ')) {
      setLanguage('typescript');
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handleCodeChange(text);
      if (file.name.endsWith('.py')) setLanguage('python');
      if (file.name.endsWith('.js') || file.name.endsWith('.jsx')) setLanguage('javascript');
      if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) setLanguage('typescript');
    };
    reader.readAsText(file);
  };

  const runAnalysis = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setShowResults(false);
    setProgress(15);
    
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 12 : prev));
    }, 200);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      clearInterval(progressTimer);
      setProgress(100);

      if (!response.ok) throw new Error('Analysis pipeline failed');
      
      const data: AnalysisResponse = await response.json();
      
      if (data.detectedLanguage) {
        setLanguage(data.detectedLanguage.toLowerCase());
      }
      
      setAnalysisData(data);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
        // Smooth scroll downwards instantly to the new report frame
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 300);

    } catch (err) {
      clearInterval(progressTimer);
      setIsAnalyzing(false);
      alert("Pipeline configuration error. Check environment variables.");
    }
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-indigo-500/30 pb-20">
      {/* Top Navbar */}
      <header className="border-b border-white/5 bg-[#060913]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <Terminal className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-white text-base">CODE<span className="text-indigo-400">OPTIC</span></span>
            <span className="ml-2 text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-full font-mono">Claude-Style UI</span>
          </div>
        </div>
        <button 
          onClick={() => { setCopied(true); navigator.clipboard.writeText(window.location.href); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors glass-panel px-3 py-1.5 rounded-lg"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          {copied ? "Link Copied!" : "Share Link"}
        </button>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        
        {/* UPPER BLOCK: Big Code Input Workspace */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-indigo-400" />
              <h2 className="font-medium text-sm text-slate-200">Drop code block or paste direct text</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-medium text-slate-400 hover:text-white cursor-pointer transition-colors flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/5"
              >
                <Upload className="h-3 w-3" /> Upload File
              </div>
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
              
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg text-xs px-2.5 py-1 font-mono text-indigo-300 focus:outline-none"
              >
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
          </div>

          {/* Quick presets row */}
          <div className="flex flex-wrap gap-2 mb-3">
            {EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleCodeChange(ex.code)}
                className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
              >
                ⚡ Try {ex.name}
              </button>
            ))}
          </div>

          {/* Interactive Text Box */}
          <div className="relative rounded-xl overflow-hidden bg-slate-950/80 border border-white/5 focus-within:border-indigo-500/40 transition-colors">
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Paste code logic here to instantly trigger metrics evaluation pipeline..."
              className="w-full h-80 bg-transparent text-slate-200 font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed"
            />
          </div>

          {/* Action Trigger Row */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing || !code.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-40"
            >
              {isAnalyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {isAnalyzing ? `Analyzing AST Architecture (${progress}%)` : "Analyze & Refactor Code"}
            </button>
          </div>
        </div>

        {/* LOWER BLOCK: Dynamic output streaming below the input */}
        <div ref={resultsRef} className="pt-2">
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }} 
                className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]"
              >
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-sm font-semibold text-white">Deconstructing Abstract Tokens</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Interfacing with Gemini API engine for syntax evaluations...</p>
              </motion.div>
            )}

            {!isAnalyzing && showResults && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-indigo-500/20"
              >
                {/* Clean Tab Interface row */}
                <div className="border-b border-white/5 bg-slate-950/40 p-2 flex gap-1 justify-between items-center px-4">
                  <div className="flex gap-1">
                    {(['issues', 'security', 'optimized'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          activeTab === tab ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab === 'issues' && `Anomalies (${analysisData?.issues.length || 0})`}
                        {tab === 'security' && `Security (${analysisData?.security.length || 0})`}
                        {tab === 'optimized' && 'Refactored Output'}
                      </button>
                    ))}
                  </div>
                  
                  {/* Small contextual performance tag */}
                  <div className="text-[11px] text-emerald-400 font-mono bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    AST Score: {analysisData?.performanceScore}
                  </div>
                </div>

                {/* Content Yield display framework */}
                <div className="p-6 space-y-4 max-h-[550px] overflow-y-auto">
                  {activeTab === 'issues' && analysisData?.issues.map((issue, i) => (
                    <div key={i} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex gap-3">
                      <Layers className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-amber-300">{issue.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{issue.description}</p>
                        {issue.fix && <code className="block mt-2 text-[10px] font-mono text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-500/10">{issue.fix}</code>}
                      </div>
                    </div>
                  ))}

                  {activeTab === 'security' && (
                    analysisData?.security.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400">
                        <ShieldAlert className="h-5 w-5 mx-auto text-emerald-400 mb-2"/>
                        Secure system architecture. Zero malicious pattern layouts discovered.
                      </div>
                    ) : (
                      analysisData?.security.map((sec, i) => (
                        <div key={i} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 flex gap-3">
                          <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-semibold text-rose-300">{sec.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1">{sec.description}</p>
                          </div>
                        </div>
                      ))
                    )
                  )}

                  {activeTab === 'optimized' && (
                    <div className="rounded-xl overflow-hidden border border-white/5 text-[11px]">
                      <SyntaxHighlighter language={language} style={coldarkDark} customStyle={{ margin: 0, padding: '1rem', background: '#03050a' }}>
                        {analysisData?.optimizedCode || ''}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>

                {/* Meta details footer */}
                <div className="bg-slate-950/40 border-t border-white/5 p-4 flex justify-between items-center text-xs text-slate-500 font-mono">
                  <div>Estimated Time Complexity: <span className="text-indigo-400 font-semibold">{analysisData?.timeComplexity}</span></div>
                  <div className="text-[10px] uppercase bg-slate-900 px-2 py-0.5 rounded border border-white/5 text-slate-400">{language} Engine</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}