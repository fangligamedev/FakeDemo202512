"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import {
    Sparkles, Cpu, Image as ImageIcon, FileText,
    CheckCircle2, Loader2, Code as CodeIcon, Activity,
    Layers, Box, Server, Search, Layout, Zap,
    TrendingUp, ShoppingBag, Twitter, X, Maximize2, MousePointer2
} from 'lucide-react';
import { DEMO_SCRIPT, DemoStep, AssetType } from '@/config/demo_script_v16';
import MarketingDashboard from './MarketingDashboard';

// --- Helper for Curves ---
function getCurvePath(x1: number, y1: number, x2: number, y2: number) {
    const dist = Math.abs(x2 - x1);
    const cp1x = x1 + dist * 0.5;
    const cp1y = y1;
    const cp2x = x2 - dist * 0.5;
    const cp2y = y2;
    return "M " + x1 + " " + y1 + " C " + cp1x + " " + cp1y + ", " + cp2x + " " + cp2y + ", " + x2 + " " + y2;
}

function SyntaxHighlight({ code }: { code: string }) {
    // Simple mock highlighter
    const keywords = ['public', 'class', 'void', 'float', 'if', 'else', 'return', 'new', 'using', 'namespace', 'UnityEngine'];
    const types = ['Vector3', 'Transform', 'GameObject', 'int', 'bool', 'string'];

    const parts = code.split(/(\s+|[{}();,.])/g);

    return (
        <span className="whitespace-pre-wrap">
            {parts.map((part, i) => {
                if (keywords.includes(part)) return <span key={i} className="text-pink-400">{part}</span>;
                if (types.includes(part)) return <span key={i} className="text-yellow-400">{part}</span>;
                if (part.startsWith('"') && part.endsWith('"')) return <span key={i} className="text-green-400">{part}</span>;
                if (part.startsWith('//')) return <span key={i} className="text-gray-500">{part}</span>;
                return <span key={i} className="text-gray-300">{part}</span>;
            })}
        </span>
    );
}

function VideoFrame({ url, thumb }: { url: string, thumb?: string }) {
    return (
        <div className="w-full h-full bg-black relative flex items-center justify-center group overflow-hidden rounded-xl border border-white/10">
            {/* Simulating Video Player UI */}
            <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity duration-1000" style={{ backgroundImage: "url(" + thumb + ")" }} >
                {/* Fake scanning lines */}
                <div className="w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:10px_10px] opacity-20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse">
                    <Sparkles className="w-8 h-8 text-blue-400 fill-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white tracking-widest uppercase">Generating Video</div>
                <div className="text-sm font-mono text-blue-400 w-64 h-2 bg-gray-800 rounded-full overflow-hidden relative">
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4.5, ease: "linear" }} className="h-full bg-blue-500" />
                </div>
            </div>

            {/* Player Controls */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent flex items-end px-6 py-4 gap-4">
                <div className="w-4 h-4 rounded bg-white" />
                <div className="flex-1 h-1 bg-gray-600 rounded-full"><div className="w-1/3 h-full bg-red-500" /></div>
                <div className="text-xs font-mono text-gray-400">00:04 / 00:15</div>
            </div>
        </div>
    )
}

// --- Types & Constants ---
const ZONES = { TREND: -3000, BUILDER: 0, MARKETING: 3000 };

// --- Components ---

function Cursor({ x, y, click }: { x: number, y: number, click: boolean }) {
    return (
        <motion.div
            className="absolute z-50 pointer-events-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            animate={{ x, y, scale: click ? 0.8 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <MousePointer2 className="w-8 h-8 fill-black" />
        </motion.div>
    );
}

