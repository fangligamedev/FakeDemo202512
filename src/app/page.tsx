"use client";
import React from 'react';
import Navbar from "@/components/Navbar";
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Play, Star, Code, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* 1. Hero Section (Overhauled) */}
      <section className="relative pt-40 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-900/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="container-wide relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">v2.0 Now Available</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 max-w-5xl mx-auto"
          >
            Idea In. <span className="text-gradient-blue">Game Out.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-5xl mx-auto mb-12"
          >
            分钟级生成可变现互动内容。趋势 → 构建 → 推广，全链路 AI 操作系统。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link href="/dashboard" className="w-full md:w-auto">
              <button className="w-full md:w-auto px-10 py-5 bg-white text-black text-xl font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
                {t.hero.cta_primary} <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/spatial">
              <button className="px-10 py-5 glass-panel text-white text-xl font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
                <Play className="w-6 h-6 fill-current" /> Try Spatial V2
              </button>
            </Link>
            <Link href="/spatial_opt">
              <button className="px-10 py-5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                <Sparkles className="w-6 h-6" /> Try Optimization V3
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Waterfall Features (GDevelop Style) */}
      <section className="py-24 container-wide space-y-32" id="features">

        {/* Feature 1: Trend Radar */}
        <FeatureBlock
          badge="Step 1: Trend"
          title="Don't Guess. Know."
          desc="Our radar scans millions of interactions to find the next viral hit before it happens."
          image="/images/feature-trend.png" // Placeholder
          align="left"
          color="blue"
        >
          <div className="bg-gray-900 rounded-xl p-0 border border-white/10 h-[400px] relative overflow-hidden group">
            <img src="/images/trend_dashboard.png" alt="Trend Radar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </div>
        </FeatureBlock>

        {/* Feature 2: Build Engine */}
        <FeatureBlock
          badge="Step 2: Build"
          title="Visual Nodes. Instant Code."
          desc="Drag, drop, and connect. Our AI writes the C# and shader code while you focus on the flow."
          image="/images/feature-build.png" // Placeholder
          align="right"
          color="purple"
        >
          <div className="bg-[#0A0A0A] rounded-2xl p-8 border border-white/10 h-[400px] relative overflow-hidden flex flex-col justify-center gap-6">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

            {/* Animated Cards */}
            {[
              { icon: <Star className="w-5 h-5 text-purple-400" />, label: "Asset Generation", color: "bg-purple-500/10", delay: 0 },
              { icon: <Code className="w-5 h-5 text-blue-400" />, label: "Logic Synthesis", color: "bg-blue-500/10", delay: 0.2 },
              { icon: <Play className="w-5 h-5 text-green-400" />, label: "Instant Playable", color: "bg-green-500/10", delay: 0.4 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: item.delay, ease: "easeOut" }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default"
              >
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-200">{item.label}</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ x: '-100%' }}
                      whileInView={{ x: '100%' }}
                      transition={{ duration: 1.5, delay: item.delay + 0.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                      className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FeatureBlock>

        {/* Feature 3: Promote */}
        <FeatureBlock
          badge="Step 3: Promote"
          title="Viral by Design."
          desc="Automatic A/B testing for thumbnails and gameplay hooks. We scale what works."
          image="/images/feature-promote.png" // Placeholder
          align="left"
          color="green"
        >
          <div className="bg-[#0A0A0A] rounded-2xl p-8 border border-white/10 h-[400px] relative overflow-hidden flex items-end justify-between gap-6">
            {/* Ambient Background */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-[80px]" />

            {[35, 55, 25, 45, 90].map((height, i) => {
              const isWin = i === 4;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end h-full relative group">
                  {/* Floating Label for Winner */}
                  {isWin && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 backdrop-blur-md flex items-center gap-1 whitespace-nowrap"
                    >
                      <TrendingUp className="w-3 h-3" /> +240%
                    </motion.div>
                  )}

                  {/* Bar */}
                  <motion.div
                    initial={{ height: 4 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1, type: "spring", stiffness: 50 }}
                    viewport={{ once: true }}
                    className={`w-full rounded-t-lg relative ${isWin
                      ? 'bg-gradient-to-t from-green-600 to-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      : 'bg-white/5 border-t border-white/10 hover:bg-white/10 transition-colors'
                      }`}
                  >
                    {/* Inner Shine Effect for Winner */}
                    {isWin && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50" />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </FeatureBlock>

      </section>

      {/* 3. Showcase Grid */}
      <section className="py-24 bg-white/5" id="solutions">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Made with AIGameGen</h2>
            <p className="text-gray-400">Join 10,000+ creators building the next hit.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[600px]">
            <ShowcaseCard title="Cyber Run" author="@neo_dev" image="/images/game_cyber.png" h="h-full" />
            <div className="flex flex-col gap-4 h-full">
              <ShowcaseCard title="Pet Sim" author="@cute_games" image="/images/game_pet.png" h="h-1/2" />
              <ShowcaseCard title="Space War" author="@mars_studio" image="/images/game_space.png" h="h-1/2" />
            </div>
            <ShowcaseCard title="Dungeon AI" author="@rpg_fan" image="/images/game_dungeon.png" h="h-full" />
            <div className="flex flex-col gap-4 h-full">
              <ShowcaseCard title="Puzzle X" author="@logic_master" image="/images/game_puzzle.png" h="h-2/3" />
              <ShowcaseCard title="Cooking Mama" author="@chef_ai" image="/images/game_cook.png" h="h-1/3" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center container-wide flex justify-between items-center text-sm text-gray-500">
        <p>© 2025 Interactive Entertainment AI.</p>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </main>
  );
}

function FeatureBlock({ badge, title, desc, align, color, children }: any) {
  const isRight = align === 'right';
  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 ${isRight ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1 space-y-6">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
          {badge}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h2>
        <p className="text-xl text-gray-400 leading-relaxed">{desc}</p>
        <button className="flex items-center gap-2 text-white hover:gap-4 transition-all group font-semibold">
          Learn more <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
        </button>
      </div>
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  )
}

function ShowcaseCard({ title, author, image, h }: any) {
  return (
    <div className={`w-full ${h} rounded-xl overflow-hidden relative group cursor-pointer`}>
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-xs text-gray-300">{author}</p>
      </div>
    </div>
  )
}
