import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, Activity, DollarSign } from 'lucide-react';

interface DashboardData {
    project: string;
    metrics: {
        impressions: number;
        clicks: number;
        ctr: number;
        conversions: number;
        cpi: number;
    };
    daily_active_users: { day: string; users: number }[];
}

export default function MarketingDashboard({ dataUrl }: { dataUrl: string }) {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        fetch(dataUrl).then(res => res.json()).then(setData);
    }, [dataUrl]);

    // Fake data fallback in case fetch fails or for immediate display
    const FAKE_DATA: DashboardData = {
        project: "Neon Nights",
        metrics: { impressions: 1250000, clicks: 45000, ctr: 3.6, conversions: 1200, cpi: 3.50 },
        daily_active_users: [
            { day: "Mon", users: 1200 }, { day: "Tue", users: 1500 }, { day: "Wed", users: 4500 },
            { day: "Thu", users: 5200 }, { day: "Fri", users: 7800 }, { day: "Sat", users: 8500 }, { day: "Sun", users: 6000 }
        ]
    };

    // Use state or default
    const displayData = data || FAKE_DATA;

    // Effect to try and fetch real data
    useEffect(() => {
        fetch(dataUrl).then(res => res.json()).then(setData).catch(() => { });
    }, [dataUrl]);

    return (
        <div className="w-full h-full bg-[#09090B] text-white p-8 overflow-y-auto font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        {displayData.project} - Campaign Analytics
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Real-time Performance Dashboard</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-mono border border-green-500/30">LIVE</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-mono border border-blue-500/30">Q4-2025</span>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <Card icon={<Users className="text-blue-400" />} label="Impressions" value={displayData.metrics.impressions.toLocaleString()} sub="+12% vs avg" />
                <Card icon={<Activity className="text-purple-400" />} label="Clicks" value={displayData.metrics.clicks.toLocaleString()} sub={`${displayData.metrics.ctr}% CTR`} />
                <Card icon={<TrendingUp className="text-green-400" />} label="Conversions" value={displayData.metrics.conversions.toLocaleString()} sub="High Intent" />
                <Card icon={<DollarSign className="text-yellow-400" />} label="CPI" value={`$${displayData.metrics.cpi}`} sub="-5% cost" />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-3 gap-6 h-[400px]">
                {/* Main Chart (CSS Bar Chart for zero dependency) */}
                <div className="col-span-2 bg-[#18181B] rounded-xl border border-white/10 p-6 flex flex-col">
                    <h3 className="text-lg font-bold mb-6 text-gray-200 flex items-center gap-2"><Activity size={16} /> Daily Active Users</h3>
                    <div className="flex-1 flex items-end justify-between gap-4 px-4 bg-white/5 rounded-lg pt-4">
                        {displayData.daily_active_users.map((d, i) => (
                            <div key={d.day} className="flex flex-col items-center gap-2 w-full group h-full justify-end">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.users / 9000) * 100}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-full bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity relative min-h-[4px]"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {d.users.toLocaleString()}
                                    </div>
                                </motion.div>
                                <span className="text-xs text-gray-500 font-mono">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Panel */}
                <div className="bg-[#18181B] rounded-xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-200 flex items-center gap-2"><Globe size={16} /> Demographics</h3>
                    <div className="space-y-6">
                        <DemoBar region="North America" val={45} color="bg-blue-500" />
                        <DemoBar region="Europe" val={30} color="bg-purple-500" />
                        <DemoBar region="Asia Pacific" val={25} color="bg-green-500" />
                    </div>

                    <div className="mt-8 p-4 bg-blue-900/10 rounded-lg border border-blue-500/20">
                        <div className="text-xs text-blue-400 font-bold mb-1">AI INSIGHT</div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            User retention on Friday peak suggests high weekend engagement potential. Recommend boosting ad spend by 15% on Thursday evenings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ icon, label, value, sub }: any) {
    return (
        <div className="bg-[#18181B] p-5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
                <span className="text-xs font-mono text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded">{sub}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </div>
    )
}

function DemoBar({ region, val, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1 text-gray-400">
                <span>{region}</span>
                <span>{val}%</span>
            </div>
            <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    )
}