function TrendRadar() {
    return (
        <div className="relative w-96 h-96 mx-auto mb-8">
            {/* Radar Grid */}
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.1)" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.1)" />

                {/* Data Polygon */}
                <motion.path
                    initial={{ d: "M50 50 L50 50 L50 50 L50 50 Z", opacity: 0 }}
                    animate={{ d: "M50 15 L85 40 L60 85 L20 60 Z", opacity: 0.8 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    fill="rgba(168, 85, 247, 0.4)"
                    stroke="#A855F7"
                    strokeWidth="2"
                />

                {/* Labels */}
                <text x="50" y="5" textAnchor="middle" fill="#A855F7" fontSize="4" fontWeight="bold">GENRE</text>
                <text x="95" y="50" textAnchor="middle" fill="#3B82F6" fontSize="4" fontWeight="bold">ART</text>
                <text x="50" y="98" textAnchor="middle" fill="#22C55E" fontSize="4" fontWeight="bold">TECH</text>
                <text x="5" y="50" textAnchor="middle" fill="#EF4444" fontSize="4" fontWeight="bold">SOCIAL</text>
            </svg>

            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div className="bg-black/80 backdrop-blur border border-purple-500 px-6 py-2 rounded-xl">
                    <div className="text-xs text-purple-300 font-mono">TOP TREND</div>
                    <div className="text-xl font-bold text-white">Cyberpunk RPG</div>
                </div>
            </motion.div>
        </div>
    )
}

// --- Frame Components ---

function IDEFrame({ children, filename }: { children: React.ReactNode, filename: string }) {
    return (
        <div className="flex flex-col w-full h-full bg-[#1E1E1E] text-gray-300 font-mono text-sm shadow-2xl">
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="ml-6 text-sm text-gray-400 font-sans">{filename} — VibeCoder</span>
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-56 bg-[#252526] flex flex-col border-r border-[#191919]">
                    <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Explorer</div>
                    {['src', 'assets', 'scripts', 'config'].map(f => (
                        <div key={f} className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:bg-[#2A2D2E] hover:text-white cursor-pointer">
                            <Layers size={14} /> <span>{f}</span>
                        </div>
                    ))}
                    <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-[#37373D] text-white">
                        <CodeIcon size={14} className="text-[#4FC1FF]" /> <span>{filename}</span>
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 bg-[#1E1E1E] p-0 relative overflow-auto">
                    {children}
                </div>
            </div>
            {/* Status Bar */}
            <div className="h-6 bg-[#007ACC] flex items-center px-4 text-xs text-white justify-between select-none">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Ready</span>
                    <span>Ln 12, Col 45</span>
                </div>
                <span>UTF-8</span>
            </div>
        </div>
    )
}

function DocFrame({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className="flex flex-col w-full h-full bg-white text-gray-900 overflow-hidden font-sans">
            {/* Nav Bar */}
            <div className="h-12 border-b flex items-center px-4 gap-4 bg-white/50 backdrop-blur sticky top-0 z-10">
                <div className="p-1 hover:bg-gray-100 rounded"><Layout size={16} /></div>
                <div className="text-sm text-gray-500">Workspace / Design / {title}</div>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-auto p-12 bg-white">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 group">
                        <div className="h-40 w-full bg-gradient-to-r from-pink-200 to-purple-200 rounded-xl mb-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <h1 className="text-4xl font-bold mb-4">{title}</h1>
                        <div className="flex gap-4 text-xs text-gray-400 mb-8">
                            <span className="bg-gray-100 px-2 py-1 rounded">Status: Draft</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Author: AI Agent</span>
                        </div>
                    </div>
                    <div className="prose prose-lg max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

function AssetPreviewModal({ asset, visible, onClose, isStreaming = false }: { asset: DemoStep['asset'], visible: boolean, onClose: () => void, isStreaming?: boolean }) {
    if (!asset || !visible) return null;

    // ... content fetching logic (Keep existing) ...
    const [content, setContent] = useState<string>("");
    const [displayContent, setDisplayContent] = useState<string>("");

    useEffect(() => {
        if (asset.type === 'code' || asset.type === 'markdown') {
            fetch(asset.url).then(res => res.text()).then(text => {
                setContent(text);
                if (!isStreaming) {
                    setDisplayContent(text);
                } else {
                    setDisplayContent("");
                    let i = 0;
                    const speed = 5;
                    const t = setInterval(() => {
                        setDisplayContent(text.slice(0, i));
                        i += speed;
                        if (i > text.length) clearInterval(t);
                    }, 5);
                    return () => clearInterval(t);
                }
            });
        }
    }, [asset, isStreaming]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-6xl h-[85vh] rounded-xl overflow-hidden shadow-2xl flex flex-col relative bg-[#1E1E1E]"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-[60] p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"><X size={16} /></button>

                {asset.type === 'image' && (
                    <div className="w-full h-full flex items-center justify-center bg-[url('/images/transparent-bg.png')] relative overflow-hidden">
                        {isStreaming && (
                            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center gap-4">
                                <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
                                <div className="text-blue-400 font-mono text-sm tracking-widest animate-pulse">GENERATING PIXEL ART...</div>
                                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="w-full h-full bg-blue-500/50" />
                                </div>
                            </div>
                        )}
                        <img src={asset.url} alt="Asset" className={`max-w-full max-h-full object-contain duration-1000 ${isStreaming ? 'opacity-0 blur-lg scale-95' : 'opacity-100 blur-0 scale-100'}`} />
                    </div>
                )}

                {asset.type === 'video' && (
                    <VideoFrame url={asset.url} thumb={asset.previewUrl} />
                )}

                {asset.type === 'dashboard' && (
                    <div className="w-full h-full border border-white/10 rounded-xl overflow-hidden">
                        <MarketingDashboard dataUrl={asset.url} />
                    </div>
                )}

                {asset.type === 'code' && (
                    <IDEFrame filename={asset.url.split('/').pop() || 'script.cs'}>
                        <div className="p-6 font-mono text-sm leading-relaxed">
                            {isStreaming ? (
                                <SyntaxHighlight code={displayContent} />
                            ) : (
                                <SyntaxHighlight code={content || displayContent} />
                            )}
                            {isStreaming && <span className="animate-pulse inline-block w-2 h-4 bg-white ml-1">|</span>}
                        </div>
                    </IDEFrame>
                )}

                {asset.type === 'markdown' && (
                    <DocFrame title={asset.url.includes('story') ? 'Narrative Arc' : 'Game Design Doc'}>
                        <pre className="font-sans whitespace-pre-wrap leading-relaxed">{displayContent}{isStreaming && <span className="animate-pulse">|</span>}</pre>
                    </DocFrame>
                )}
            </motion.div>
        </div>
    )
}

function TrendOverlay({ visible, onStart }: { visible: boolean, onStart: () => void }) {
    const [status, setStatus] = useState<'idle' | 'prompting' | 'analyzing' | 'done'>('idle');
    const [promptText, setPromptText] = useState("");

    const startFlow = () => {
        setStatus('prompting');
        const p = "Analyze current gaming trends for a new RPG project";
        let i = 0;
        const t = setInterval(() => {
            setPromptText(p.slice(0, i));
            i++;
            if (i > p.length + 5) {
                clearInterval(t);
                setStatus('analyzing');
                setTimeout(() => {
                    setStatus('done');
                    setTimeout(onStart, 2000);
                }, 3000);
            }
        }, 50);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-auto flex flex-col items-center justify-center z-20">
                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-12 rounded-3xl text-center max-w-4xl shadow-2xl w-full">

                        {/* Header */}
                        <div className="flex items-center justify-center gap-3 mb-8 opacity-50">
                            <TrendingUp size={20} /> <span>MARKET INTELLIGENCE AGENT</span>
                        </div>

                        {/* IDLE State */}
                        {status === 'idle' && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                <h1 className="text-5xl font-bold text-white mb-6">What should we build?</h1>
                                <button onClick={startFlow} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-xl font-bold transition-all shadow-lg hover:shadow-blue-500/50">
                                    Start Analysis
                                </button>
                            </motion.div>
                        )}

                        {/* PROMPTING State */}
                        {status === 'prompting' && (
                            <div className="flex flex-col items-center">
                                <div className="w-full max-w-2xl bg-[#1E1E1E] rounded-xl p-6 border border-white/20 flex items-center gap-4 text-2xl font-mono text-left">
                                    <span className="text-blue-500">$</span>
                                    <span>{promptText}<span className="inline-block w-3 h-6 bg-blue-500 ml-1 animate-pulse" /></span>
                                </div>
                                <div className="mt-4 text-gray-500">Inputting Research Parameters...</div>
                            </div>
                        )}

                        {/* ANALYZING / DONE State */}
                        {(status === 'analyzing' || status === 'done') && (
                            <div className="animate-in fade-in zoom-in duration-500">
                                <TrendRadar />
                                {status === 'analyzing' && <div className="text-purple-400 animate-pulse font-mono mt-8">Processing 4.2M Data Points...</div>}
                                {status === 'done' && <div className="text-green-400 font-bold mt-8 text-xl">TARGET IDENTIFIED: CYBERPUNK RPG</div>}
                            </div>
                        )}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function PromptOverlay({ onComplete, text }: { onComplete: () => void, text: string }) {
    const [val, setVal] = useState("");

    useEffect(() => {
        let i = 0;
        const t = setInterval(() => {
            setVal(text.slice(0, i));
            i++;
            if (i > text.length + 10) {
                clearInterval(t);
                setTimeout(onComplete, 1000);
            }
        }, 50);
        return () => clearInterval(t);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1E1E1E] border border-white/20 p-6 rounded-xl shadow-2xl max-w-lg w-full">
                <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs font-mono uppercase tracking-widest">
                    <Sparkles size={12} className="text-blue-400" /> AI Agent Input
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="text-xl font-light text-white font-mono break-words leading-relaxed">
                        {val}<span className="animate-pulse text-blue-500">_</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function BuilderSidebar({ steps, activeStep }: { steps: typeof DEMO_SCRIPT, activeStep: number }) {
    return (
        <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="absolute top-0 right-0 w-80 h-full bg-[#080808]/95 border-l border-white/10 backdrop-blur-xl z-30 flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center"><Cpu className="w-5 h-5 text-white" /></div>
                <div className="font-bold text-white">Builder Agent</div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {steps.filter(s => s.zone === 'builder').map((step, i) => {
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;
                    const statusClass = isDone ? 'bg-blue-600 border-blue-600' : isActive ? 'bg-black border-blue-500 animate-pulse' : 'bg-black border-white/10';

                    return (
                        <div key={step.id} className="relative pl-8 group transition-all duration-300" style={{ opacity: isDone || isActive ? 1 : 0.3 }}>
                            {i !== steps.filter(s => s.zone === 'builder').length - 1 && <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-white/5" />}
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${statusClass} `}>
                                {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <div className="text-sm font-bold text-gray-200">{step.title}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{step.description}</div>
                            {isActive && <div className="mt-2 text-[10px] text-blue-400 font-mono animate-pulse">&gt; Processing...</div>}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    )
}

// --- Main Component ---

export default function SpatialCanvas() {
    const camX = useMotionValue(-ZONES.TREND);

    const [zone, setZone] = useState<'trend' | 'builder' | 'marketing'>('trend');
    const [nodes, setNodes] = useState<any[]>([]);
    const [activeStep, setActiveStep] = useState(-1);

    // UI States
    const [previewAsset, setPreviewAsset] = useState<DemoStep['asset'] | undefined>(undefined);
    const [isStreaming, setIsStreaming] = useState(false);
    const [showGamePrompt, setShowGamePrompt] = useState(false); // New State

    // Cursor Sim
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [cursorClick, setCursorClick] = useState(false);

    // Updated Flow: Trend -> (Done) -> Builder Prompt -> (Done) -> Builder Sequence
    const handleTrendDone = () => {
        // Instead of directly builder, show prompt
        setShowGamePrompt(true);
    };

    const handleGamePromptDone = () => {
        setShowGamePrompt(false);
        setZone('builder');
        animate(camX, -ZONES.BUILDER, { duration: 2, ease: "easeInOut" });
        setTimeout(runBuilderSequence, 2000);
    }

    const runBuilderSequence = async () => {
        const builderSteps = DEMO_SCRIPT.filter(s => s.zone === 'builder' || s.zone === 'marketing');

        // Initial mouse pos
        setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

        for (let i = 0; i < builderSteps.length; i++) {
            const step = builderSteps[i];

            // Switch Zone if needed
            if (step.zone === 'marketing' && zone !== 'marketing') {
                setZone('marketing');
                animate(camX, -ZONES.MARKETING, { duration: 2, ease: "easeInOut" });
                await new Promise(r => setTimeout(r, 2000));
            }

            setActiveStep(i);

            // 1. Create Node
            const isMarketing = step.zone === 'marketing';
            const nx = (isMarketing ? ZONES.MARKETING : ZONES.BUILDER) + (i % 2 === 0 ? -200 : 200);
            const ny = (i * 80) - (isMarketing ? 0 : 300); // adjust y for marketing

            setNodes(prev => [...prev, { ...step, x: nx, y: ny }]);

            // 2. Simulate Mouse Move & Click if Asset exists
            if (step.uiAction === 'AUTO_PREVIEW' && step.asset) {
                // Wait for node to appear
                await new Promise(r => setTimeout(r, 500));

                // Move Cursor (Account for Global X offset in component logic, but here we set absolute screen pos roughly)
                // Actually screen pos needs to map to world pos.
                // Simplified: Just animate cursor to where the node IS on screen.
                // Node X is world X. Cam X is offset. Screen X = Node X + Cam X + ScreenCenter.
                // We'll approximate for visual effect or calculate correctly.

                const screenCenter = window.innerWidth / 2;
                const camOffset = camX.get(); // Get current camera offset
                const screenX = nx + camOffset + screenCenter;
                const screenY = ny + window.innerHeight / 2; // Since we centered y

                setCursorPos({ x: screenX + 128, y: screenY + 32 }); // Center of node (w=256, h=64 approx)

                await new Promise(r => setTimeout(r, 800)); // Travel time

                // Click
                setCursorClick(true);
                await new Promise(r => setTimeout(r, 200));
                setCursorClick(false);

                // Open Asset
                setPreviewAsset(step.asset);
                setIsStreaming(true);

                // Wait for generation animation (1.5s)
                await new Promise(r => setTimeout(r, 1500));

                // Show content
                setIsStreaming(false);

                // Wait remaining duration
                const remaining = Math.max(0, step.duration - 1500);
                await new Promise(r => setTimeout(r, remaining));
            }
            else if (step.uiAction === 'CODE_VIEW_OPEN' && step.asset) {
                // Legacy support same flow
                setPreviewAsset(step.asset);
                setIsStreaming(true);
            }

            // 3. Duration Wait (Reading time) - ONLY for non-auto-preview steps or if we didn't wait above
            if (step.uiAction !== 'AUTO_PREVIEW') {
                await new Promise(r => setTimeout(r, step.duration));
            }

            // 4. Close Preview
            if (step.uiAction === 'AUTO_PREVIEW' || step.uiAction === 'CODE_VIEW_OPEN') {
                setPreviewAsset(undefined);
                setIsStreaming(false);
            }
        }

        // Done -> Marketing
        setZone('marketing');
        animate(camX, -ZONES.MARKETING, { duration: 2, ease: "easeInOut" });
    };

    return (
        <div className="w-full h-screen bg-[#020202] text-white font-sans overflow-hidden relative user-select-none cursor-none">
            {/* Virtual Cursor */}
            <Cursor x={cursorPos.x} y={cursorPos.y} click={cursorClick} />

            {/* World Container */}
            <motion.div style={{ x: camX }} className="absolute left-1/2 top-1/2 w-full h-full pointer-events-none">
                <div className="absolute -top-[5000px] -left-[5000px] w-[10000px] h-[10000px] opacity-20 bg-[radial-gradient(circle,#333_1px,transparent_1px)] [background-size:40px_40px]" />

                {/* Zone Labels */}
                <div className="absolute top-[-400px] left-[-3100px] text-6xl font-bold text-white/5 uppercase">Trend Zone</div>
                <div className="absolute top-[-400px] left-[-200px] text-6xl font-bold text-white/5 uppercase">Builder Zone</div>
                <div className="absolute top-[-400px] left-[2800px] text-6xl font-bold text-white/5 uppercase">Marketing Zone</div>

                {/* Connections Layer (Under Nodes) */}
                <svg className="absolute top-[-5000px] left-[-5000px] w-[10000px] h-[10000px] pointer-events-none overflow-visible">
                    {nodes.map((node, i) => {
                        if (i === 0) return null;
                        const prev = nodes[i - 1];
                        return (
                            <motion.path
                                key={`line - ${i} `}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.5 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                d={getCurvePath(prev.x + 5000 + 128, prev.y + 5000 + 32, node.x + 5000 + 128, node.y + 5000 + 32)}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeDasharray="8 4"
                            />
                        )
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute w-64 bg-gray-900/90 border border-white/10 rounded-xl p-4 flex gap-4 items-center shadow-xl backdrop-blur pointer-events-auto cursor-pointer hover:border-blue-500/50 transition-colors"
                        style={{ left: node.x, top: node.y }}
                    >
                        <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                            {node.asset?.type === 'image' || node.asset?.type === 'dashboard' ? <ImageIcon size={18} /> :
                                node.asset?.type === 'code' ? <CodeIcon size={18} /> :
                                    node.asset?.type === 'video' ? <Zap size={18} /> :
                                        <FileText size={18} />}
                        </div>
                        <div>
                            <div className="text-sm font-bold">{node.title}</div>
                            {node.asset && <div className="text-[10px] text-blue-400 flex items-center gap-1"><Maximize2 size={8} /> Click to View</div>}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Overlays */}
            {zone === 'trend' && !showGamePrompt && <TrendOverlay visible={true} onStart={handleTrendDone} />}
            {showGamePrompt && <PromptOverlay text="Generate a Cyberpunk RPG based on these trends, focusing on neon aesthetics and netrunner mechanics." onComplete={handleGamePromptDone} />}
            {zone === 'builder' && <BuilderSidebar steps={DEMO_SCRIPT} activeStep={activeStep} />}

            {/* Asset Lightbox */}
            <AssetPreviewModal asset={previewAsset} visible={!!previewAsset} onClose={() => setPreviewAsset(undefined)} isStreaming={isStreaming} />
        </div>
    );
}
