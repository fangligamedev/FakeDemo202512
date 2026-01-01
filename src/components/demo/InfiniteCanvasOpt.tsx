"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import VirtualCursor from './VirtualCursor';
import {
    Sparkles, Cpu, Image as ImageIcon, Plus, MoreHorizontal,
    Upload, FileText, Settings, Play, CheckCircle2, X,
    Globe, Link as LinkIcon, Download, Send, Zap,
    Code as CodeIcon, Layers, Box, Coffee, Check,
    Eye, Terminal, FileJson, FileCode, MonitorPlay,
    Folder, Search, GitBranch, Bell, Menu, Layout,
    TrendingUp, BarChart3, Share2, Twitter, ShoppingBag, Loader2, User
} from 'lucide-react';

// --- Types ---
type ViewType = 'canvas' | 'code' | 'preview';
type AgentType = 'trend' | 'builder' | 'marketing';

type AgentStep = {
    id: number;
    title: string;
    description: string;
    agent: AgentType;
    status: 'pending' | 'running' | 'done';
};

type Node = {
    id: string;
    type: string;
    x: number;
    y: number;
    icon?: React.ReactNode;
    title?: string;
    content?: string;
};

type Connection = {
    from: string;
    to: string;
    type?: string;
};

// --- Components ---

function LoadingOverlay({ visible, state }: { visible: boolean, state: 'deploy' | 'load' }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center pointer-events-none"
                >
                    <div className="w-64">
                        <div className="flex justify-between text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">
                            <span>{state === 'deploy' ? 'Deploying to Staging...' : 'Loading Game Assets...'}</span>
                            <span>{state === 'deploy' ? '45%' : '90%'}</span>
                        </div>
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: state === 'deploy' ? "45%" : "100%" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="h-full bg-blue-500"
                            />
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin opacity-50" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function AgentSidebar({ steps, open, activeAgent }: { steps: AgentStep[], open: boolean, activeAgent: AgentType }) {
    // Theme Colors
    const themes = {
        trend: { bg: 'bg-purple-600', text: 'text-purple-400', shadow: 'shadow-purple-500/30' },
        builder: { bg: 'bg-blue-600', text: 'text-blue-400', shadow: 'shadow-blue-500/30' },
        marketing: { bg: 'bg-orange-600', text: 'text-orange-400', shadow: 'shadow-orange-500/30' },
    };
    const theme = themes[activeAgent];

    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: open ? 0 : 400, opacity: open ? 1 : 0 }}
            className="absolute top-0 right-0 w-80 h-full bg-[#0A0A0A] border-l border-white/10 backdrop-blur-xl z-30 p-6 overflow-y-auto"
        >
            {/* Dynamic Header */}
            <div className="flex items-center gap-3 mb-8 transition-all duration-500">
                <div className={`w-10 h-10 rounded-full ${theme.bg} flex items-center justify-center shadow-lg ${theme.shadow} transition-colors duration-500`}>
                    {activeAgent === 'trend' && <TrendingUp className="w-5 h-5 text-white" />}
                    {activeAgent === 'builder' && <Cpu className="w-5 h-5 text-white" />}
                    {activeAgent === 'marketing' && <Share2 className="w-5 h-5 text-white" />}
                </div>
                <div>
                    <h2 className="font-bold text-white text-lg capitalize">{activeAgent} Agent</h2>
                    <p className={`text-xs ${theme.text} font-mono uppercase tracking-wider`}>Active Process</p>
                </div>
            </div>

            <div className="space-y-4">
                {steps.map((step, i) => (
                    <div key={step.id} className={`relative pl-8 pb-4 border-l transition-colors duration-300
                        ${step.status === 'done' ? (step.agent === 'trend' ? 'border-purple-500' : step.agent === 'marketing' ? 'border-orange-500' : 'border-blue-500') : 'border-white/10'}`}>

                        <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ring-4 ring-[#0A0A0A] transition-colors duration-300
                            ${step.status === 'done' ? (step.agent === 'trend' ? 'bg-purple-500' : step.agent === 'marketing' ? 'bg-orange-500' : 'bg-blue-500') :
                                step.status === 'running' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-700'}`}
                        />
                        <div className={`transition-opacity duration-500 ${step.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                            <h3 className="text-sm font-bold text-gray-200">{step.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                            {step.status === 'running' && (
                                <div className="mt-2 text-xs font-mono text-yellow-500 flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Processing...
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

function DraggableNode({ id, icon, title, content, x, y, type = 'default' }: { id: string, icon: React.ReactNode, title: string, content: string, x: number, y: number, type?: string }) {
    // Node styling based on type
    const isTrend = type === 'trend';
    const isMarketing = type === 'marketing';
    const isProject = type === 'project';
    const isCode = type === 'code';

    return (
        <motion.div
            layoutId={id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                x, y,
                boxShadow: isTrend ? '0 0 30px rgba(147, 51, 234, 0.3)' :
                    isMarketing ? '0 0 30px rgba(249, 115, 22, 0.3)' :
                        isProject ? '0 0 30px rgba(59, 130, 246, 0.3)' : '0 10px 30px rgba(0,0,0,0.5)'
            }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
            className={`absolute w-64 rounded-xl p-4 border backdrop-blur-xl z-10
                ${isTrend ? 'bg-purple-900/40 border-purple-400 text-purple-50' :
                    isMarketing ? 'bg-orange-900/40 border-orange-400 text-orange-50' :
                        isProject ? 'bg-blue-900/40 border-blue-400 text-blue-50' :
                            isCode ? 'bg-gray-900/90 border-yellow-500/40 text-gray-200' :
                                'bg-gray-900/90 border-white/20 text-gray-200'}
            `}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-1.5 rounded-lg 
                    ${isTrend ? 'bg-purple-500/20 text-purple-400' :
                        isMarketing ? 'bg-orange-500/20 text-orange-400' :
                            isProject ? 'bg-blue-500/20 text-blue-400' :
                                isCode ? 'bg-yellow-500/10 text-yellow-400' :
                                    'bg-white/10 text-gray-400'}`}>
                    {icon}
                </div>
                <h3 className="font-semibold text-sm truncate">{title}</h3>
                {type === 'project' && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse">
                        HOT
                    </span>
                )}
            </div>
            {/* Custom Content for different nodes */}
            {isTrend && (
                <div className="mt-2 h-12 flex items-end gap-1 opacity-50">
                    <div className="w-1/5 bg-purple-400 h-[40%] rounded-t" />
                    <div className="w-1/5 bg-purple-400 h-[60%] rounded-t" />
                    <div className="w-1/5 bg-purple-400 h-[30%] rounded-t" />
                    <div className="w-1/5 bg-purple-400 h-[80%] rounded-t" />
                    <div className="w-1/5 bg-white h-[100%] rounded-t animate-pulse" />
                </div>
            )}
            <p className="text-xs text-gray-500 leading-relaxed font-mono mt-1">
                {content}
            </p>
            {/* Ports */}
            <div className="absolute -left-1.5 top-1/2 w-3 h-3 bg-[#0A0A0A] rounded-full border border-gray-500" />
            <div className="absolute -right-1.5 top-1/2 w-3 h-3 bg-[#0A0A0A] rounded-full border border-blue-500" />
        </motion.div>
    )
}

function Connection({ start, end, type = 'default' }: { start: { x: number, y: number }, end: { x: number, y: number }, type?: string }) {
    if (!start || !end) return null;
    const sx = start.x + 256;
    const sy = start.y + 60;
    const ex = end.x;
    const ey = end.y + 60;
    const midX = (sx + ex) / 2;

    const strokeColor = type === 'trend' ? '#9333EA' : type === 'marketing' ? '#F97316' : '#3B82F6';

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <path
                d={`M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ey}, ${ex} ${ey}`}
                stroke={strokeColor} strokeWidth="6" fill="none" opacity="0.1"
            />
            <path
                d={`M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ey}, ${ex} ${ey}`}
                stroke={strokeColor} strokeWidth="3" fill="none"
            />
            <path
                d={`M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ey}, ${ex} ${ey}`}
                stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="4 8"
                className="animate-[dash_1s_linear_infinite]"
                style={{ opacity: 0.6 }}
            />
            <style jsx>{` @keyframes dash { to { stroke-dashoffset: -12; } } `}</style>
        </svg>
    )
}

function ViewTabs({ active, onChange }: { active: ViewType, onChange: (v: ViewType) => void }) {
    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1 bg-[#111] border border-white/10 rounded-full p-1.5 z-50 shadow-2xl">
            <button onClick={() => onChange('canvas')} className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300 ${active === 'canvas' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                <Box className="w-3 h-3" /> Canvas
            </button>
            <button onClick={() => onChange('code')} className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300 ${active === 'code' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                <CodeIcon className="w-3 h-3" /> Code IDE
            </button>
            <button onClick={() => onChange('preview')} className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300 ${active === 'preview' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                <MonitorPlay className="w-3 h-3" /> Preview
            </button>
        </div>
    )
}

function CodeEditorView({ visible }: { visible: boolean }) {
    const [code, setCode] = useState("");

    // Detailed Complex Code (V8+ style)
    const fullCode = `
class GameManager(object):
    """
    Main controller for the Doki AVG Engine.
    Handles scene transitions, character states, and dialogue flow.
    """
    def __init__(self):
        self.state = "INIT"
        self.characters = {}
        self.history = []
        self._load_assets()

    def _load_assets(self):
        # Loading character sprites and backgrounds
        renpy.log("Loading assets from /game/images...")
        self.characters['monika'] = Character("Monika", color="#fff")
        self.bg_school = "school_day_bg"

    def start_game(self):
        self.state = "RUNNING"
        renpy.scene(self.bg_school)
        renpy.show("monika", at="center")
        
        # Branching Dialogue System
        choice = renpy.display_menu([
            ("Start Demo", "demo_start"),
            ("System Config", "config_menu")
        ])
        
        if choice == "demo_start":
            self.run_demo_sequence()

    def run_demo_sequence(self):
        # AI Generated Sequence
        m = self.characters['monika']
        m("Welcome to the Neural Engine v2.0.")
        m("I am generating this logic in real-time.")
        
        # Async Asset Binding
        renpy.call_in_new_context("async_asset_loader")
        
        return True

# Initialize Global Instance
game_core = GameManager()
label start:
    $ game_core.start_game()
    return
`;

    useEffect(() => {
        if (visible) {
            let i = 0;
            setCode("");
            const timer = setInterval(() => {
                setCode(fullCode.substring(0, i));
                i += 8; // Faster typing for more code
                if (i > fullCode.length) clearInterval(timer);
            }, 10);
            return () => clearInterval(timer);
        }
    }, [visible]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-[#0D0D0D] z-20 flex"
                    style={{ marginRight: '320px', marginTop: '80px', borderRadius: '12px 0 0 0', fontFamily: 'Fira Code, monospace' }}
                >
                    {/* Activity Bar */}
                    <div className="w-12 border-r border-white/10 flex flex-col items-center py-4 gap-4 text-gray-500">
                        <FileText className="w-6 h-6 text-white" />
                        <Search className="w-6 h-6 hover:text-white" />
                        <GitBranch className="w-6 h-6 hover:text-white" />
                        <div className="flex-1" />
                        <Settings className="w-6 h-6 hover:text-white" />
                    </div>

                    {/* File Tree */}
                    <div className="w-60 border-r border-white/10 bg-[#111] flex flex-col">
                        <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                            <span>Explorer</span>
                            <MoreHorizontal className="w-4 h-4" />
                        </div>

                        {/* Project Root */}
                        <div className="px-2">
                            <div className="flex items-center gap-1 text-sm text-blue-400 font-bold mb-1">
                                <Layout className="w-3 h-3" /> DOKI_PROJECT
                            </div>

                            {/* Folders */}
                            <div className="pl-3 space-y-0.5">
                                {['.vscode', 'game', 'game/audio', 'game/images', 'game/gui', 'renpy'].map(folder => (
                                    <div key={folder} className="flex items-center gap-2 text-gray-400 hover:bg-white/5 p-1 rounded cursor-pointer text-xs">
                                        <Folder className="w-3 h-3 fill-gray-600" /> {folder}
                                    </div>
                                ))}

                                {/* Files */}
                                <div className="flex items-center gap-2 text-yellow-400 bg-white/5 p-1 rounded cursor-pointer text-xs">
                                    <FileCode className="w-3 h-3" /> script.rpy
                                </div>
                                <div className="flex items-center gap-2 text-purple-400 p-1 rounded cursor-pointer text-xs">
                                    <FileCode className="w-3 h-3" /> screens.rpy
                                </div>
                                <div className="flex items-center gap-2 text-purple-400 p-1 rounded cursor-pointer text-xs">
                                    <FileCode className="w-3 h-3" /> options.rpy
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Editor Area */}
                    <div className="flex-1 flex flex-col bg-[#1E1E1E] overflow-hidden">
                        {/* Tabs */}
                        <div className="flex bg-[#252526] border-b border-black">
                            <div className="px-3 py-2 text-xs text-yellow-400 bg-[#1E1E1E] border-t-2 border-yellow-500 flex items-center gap-2 min-w-[120px]">
                                <FileCode className="w-3 h-3" /> script.rpy
                                <X className="w-3 h-3 ml-auto opacity-50" />
                            </div>
                            <div className="px-3 py-2 text-xs text-gray-400 bg-[#2D2D2D] border-r border-black flex items-center gap-2 min-w-[120px]">
                                <FileCode className="w-3 h-3" /> options.rpy
                            </div>
                            <div className="px-3 py-2 text-xs text-gray-400 bg-[#2D2D2D] border-r border-black flex items-center gap-2 min-w-[120px]">
                                <FileCode className="w-3 h-3" /> screens.rpy
                            </div>
                        </div>

                        {/* Code + Minimap */}
                        <div className="flex-1 flex overflow-hidden relative">
                            {/* Lines */}
                            <div className="w-12 bg-[#1E1E1E] text-gray-600 text-right pr-3 pt-4 text-xs font-mono select-none">
                                {Array.from({ length: 40 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 font-mono text-sm overflow-hidden">
                                <pre className="text-gray-300 leading-6">
                                    <span className="text-[#C586C0]">import</span> renpy.store <span className="text-[#C586C0]">as</span> store<br />
                                    <span className="text-[#6A9955]">{`// Auto-generated by Neural Engine v3.5`}</span><br />
                                    {code}
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="inline-block w-2 h-4 bg-blue-500 align-middle ml-1"
                                    />
                                </pre>
                            </div>

                            {/* Minimap (Fake) */}
                            <div className="w-24 bg-[#1E1E1E] border-l border-white/5 p-2 opacity-50 select-none hidden md:block">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div key={i} className="h-1 bg-gray-600 rounded mb-1" style={{ width: `${(i * 37) % 60 + 20}%` }} />
                                ))}
                            </div>
                        </div>

                        {/* Terminal Panel */}
                        <div className="h-40 border-t border-white/10 bg-[#1E1E1E] font-mono text-xs text-gray-300 flex flex-col">
                            <div className="flex gap-4 px-4 py-1 bg-[#252526] text-gray-400 uppercase tracking-wider text-[10px]">
                                <span className="text-white border-b border-white">Terminal</span>
                                <span>Output</span>
                                <span>Debug Console</span>
                                <span>Problems</span>
                            </div>
                            <div className="p-4 overflow-y-auto space-y-1 font-mono">
                                <div className="text-green-500">➜  game-project git:(main) <span className="text-gray-300">renpy-build .</span></div>
                                <div className="text-blue-400">ℹ Starting Ren&apos;Py 8.1.1 compiler...</div>
                                <div className="text-gray-400">  Parsing script.rpy...   [OK]</div>
                                <div className="text-gray-400">  Parsing screens.rpy...  [OK]</div>
                                <div className="text-gray-400">  Optimizing assets...    [OK]</div>
                                <div className="text-gray-400">  Building distribution...</div>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                                    className="text-yellow-500"
                                >
                                    ⚠ Warning: &apos;monika_glitch&apos; asset not found, using placeholder.
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                                    className="text-green-500"
                                >
                                    ✔ Build finished successfully (842ms)
                                </motion.div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="h-6 bg-[#007ACC] text-white flex items-center px-3 text-[10px] gap-4">
                            <div className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> main</div>
                            <div className="flex items-center gap-1"><X className="w-3 h-3" /> 0</div>
                            <div className="flex items-center gap-1">⚠ 1</div>
                            <div className="flex-1" />
                            <div>Ln 42, Col 18</div>
                            <div>UTF-8</div>
                            <div>Python</div>
                            <div>RenPy</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function PreviewView({ visible, videoUrl }: { visible: boolean, videoUrl: string }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-20 flex bg-black items-center justify-center overflow-hidden"
                >
                    <video
                        src={videoUrl}
                        className="w-full h-full object-contain"
                        autoPlay
                        loop
                        controls
                    />

                    {/* Overlay Info */}
                    <div className="absolute top-8 left-8 bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-full flex gap-3 text-xs text-white">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Running: Release</span>
                        <span className="opacity-50">60 FPS</span>
                        <span className="opacity-50">1080p</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function PromptInput({ onSend, visible, externalText }: { onSend: (text: string) => void, visible: boolean, externalText?: string }) {
    const [text, setText] = useState("");
    useEffect(() => {
        if (visible) {
            const target = externalText || "Build a Match-3 game based on current Trend Radar strategies.";
            let i = 0;
            // Faster typing if external (it's a replay/sim)
            // Faster typing if external (it's a replay/sim) - Round 9: Slowed down for readability
            const speed = externalText ? 80 : 50;
            setText("");

            const timer = setInterval(() => {
                setText(target.substring(0, i));
                i++;
                if (i > target.length) {
                    clearInterval(timer);
                    if (externalText) {
                        // Auto-send after typing if it's an external simulation
                    }
                }
            }, speed);
            return () => clearInterval(timer);
        }
    }, [visible, externalText]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[800px]">
                    <div className="bg-[#1C1C1E] border border-white/20 rounded-2xl shadow-2xl p-2 flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-white" /></div>
                        <input type="text" value={text} readOnly className="flex-1 bg-transparent text-lg text-white outline-none" placeholder="Describe your game idea..." />
                        {!externalText && <button onClick={() => onSend(text)} className="p-2 bg-blue-600 rounded-lg"><Send className="w-4 h-4 text-white" /></button>}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ... imports
// Add Feedback state

// --- New V0.4 Round 2 Components ---

// 1. Asset Editor (Zoom & Chat & Loading)
function AssetEditor({ title, images, visible, onClose, simulateLoading = false, demoSequence = false }: { title: string, images: string[], visible: boolean, onClose: () => void, simulateLoading?: boolean, demoSequence?: boolean }) {
    const [zoomedImg, setZoomedImg] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(!simulateLoading);
    const [chatText, setChatText] = useState("");
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Explicitly use onClose to silence lint warning
    useEffect(() => {
        if (!visible) onClose();
    }, [visible, onClose]);

    // Initial Loading Simulation
    useEffect(() => {
        if (visible && simulateLoading) {
            requestAnimationFrame(() => setLoaded(false));
            const timer = setTimeout(() => setLoaded(true), 2500); // 2.5s simulated generation
            return () => clearTimeout(timer);
        }
    }, [visible, simulateLoading]);

    // Demo Auto-Sequence
    useEffect(() => {
        if (visible && demoSequence && loaded) {
            let mounted = true;
            const runSequence = async () => {
                await new Promise(r => setTimeout(r, 1000)); // Wait before acting
                if (!mounted) return;

                // 1. Auto Zoom First Image (Home)
                setZoomedImg(images[0]);
                await new Promise(r => setTimeout(r, 1500));

                // 2. Close Zoom
                if (mounted) setZoomedImg(null);
                await new Promise(r => setTimeout(r, 800));

                // 3. Zoom Second Image (Game)
                if (mounted) setZoomedImg(images[1]);
                await new Promise(r => setTimeout(r, 1000));

                // 4. Type "User Input"
                const targetText = "User: Generate other scenes (Shop, Victory)";
                for (let i = 0; i <= targetText.length; i++) {
                    if (!mounted) return;
                    setChatText(targetText.substring(0, i));
                    await new Promise(r => setTimeout(r, 80)); // Round 9: Slower typing
                }
                await new Promise(r => setTimeout(r, 800));

                // 5. Trigger Regenerate
                if (mounted) setIsRegenerating(true);
                await new Promise(r => setTimeout(r, 3000)); // Round 9: Longer loading

                // 6. Update Image (Show V1 Shop as "Other Scene")
                if (mounted) {
                    setZoomedImg('/assets/demo_opt/v1_shop_ui.jpg'); // V1 Shop
                    setIsRegenerating(false);
                }
                await new Promise(r => setTimeout(r, 1500));

                // 7. Close Zoom
                if (mounted) setZoomedImg(null);
                await new Promise(r => setTimeout(r, 500));

                // 8. Close Modal
                if (mounted) onClose();
            };

            runSequence();
            return () => { mounted = false; };
        }
    }, [visible, demoSequence, loaded, images, onClose]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md"
                >
                    {/* Main Grid Container */}
                    <div className={`transition-all duration-300 ${zoomedImg ? 'blur-sm scale-95 opacity-50 pointer-events-none' : 'opacity-100 scale-100'} bg-[#111] border border-white/10 rounded-2xl p-6 w-[900px] shadow-2xl relative`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg"><ImageIcon className="w-5 h-5 text-blue-400" /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{title}</h3>
                                    <p className="text-xs text-gray-500">AI Image Chat Editor {loaded ? '(Ready)' : '(Generating...)'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">Generative Fill</span>
                                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">V 4.0</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {!loaded ? (
                                // Skeleton Loading State
                                Array(4).fill(0).map((_, i) => (
                                    <motion.div
                                        key={`skeleton-${i}`}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shine" />
                                        <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-700 rounded w-1/2" />
                                        <div className="absolute center inset-0 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                // Loaded Images
                                images.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        layoutId={`img-${i}`}
                                        onClick={() => setZoomedImg(img)}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group border border-white/5 hover:border-blue-500/50 cursor-zoom-in transition-all"
                                    >
                                        <img src={img} alt={`Asset ${i}`} className="w-full h-full object-contain bg-black" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Search className="w-8 h-8 text-white drop-shadow-lg" />
                                        </div>
                                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white backdrop-blur">
                                            {i === 0 ? "Home" : i === 1 ? "Game" : i === 2 ? "Shop" : "Win"}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Zoom Overlay */}
                    <AnimatePresence>
                        {zoomedImg && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setZoomedImg(null)} // Close on background click
                                className="absolute inset-0 z-50 flex items-center justify-center p-10"
                            >
                                <motion.div
                                    className="relative max-w-[90vw] max-h-[90vh] bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden border border-white/10 flex flex-col"
                                    onClick={e => e.stopPropagation()} // Prevent close on content click
                                >
                                    <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
                                        <img src={zoomedImg} alt="Zoomed Asset" className="max-w-full max-h-[80vh] object-contain" />
                                    </div>
                                    {/* Simulated Chat Interface */}
                                    <div className="h-16 bg-[#222] border-t border-white/10 flex items-center px-4 gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white"><User className="w-4 h-4" /></div>
                                        <div className="flex-1 h-10 bg-[#111] rounded-full px-4 flex items-center text-white text-sm border border-white/5">
                                            {chatText || <span className="text-gray-500">Type feedback to regenerate region...</span>}
                                        </div>
                                        {isRegenerating ? (
                                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                        ) : (
                                            <button onClick={() => setZoomedImg(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// 2. Marketing Dashboard (Final Web Interface - Live)
function MarketingWebInterface({ visible }: { visible: boolean }) {
    const [stats, setStats] = useState({ score: 0, time: 0 });

    useEffect(() => {
        if (visible) {
            // Reset stats
            requestAnimationFrame(() => setStats({ score: 0, time: 0 }));

            // Animate Score to 98%
            const scoreInterval = setInterval(() => {
                setStats(prev => ({ ...prev, score: Math.min(prev.score + 2, 98) }));
            }, 30);

            // Animate Time to 3.2s
            const timeInterval = setInterval(() => {
                setStats(prev => ({ ...prev, time: Math.min(prev.time + 0.1, 3.2) }));
            }, 50);

            return () => { clearInterval(scoreInterval); clearInterval(timeInterval); };
        }
    }, [visible]);

    if (!visible) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute inset-0 z-40 bg-[#0f1115] flex flex-col font-sans"
        >
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center px-6 justify-between bg-[#161b22]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-white" /></div>
                    <span className="font-bold text-lg text-white">Marketing Agent</span>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full animate-pulse">Live Dashboard</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Campaign: Launch V1</span>
                    <div className="w-8 h-8 rounded-full bg-gray-700" />
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-y-auto">
                {/* Steam Capsule Preview */}
                <div className="col-span-8 bg-[#161b22] rounded-xl border border-white/5 p-6">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 flex items-center gap-2"><Layout className="w-4 h-4" /> Steam Store Capsule</h3>
                    <div className="aspect-[2/1] bg-black rounded-lg overflow-hidden relative group border border-white/5 hover:border-orange-500/50 transition-colors">
                        <img src="/assets/demo_opt/v3_home.png" alt="Steam Capsule" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6">
                            <h1 className="text-4xl font-bold text-white mb-2">DOKI MATCH LEGEND</h1>
                            <p className="text-gray-300 max-w-md">Embark on a localized puzzle adventure with classic mechanics and modern aesthetics.</p>
                            <div className="flex gap-2 mt-4">
                                <button className="px-4 py-2 bg-blue-600 rounded text-sm font-bold text-white">Pre-Order</button>
                                <button className="px-4 py-2 bg-white/10 rounded text-sm font-bold text-white">Wishlist</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Feed */}
                <div className="col-span-4 bg-[#161b22] rounded-xl border border-white/5 p-6 flex flex-col">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 flex items-center gap-2"><Twitter className="w-4 h-4" /> Viral Generation</h3>
                    <div className="flex-1 space-y-4">
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-[#0d1117] p-4 rounded-lg border border-white/5">
                            <div className="flex gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500" />
                                <div><div className="font-bold text-sm">IndieBot</div><div className="text-xs text-gray-500">Just now</div></div>
                            </div>
                            <p className="text-sm text-gray-300">Generated the entire game logic in 30 seconds! 🚀 #AI #GameDev #Indie</p>
                        </motion.div>
                        <div className="bg-[#0d1117] p-4 rounded-lg border border-white/5 opacity-50">
                            <div className="flex gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500" />
                                <div><div className="font-bold text-sm">ReviewerAI</div><div className="text-xs text-gray-500">2m ago</div></div>
                            </div>
                            <p className="text-sm text-gray-300">Visuals are stunning. The V3 update really nailed the local style.</p>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-orange-600/20 text-orange-400 font-bold rounded-lg mt-4 hover:bg-orange-600/30">Auto-Schedule All</button>
                </div>

                {/* Analytics */}
                <div className="col-span-12 h-40 bg-[#161b22] rounded-xl border border-white/5 p-6 flex items-center justify-between px-12">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white">{stats.score}%</div>
                        <div className="text-gray-500 text-sm uppercase mt-1">Optimization Score</div>
                    </div>
                    <div className="h-16 w-px bg-white/10" />
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400">{stats.time.toFixed(1)}s</div>
                        <div className="text-gray-500 text-sm uppercase mt-1">Build Time</div>
                    </div>
                    <div className="h-16 w-px bg-white/10" />
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-400">Ready</div>
                        <div className="text-gray-500 text-sm uppercase mt-1">Deployment Status</div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
}

function ActionPanel({ visible, onConfirm, onRegenerate }: { visible: boolean, onConfirm: () => void, onRegenerate: () => void }) {
    // const [typedText, setTypedText] = useState(""); // Removed in Round 7
    // Chat logic moved to PromptInput for consistency
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-2xl px-4"
                >
                    <div className="flex gap-4">
                        <button
                            onClick={onRegenerate}
                            className="px-6 py-3 bg-[#222] hover:bg-[#333] border border-white/10 rounded-full text-sm font-bold shadow-lg transition-all flex items-center gap-2 hover:scale-105"
                        >
                            <Layout className="w-4 h-4 text-gray-400" />
                            Regenerate (重新生成)
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 rounded-full text-sm font-bold shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2 hover:scale-105 animate-pulse"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Confirm & Build (确认并构建)
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function InfiniteCanvasOpt() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [activeView, setActiveView] = useState<ViewType>('canvas');
    const [activeAgent, setActiveAgent] = useState<AgentType>('trend');
    const [cursor, setCursor] = useState({ x: -100, y: -100, click: false });
    const [showCursor, setShowCursor] = useState(false);

    // Feedback State
    const [feedbackText, setFeedbackText] = useState<string | null>(null);
    const [activeVideo, setActiveVideo] = useState<string>("/assets/demo_opt/V1.mp4");

    // Round 4 States
    const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
    const [loadingState, setLoadingState] = useState<{ visible: boolean, state: 'deploy' | 'load' }>({ visible: false, state: 'deploy' });
    const [promptOverride, setPromptOverride] = useState<string | undefined>(undefined); // Restored for Round 7

    // V0.4 New States & Logic
    const [showAssetGrid, setShowAssetGrid] = useState(false);
    const [gridImages, setGridImages] = useState<string[]>([]);
    const [gridTitle, setGridTitle] = useState("");
    const [showActions, setShowActions] = useState(false);
    // const [chatState, setChatState] = useState<{ visible: boolean, text: string } | undefined>(undefined); // Removed in Round 7

    // Marketing & Dashboard State
    const [showMarketingWeb, setShowMarketingWeb] = useState(false);

    // Helper to wait for User Action
    const confirmResolverRef = useRef<(() => void) | null>(null);
    const waitForConfirm = () => new Promise<void>(resolve => { confirmResolverRef.current = resolve; });
    const handleConfirm = () => {
        if (confirmResolverRef.current) {
            confirmResolverRef.current();
            confirmResolverRef.current = null;
        }
    };

    const initialSteps: AgentStep[] = [
        { id: 1, agent: 'trend', title: 'Market Scan', description: 'Analyzing Steam & Itch.io data...', status: 'pending' },
        { id: 2, agent: 'trend', title: 'Strategy Lock', description: 'Opportunity: \"Match-3 Puzzle\"', status: 'pending' },
        { id: 3, agent: 'builder', title: '原型生成 (V1)', description: '生成三消游戏核心玩法原型...', status: 'pending' },
        { id: 4, agent: 'builder', title: '视觉转向 (V2)', description: '反馈: \"改为可爱女孩与水果主题\"...', status: 'pending' },
        { id: 5, agent: 'builder', title: '本地化 (V3)', description: '反馈: \"应用中国汉服风格\"...', status: 'pending' },
        { id: 6, agent: 'marketing', title: 'Steam Capsule', description: 'Designing store assets...', status: 'pending' },
        { id: 7, agent: 'marketing', title: 'Social Virality', description: 'Drafting launch tweets...', status: 'pending' },
        { id: 8, agent: 'builder', title: 'Final Build', description: 'Compiling release...', status: 'pending' },
        { id: 9, agent: 'marketing', title: 'Launch', description: 'Publishing to platforms...', status: 'pending' },
    ];
    const [steps, setSteps] = useState(initialSteps);

    const startOptimizer = () => {
        setNodes([]); setConnections([]); setSteps(initialSteps); setSidebarOpen(false); setActiveView('canvas'); setActiveAgent('trend');
        setShowPrompt(true);
        setTimeout(() => handlePromptSend(), 3500); // Auto-send prompt after 3.5s
    };

    const handlePromptSend = () => {
        setShowPrompt(false); setSidebarOpen(true); setShowCursor(true);
        setCursor({ x: window.innerWidth - 150, y: 100, click: false });
        setTimeout(() => runTrinityWorkflow(), 500);
    };

    const showFeedback = async (text: string) => {
        return new Promise<void>(resolve => {
            let i = 0;
            const t = setInterval(() => {
                setFeedbackText(text.slice(0, i));
                i++;
                if (i > text.length + 20) {
                    clearInterval(t);
                    setTimeout(() => {
                        setFeedbackText(null);
                        resolve();
                    }, 1000);
                }
            }, 50);
        });
    };

    const runTrinityWorkflow = async () => {
        const updateStep = (idx: number, status: 'running' | 'done') => {
            setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status } : i < idx ? { ...s, status: 'done' } : s));
        };
        const centerX = (window.innerWidth - 320) / 2;
        const centerY = window.innerHeight / 2;

        setViewport({ x: 0, y: 0, scale: 1 });

        // --- Step 1: Trend Radar ---
        updateStep(0, 'running');
        setActiveAgent('trend');

        // Show Trend Radar Web Node
        // TODO: Replace with actual Webview if needed, now placeholder
        setNodes([{ id: 'radar', type: 'trend', x: centerX - 400, y: centerY - 100, icon: <Layout />, title: 'Trend Radar', content: 'Scanning...' }]);
        await new Promise(r => setTimeout(r, 2000));

        // --- Step 2: Analysis ---
        updateStep(1, 'running');
        setNodes(prev => [...prev, { id: 'trend', type: 'trend', x: centerX - 100, y: centerY - 100, icon: <TrendingUp />, title: 'Market Analysis', content: 'Growth +150%' }]);
        setConnections(prev => [...prev, { from: 'radar', to: 'trend', type: 'trend' }]);
        await new Promise(r => setTimeout(r, 1500));


        // --- Core Loop Function with Node Separation ---
        // Offsets used to separate V1, V2, V3 iterations (Round 3: Wider Spacing)
        const nodeOffsets = [0, 450, 900]; // Increased spacing
        // Camera positions for each iteration
        const viewports = [
            { x: 0, y: 0, scale: 1 },
            { x: -600, y: 0, scale: 1 },
            { x: -1200, y: 0, scale: 1 }
        ];

        const executeIteration = async (version: number, stepIdx: number, feedback: string | null, images: string[], videoUrl: string, title: string, nodeContent: string) => {
            const offsetX = nodeOffsets[version - 1] || 0;
            const iterationBaseX = centerX + 150 + offsetX;

            // Pan Camera
            setViewport(viewports[version - 1] || { x: 0, y: 0, scale: 1 });

            if (feedback) {
                // Round 7: Use Central Prompt Input for User Feedback
                setPromptOverride(feedback);
                setShowPrompt(true);
                await new Promise(r => setTimeout(r, 3500)); // Type effect
                setShowPrompt(false);
                setPromptOverride(undefined);
            }

            // 1. Image Preview
            updateStep(stepIdx, 'running');
            setActiveAgent('builder');
            // Add Node: Prototyping
            setNodes(prev => [...prev, { id: `v${version}`, type: 'default', x: iterationBaseX, y: centerY, icon: <ImageIcon />, title: `V${version} Prototype`, content: nodeContent }]);

            // Connect to previous
            if (version === 1) setConnections(prev => [...prev, { from: 'trend', to: 'v1' }]);
            else setConnections(prev => [...prev, { from: `v${version - 1}play`, to: `v${version}` }]);

            setGridTitle(`V${version} Generated Assets`);
            setGridImages(images);
            setShowAssetGrid(true);
            setShowActions(true);

            // Wait for User Confirmation
            await waitForConfirm();

            // 2. Build Simulation
            setShowAssetGrid(false);
            setShowActions(false);
            setActiveView('code');
            await new Promise(r => setTimeout(r, 3000)); // Build for 3s

            // 3. Deployment & Agent Action (Distinct Nodes, No Feedback UI)
            setActiveView('canvas');

            // Deploy Node
            // NOTE: Removed "Deploying..." feedback text as per Round 3 feedback
            const deployNodeId = `v${version}deploy`;
            setNodes(prev => [...prev, { id: deployNodeId, type: 'default', x: iterationBaseX + 50, y: centerY + 140, icon: <Layers />, title: 'Deployer Agent', content: 'Staging Env' }]);
            setConnections(prev => [...prev, { from: `v${version}`, to: deployNodeId }]);
            await new Promise(r => setTimeout(r, 800));

            // Tester Agent Node
            const testNodeId = `v${version}test`;
            setNodes(prev => [...prev, { id: testNodeId, type: 'default', x: iterationBaseX + 100, y: centerY + 280, icon: <Zap />, title: 'Tester Agent', content: 'Verifying...' }]);
            setConnections(prev => [...prev, { from: deployNodeId, to: testNodeId }]);
            await new Promise(r => setTimeout(r, 1200));

            // Play Node (Success)
            const playNodeId = `v${version}play`;
            setNodes(prev => [...prev, { id: playNodeId, type: 'default', x: iterationBaseX + 150, y: centerY + 420, icon: <CheckCircle2 />, title: 'Ready to Play', content: 'Approved' }]);
            setConnections(prev => [...prev, { from: testNodeId, to: playNodeId }]);
            await new Promise(r => setTimeout(r, 500));


            // Round 4: Deployment/Loading Animation before Preview
            setLoadingState({ visible: true, state: 'deploy' });
            await new Promise(r => setTimeout(r, 2000));
            setLoadingState({ visible: true, state: 'load' });
            await new Promise(r => setTimeout(r, 2000));
            setLoadingState({ visible: false, state: 'deploy' });

            // 4. Video Playback
            setActiveView('preview');
            setActiveVideo(videoUrl);
            await new Promise(r => setTimeout(r, 8000)); // Watch video
            setActiveView('canvas');
        };

        // --- V1 Iteration (Casual) ---
        await executeIteration(1, 2, null,
            ['/assets/demo_opt/v1_home.jpg', '/assets/demo_opt/v1_gameplay.jpg', '/assets/demo_opt/v1_shop_ui.jpg', '/assets/demo_opt/v1_victory.jpg'],
            '/assets/demo_opt/V1.mp4', 'V1 Prototype', 'Generating...'
        );

        // --- V2 Iteration (Girl + Fruit) ---
        await executeIteration(2, 3, "优化方向：改为可爱女孩角色 + 水果主题。",
            ['/assets/demo_opt/v2_home.png', '/assets/demo_opt/v2_gameplay.png', '/assets/demo_opt/v2_shop.png', '/assets/demo_opt/v2_victory.png'],
            '/assets/demo_opt/V2.mp4', 'V2 Updated', 'Girl & Fruit'
        );

        // --- V3 Iteration (Chinese Style) ---
        await executeIteration(3, 4, "本地化：应用中国汉服风格 & 中文界面。",
            ['/assets/demo_opt/v3_home.png', '/assets/demo_opt/v3_gameplay.png', '/assets/demo_opt/v3_shop.png', '/assets/demo_opt/v3_victory.png'],
            '/assets/demo_opt/V3.mp4', 'V3 Localized', 'Chinese Style'
        );

        // --- Marketing Agent ---
        updateStep(5, 'running');
        setActiveAgent('marketing');

        // Pan Camera
        setViewport({ x: -1600, y: 0, scale: 1 });

        // Marketing Node
        const marketingX = centerX + 1500; // Far right
        setNodes(prev => [...prev, { id: 'marketing', type: 'marketing', x: marketingX, y: centerY + 100, icon: <ShoppingBag />, title: 'Marketing Strategy', content: 'Drafting...' }]);

        // Ensure V3 Play Node is ready before connecting
        // Round 8: Explicitly check for v3play existence (it should be there, but we force a state update order)
        await new Promise(r => setTimeout(r, 500));
        setConnections(prev => {
            // Avoid duplicates
            if (prev.find(c => c.from === 'v3play' && c.to === 'marketing')) return prev;
            return [...prev, { from: 'v3play', to: 'marketing', type: 'marketing' }];
        });

        await showFeedback("启动 Marketing Agent：起草营销策略...");
        await new Promise(r => setTimeout(r, 1000));

        // Round 6: Add Downstream Marketing Nodes (Steam & Social)
        const steamNodeId = 'market_steam';
        const socialNodeId = 'market_social';

        setNodes(prev => [...prev,
        { id: steamNodeId, type: 'default', x: marketingX + 200, y: centerY, icon: <Layout />, title: 'Steam Capsule', content: 'Generating Assets...' },
        { id: socialNodeId, type: 'default', x: marketingX + 200, y: centerY + 200, icon: <Twitter />, title: 'Social Campaign', content: 'Viral Posts...' }
        ]);
        setConnections(prev => {
            const newConns = [];
            if (!prev.find(c => c.from === 'marketing' && c.to === steamNodeId)) newConns.push({ from: 'marketing', to: steamNodeId, type: 'marketing' });
            if (!prev.find(c => c.from === 'marketing' && c.to === socialNodeId)) newConns.push({ from: 'marketing', to: socialNodeId, type: 'marketing' });
            return [...prev, ...newConns];
        });
        await new Promise(r => setTimeout(r, 1000));

        // Switch to Dashboard
        setShowMarketingWeb(true);

        // Done
        setSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
    };

    // UI Render
    return (
        <div className="relative w-full h-screen bg-[#050505] overflow-hidden text-white font-sans">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Overlays */}
            {showCursor && activeView === 'canvas' && <VirtualCursor x={cursor.x} y={cursor.y} clickTrigger={cursor.click} />}
            {showCursor && activeView === 'canvas' && <VirtualCursor x={cursor.x} y={cursor.y} clickTrigger={cursor.click} />}
            <PromptInput visible={showPrompt} onSend={handlePromptSend} externalText={promptOverride} />

            {/* Asset Editor with Auto-Sequence enabled */}
            <AssetEditor
                title={gridTitle}
                images={gridImages}
                visible={showAssetGrid}
                onClose={() => setShowAssetGrid(false)}
                simulateLoading={true}
                demoSequence={gridTitle.includes("V1")} // Only for V1
            />
            <MarketingWebInterface visible={showMarketingWeb} />
            <ActionPanel visible={showActions} onConfirm={handleConfirm} onRegenerate={() => { }} />

            <AgentSidebar steps={steps} open={isSidebarOpen} activeAgent={activeAgent} />
            <ViewTabs active={activeView} onChange={setActiveView} />
            <LoadingOverlay visible={loadingState.visible} state={loadingState.state} />

            <CodeEditorView visible={activeView === 'code'} />
            <PreviewView visible={activeView === 'preview'} videoUrl={activeVideo} />

            {/* Nodes Container with Camera Transform */}
            <motion.div
                className="absolute inset-0 z-0 origin-center"
                animate={{ x: viewport.x, y: viewport.y, scale: viewport.scale }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
                {connections.map((conn, i) => {
                    const fromNode = nodes.find(n => n.id === conn.from);
                    const toNode = nodes.find(n => n.id === conn.to);
                    // @ts-expect-error Connection generic type mismatch
                    return <Connection key={i} start={fromNode} end={toNode} type={conn.type} />;
                })}
                {nodes.map((node) => (
                    // @ts-expect-error Node generic type mismatch
                    <DraggableNode key={node.id} {...node} />
                ))}
            </motion.div>

            {/* AI Feedback Overlay */}
            <AnimatePresence>
                {feedbackText && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur border border-white/20 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-mono text-green-400">{feedbackText}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Start Overlay */}
            {!isSidebarOpen && !showPrompt && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/20">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                            Neural Game Engine <span className="text-purple-500">V0.4</span>
                        </h1>
                        <p className="text-gray-400 max-w-md mx-auto mb-8 text-lg">
                            The world&apos;s first agent-driven game development platform.
                            <br />Trends · Code · Assets · Marketing
                        </p>
                        <button
                            onClick={startOptimizer}
                            className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                        >
                            <Play className="w-5 h-5 fill-black" />
                            Start V0.4 Demo
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
