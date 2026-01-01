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
    TrendingUp, BarChart3, Share2, Twitter, ShoppingBag
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

// --- Components ---

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

function DraggableNode({ id, icon, title, content, x, y, type = 'default' }: any) {
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

function Connection({ start, end, type = 'default' }: any) {
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
                                    <span className="text-[#6A9955]">// Auto-generated by Neural Engine v3.5</span><br />
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
                                    <div key={i} className="h-1 bg-gray-600 rounded mb-1" style={{ width: `${Math.random() * 100}%` }} />
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
                                <div className="text-blue-400">ℹ Starting Ren'Py 8.1.1 compiler...</div>
                                <div className="text-gray-400">  Parsing script.rpy...   [OK]</div>
                                <div className="text-gray-400">  Parsing screens.rpy...  [OK]</div>
                                <div className="text-gray-400">  Optimizing assets...    [OK]</div>
                                <div className="text-gray-400">  Building distribution...</div>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                                    className="text-yellow-500"
                                >
                                    ⚠ Warning: 'monika_glitch' asset not found, using placeholder.
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

function PreviewView({ visible }: { visible: boolean }) {
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
                        src="/assets/demo_v16/doki_dialogue.mp4"
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

function PromptInput({ onSend, visible }: { onSend: (text: string) => void, visible: boolean }) {
    const [text, setText] = useState("");
    useEffect(() => {
        if (visible) {
            const target = "Build a trending Doki-style game and market it.";
            let i = 0;
            const timer = setInterval(() => { setText(target.substring(0, i)); i++; if (i > target.length) clearInterval(timer); }, 50);
            return () => clearInterval(timer);
        }
    }, [visible]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[600px]">
                    <div className="bg-[#1C1C1E] border border-white/20 rounded-2xl shadow-2xl p-2 flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-white" /></div>
                        <input type="text" value={text} readOnly className="flex-1 bg-transparent text-lg text-white outline-none" placeholder="Describe your game idea..." />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ... imports
// Add Feedback state

export default function InfiniteCanvasOpt() {
    const [nodes, setNodes] = useState<any[]>([]);
    const [connections, setConnections] = useState<any[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [activeView, setActiveView] = useState<ViewType>('canvas');
    const [activeAgent, setActiveAgent] = useState<AgentType>('trend');
    const [cursor, setCursor] = useState({ x: -100, y: -100, click: false });
    const [showCursor, setShowCursor] = useState(false);

    // Feedback State
    const [feedbackText, setFeedbackText] = useState<string | null>(null);
    const [activeVideo, setActiveVideo] = useState<string>("/assets/demo_opt/V1.mp4");

    const initialSteps: AgentStep[] = [
        { id: 1, agent: 'trend', title: 'Market Scan', description: 'Analyzing Steam & Itch.io data...', status: 'pending' },
        { id: 2, agent: 'trend', title: 'Strategy Lock', description: 'Opportunity: "Match-3 Puzzle"', status: 'pending' },
        { id: 3, agent: 'builder', title: '原型生成 (V1)', description: '生成三消游戏核心玩法原型...', status: 'pending' },
        { id: 4, agent: 'builder', title: '视觉转向 (V2)', description: '反馈: "改为可爱女孩与水果主题"...', status: 'pending' },
        { id: 5, agent: 'builder', title: '本地化 (V3)', description: '反馈: "应用中国汉服风格"...', status: 'pending' },
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

    const runTrinityWorkflow = () => {
        let currentStep = 0;

        const executeStep = async () => {
            if (currentStep >= 9) { setShowCursor(false); return; }
            const stepConfig = initialSteps[currentStep];

            setActiveAgent(stepConfig.agent);
            setSteps(prev => prev.map((s, i) => i === currentStep ? { ...s, status: 'running' } : i < currentStep ? { ...s, status: 'done' } : s));

            const centerX = (window.innerWidth - 320) / 2;
            const centerY = window.innerHeight / 2;
            const stepId = currentStep + 1;

            // View Switch logic
            // V1 Preview (Step 3) -> Show Preview
            // V2 Preview (Step 4) -> Show Preview
            // V3 Preview (Step 5) -> Show Preview

            if (stepId === 3) setActiveVideo("/assets/demo_opt/V1.mp4");
            if (stepId === 4) setActiveVideo("/assets/demo_opt/V2.mp4");
            if (stepId === 5) setActiveVideo("/assets/demo_opt/V3.mp4");

            // Cursor Logic
            let targetX = centerX, targetY = centerY;
            if (stepId === 1) { targetX = centerX - 300; targetY = centerY - 250; }
            if (stepId === 2) { targetX = centerX; targetY = centerY - 150; }
            if (stepId === 3) { targetX = centerX - 250; targetY = centerY + 50; }
            if (stepId === 4) { targetX = centerX; targetY = centerY + 50; }
            if (stepId === 5) { targetX = window.innerWidth - 200; targetY = 40; }
            if (stepId === 6) { targetX = centerX + 350; targetY = centerY - 150; }
            if (stepId === 7) { targetX = centerX + 350; targetY = centerY + 50; }
            if (stepId === 8) { targetX = centerX; targetY = centerY + 250; }

            if (activeView === 'canvas') setCursor({ x: targetX + 100, y: targetY + 50, click: false });

            // Execution Delays & Feedback
            let interactionDelay = 0;

            if (stepId === 3) { // V1
                setTimeout(() => setActiveView('preview'), 1500);
                interactionDelay = 6000;
            }
            if (stepId === 4) { // V2
                await showFeedback("优化方向：改为可爱女孩角色 + 水果主题。");
                setTimeout(() => setActiveView('preview'), 500);
                interactionDelay = 6000;
            }
            if (stepId === 5) { // V3
                await showFeedback("本地化：应用中国汉服风格 & 中文界面。");
                setTimeout(() => setActiveView('preview'), 500);
                interactionDelay = 6000;
            }

            setTimeout(() => {
                if (activeView === 'canvas') {
                    setCursor(prev => ({ ...prev, click: true }));
                    setTimeout(() => setCursor(prev => ({ ...prev, click: false })), 200);
                }

                // Node Logic
                if (stepId === 1) setNodes(prev => [...prev, { id: 'trend', type: 'trend', x: centerX - 300, y: centerY - 250, icon: <TrendingUp />, title: 'Trend: Match-3', content: 'Growth: +150%' }]);
                if (stepId === 2) {
                    setNodes(prev => [...prev, { id: 'project', type: 'project', x: centerX, y: centerY - 150, icon: <Box />, title: 'Project: Candy', content: 'Strategy: Casual' }]);
                    setConnections(prev => [...prev, { from: 'trend', to: 'project', type: 'trend' }]);
                }

                // Builder Nodes (V1, V2, V3)
                if (stepId === 3) {
                    setNodes(prev => [...prev, { id: 'v1', type: 'default', x: centerX - 250, y: centerY + 50, icon: <ImageIcon />, title: 'V1 Prototype', content: 'Generating...' }]);
                    setConnections(prev => [...prev, { from: 'project', to: 'v1' }]);
                }
                if (stepId === 4) {
                    setNodes(prev => [...prev, { id: 'v2', type: 'default', x: centerX, y: centerY + 50, icon: <Sparkles />, title: 'V2 Updated', content: 'Girl & Fruit' }]); // Overlap/Replace
                    setConnections(prev => [...prev, { from: 'v1', to: 'v2' }]);
                }
                if (stepId === 5) {
                    setNodes(prev => [...prev, { id: 'v3', type: 'default', x: centerX, y: centerY + 150, icon: <Globe />, title: 'V3 Localized', content: 'Chinese Style' }]);
                    setConnections(prev => [...prev, { from: 'v2', to: 'v3' }]);
                }

                // Marketing
                if (stepId === 6) {
                    setActiveView('canvas'); // Return to canvas
                    setNodes(prev => [...prev, { id: 'steam', type: 'marketing', x: centerX + 350, y: centerY - 150, icon: <ShoppingBag />, title: 'Steam Page', content: 'Capsule Art' }]);
                    setConnections(prev => [...prev, { from: 'project', to: 'steam', type: 'marketing' }]);
                }
                if (stepId === 7) {
                    setNodes(prev => [...prev, { id: 'social', type: 'marketing', x: centerX + 350, y: centerY + 50, icon: <Twitter />, title: 'Viral Tweet', content: '#IndieDev' }]);
                    setConnections(prev => [...prev, { from: 'steam', to: 'social', type: 'marketing' }]);
                }
                if (stepId === 8) {
                    setNodes(prev => [...prev, { id: 'build', type: 'default', x: centerX, y: centerY + 300, icon: <CheckCircle2 />, title: 'Release', content: 'Ready' }]);
                    setConnections(prev => [...prev, { from: 'v3', to: 'build' }]);
                }

            }, 800 + interactionDelay);

            let delay = 3000 + interactionDelay;

            setTimeout(() => {
                setSteps(prev => prev.map((s, i) => i === currentStep ? { ...s, status: 'done' } : s));
                currentStep++;
                if (currentStep < 9) executeStep();
            }, delay);
        };

        executeStep();
    };

    // UI Render
    return (
        <div className="relative w-full h-screen bg-[#050505] overflow-hidden text-white font-sans">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Overlays */}
            {showCursor && activeView === 'canvas' && <VirtualCursor x={cursor.x} y={cursor.y} clickTrigger={cursor.click} />}
            <PromptInput visible={showPrompt} onSend={handlePromptSend} />
            <AgentSidebar steps={steps} open={isSidebarOpen} activeAgent={activeAgent} />
            <ViewTabs active={activeView} onChange={setActiveView} />

            <CodeEditorView visible={activeView === 'code'} />

            {/* Modified Preview View with Active Video */}
            <AnimatePresence>
                {activeView === 'preview' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-20 flex bg-black items-center justify-center overflow-hidden"
                    >
                        <video
                            src={activeVideo}
                            className="w-full h-full object-contain"
                            autoPlay
                            loop
                            controls
                        />
                        <div className="absolute top-8 left-8 bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-full flex gap-3 text-xs text-white">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Running: Optimizer</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feedback Overlay */}
            <AnimatePresence>
                {feedbackText && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute bottom-1/4 left-1/2 -translate-x-1/2 z-50">
                        <div className="bg-[#1C1C1E]/90 backdrop-blur border border-blue-500/30 rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[500px]">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0 animate-pulse"><Sparkles className="w-5 h-5 text-white" /></div>
                            <div className="text-xl font-mono text-white">
                                <span className="text-blue-400 mr-2">User Feedback:</span>
                                {feedbackText}
                                <span className="animate-pulse">_</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-8 left-8 flex gap-4 z-40">
                <button onClick={startOptimizer} className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-full text-sm font-bold shadow-lg hover:opacity-90 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Start Optimization Demo (开始演示)
                </button>
            </div>

            <div className={`relative w-full h-full transition-all duration-500 ${activeView === 'canvas' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                style={{ marginRight: isSidebarOpen ? '320px' : '0' }}>
                {connections.map((conn, i) => {
                    const s = nodes.find(n => n.id === conn.from);
                    const e = nodes.find(n => n.id === conn.to);
                    return <Connection key={i} start={s} end={e} type={conn.type} />;
                })}
                {nodes.map(node => (
                    <DraggableNode key={node.id} {...node} />
                ))}
            </div>
        </div>
    );
}
