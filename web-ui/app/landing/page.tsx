"use client";

import { Sparkles, Zap, Shield, Brain, ArrowRight, Star, ChevronDown, Circle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
            {/* Animated Background Grid */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center">
                {/* Floating orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-24">
                    <div className="text-center max-w-5xl mx-auto">
                        {/* Badge with shimmer */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg hover:shadow-xl transition-shadow group">
                            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform" />
                            <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
                                Your AI conversations, finally unified
                            </span>
                        </div>

                        {/* Headline with stagger animation */}
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards">
                            <span className="inline-block bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent" style={{ animationDelay: '100ms' }}>
                                One Memory
                            </span>
                            <br />
                            <span className="inline-block bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 dark:from-slate-300 dark:via-slate-400 dark:to-slate-500 bg-clip-text text-transparent" style={{ animationDelay: '200ms' }}>
                                for All Your AI
                            </span>
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-backwards" style={{ animationDelay: '300ms' }}>
                            Stop repeating yourself across ChatGPT, Claude, and Gemini. Build a unified memory that remembers everything—so your AI actually knows you.
                        </p>

                        {/* Key Benefits with stagger */}
                        <div className="flex flex-col md:flex-row gap-4 justify-center mb-16 text-left">
                            {[
                                { title: "Import in seconds", subtitle: "From any AI platform", delay: '400ms' },
                                { title: "Smart extraction", subtitle: "AI finds what matters", delay: '500ms' },
                                { title: "Never repeat", subtitle: "Context everywhere", delay: '600ms' }
                            ].map((benefit, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards group"
                                    style={{ animationDelay: benefit.delay }}
                                >
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                                        <Circle className="h-5 w-5 fill-slate-900 dark:fill-slate-100 text-slate-900 dark:text-slate-100" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{benefit.title}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTAs with hover effects */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-backwards" style={{ animationDelay: '700ms' }}>
                            <Link
                                href="/import"
                                className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative">Start Building Your Memory</span>
                                <ArrowRight className="h-5 w-5 relative group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/chat"
                                className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-semibold hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-xl hover:scale-105"
                            >
                                Try Demo Chat
                            </Link>
                        </div>

                        {/* Scroll indicator */}
                        <div className="animate-bounce mt-16">
                            <ChevronDown className="h-6 w-6 mx-auto text-slate-400" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section - Simplified */}
            <section className="relative py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                            Scattered conversations.<br />Lost context.
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Every AI platform is a silo. Your insights disappear the moment you switch.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            "Re-explaining your preferences every time",
                            "Insights buried in old chats",
                            "Inconsistent responses across platforms",
                            "No way to search your history"
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group relative p-6 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-800/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500 mt-2 group-hover:scale-150 transition-transform" />
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{item}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution Section - Redesigned Flow */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                            Three steps to unified memory
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            From scattered conversations to searchable intelligence in minutes
                        </p>
                    </div>

                    {/* Visual Flow */}
                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent -translate-y-1/2" />

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Step 1: Import */}
                            <div className="group relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                <div className="relative">
                                    {/* Visual Representation */}
                                    <div className="mb-8 relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all">
                                        {/* Animated file icons */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative w-32 h-24">
                                                {[0, 1, 2].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-16 h-20 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-all duration-500"
                                                        style={{
                                                            left: `${i * 16}px`,
                                                            top: `${i * 8}px`,
                                                            transform: `rotate(${(i - 1) * 8}deg)`,
                                                            transformOrigin: 'center center',
                                                            transitionDelay: `${i * 100}ms`
                                                        }}
                                                    >
                                                        <div className="p-3">
                                                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                                                            <div className="w-3/4 h-2 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                                                            <div className="w-1/2 h-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Arrow indicator */}
                                        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-blue-500/20 dark:bg-blue-400/20 flex items-center justify-center group-hover:scale-125 transition-transform">
                                            <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>

                                    {/* Step Number */}
                                    <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl shadow-xl">
                                        1
                                    </div>

                                    {/* Content */}
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                                            Drop & Import
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Drag your conversation exports from any platform. We parse ChatGPT, Claude, Gemini—instantly.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Extract */}
                            <div className="group relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                <div className="relative">
                                    {/* Visual Representation */}
                                    <div className="mb-8 relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all">
                                        {/* Brain/processing visualization */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative w-32 h-32 flex items-center justify-center">
                                                {/* Central node */}
                                                <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 group-hover:scale-150 transition-all duration-1000" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                                                {/* Orbiting dots */}
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-purple-500 dark:group-hover:bg-purple-400 transition-all duration-500"
                                                        style={{
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: `translate(-50%, -50%) rotate(${i * 72}deg) translateX(40px)`,
                                                            transitionDelay: `${i * 100}ms`
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {/* Processing indicator */}
                                        <div className="absolute bottom-4 right-4 flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-pulse"
                                                    style={{ animationDelay: `${i * 200}ms` }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step Number */}
                                    <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl shadow-xl">
                                        2
                                    </div>

                                    {/* Content */}
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                                            AI Extraction
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            DeepSeek reads every message, extracts goals, preferences, and project context automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Query */}
                            <div className="group relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                <div className="relative">
                                    {/* Visual Representation */}
                                    <div className="mb-8 relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all">
                                        {/* Search/chat visualization */}
                                        <div className="absolute inset-0 flex items-center justify-center p-6">
                                            <div className="w-full space-y-3">
                                                {/* Message bubbles */}
                                                <div className="flex justify-end">
                                                    <div className="w-3/4 h-8 bg-slate-900 dark:bg-slate-100 rounded-2xl rounded-tr-sm opacity-20 group-hover:opacity-30 transition-opacity" />
                                                </div>
                                                <div className="flex justify-start">
                                                    <div className="w-4/5 h-12 bg-emerald-500 dark:bg-emerald-400 rounded-2xl rounded-tl-sm opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-105 duration-500" />
                                                </div>
                                                <div className="flex justify-start">
                                                    <div className="w-2/3 h-8 bg-emerald-500 dark:bg-emerald-400 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Active indicator */}
                                        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 flex items-center justify-center group-hover:scale-125 transition-transform">
                                            <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </div>

                                    {/* Step Number */}
                                    <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl shadow-xl">
                                        3
                                    </div>

                                    {/* Content */}
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                                            Instant Recall
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Ask anything. Get answers enriched with your entire conversation history, instantly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Value Stack - Clean Visualizations */}
                    <div className="grid md:grid-cols-2 gap-6 mt-24">
                        {/* Instant Context Switching */}
                        <div className="group relative p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
                            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            <div className="relative flex items-start gap-6">
                                <div className="flex-shrink-0 w-20 h-20 relative flex items-center justify-center">
                                    <div className="relative w-16 h-16">
                                        {/* Two platform squares */}
                                        <div className="absolute w-10 h-10 rounded-lg border-2 border-emerald-500 dark:border-emerald-400 top-0 left-0 group-hover:translate-x-2 group-hover:-translate-y-1 transition-all duration-500" />
                                        <div className="absolute w-10 h-10 rounded-lg border-2 border-teal-500 dark:border-teal-400 bottom-0 right-0 group-hover:-translate-x-2 group-hover:translate-y-1 transition-all duration-500" />
                                        {/* Connection line */}
                                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12" viewBox="0 0 48 48">
                                            <line x1="12" y1="24" x2="36" y2="24" stroke="url(#grad1)" strokeWidth="2" className="group-hover:stroke-[3] transition-all" strokeDasharray="24" strokeDashoffset="0">
                                                <animate attributeName="strokeDashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" className="opacity-0 group-hover:opacity-100" />
                                            </line>
                                            <defs>
                                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="rgb(16 185 129)" />
                                                    <stop offset="100%" stopColor="rgb(20 184 166)" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">Instant context switching</p>
                                    <p className="text-slate-600 dark:text-slate-400">Move between AI platforms without losing context</p>
                                </div>
                            </div>
                        </div>

                        {/* Searchable Memory */}
                        <div className="group relative p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
                            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            <div className="relative flex items-start gap-6">
                                <div className="flex-shrink-0 w-20 h-20 relative flex items-center justify-center">
                                    <div className="relative w-16 h-16 grid grid-cols-3 gap-2">
                                        {[...Array(9)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`rounded transition-all duration-500 ${i === 4
                                                    ? 'bg-blue-500 dark:bg-blue-400 ring-2 ring-blue-500/30 dark:ring-blue-400/30 group-hover:scale-125'
                                                    : 'bg-slate-300 dark:bg-slate-700 group-hover:opacity-40'
                                                    }`}
                                                style={{ transitionDelay: `${i * 40}ms` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">Searchable memory</p>
                                    <p className="text-slate-600 dark:text-slate-400">Find any fact from thousands of conversations</p>
                                </div>
                            </div>
                        </div>

                        {/* Privacy First */}
                        <div className="group relative p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
                            <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            <div className="relative flex items-start gap-6">
                                <div className="flex-shrink-0 w-20 h-20 relative flex items-center justify-center">
                                    <svg className="w-16 h-16 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 64 64" fill="none">
                                        {/* Shield outline */}
                                        <path d="M32 8L12 16V28C12 42 20 52 32 56C44 52 52 42 52 28V16L32 8Z"
                                            stroke="url(#shieldGrad)"
                                            strokeWidth="2.5"
                                            fill="url(#shieldFill)"
                                            className="drop-shadow-lg"
                                        />
                                        {/* Lock */}
                                        <rect x="26" y="30" width="12" height="10" rx="1.5" fill="currentColor" className="text-purple-600 dark:text-purple-400" />
                                        <path d="M28 30V26C28 23.8 29.8 22 32 22C34.2 22 36 23.8 36 26V30"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            className="text-purple-600 dark:text-purple-400"
                                        />
                                        <defs>
                                            <linearGradient id="shieldGrad" x1="12" y1="8" x2="52" y2="56">
                                                <stop offset="0%" stopColor="rgb(168 85 247)" />
                                                <stop offset="100%" stopColor="rgb(236 72 153)" />
                                            </linearGradient>
                                            <linearGradient id="shieldFill" x1="12" y1="8" x2="52" y2="56">
                                                <stop offset="0%" stopColor="rgb(168 85 247)" stopOpacity="0.1" />
                                                <stop offset="100%" stopColor="rgb(236 72 153)" stopOpacity="0.1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">Privacy-first</p>
                                    <p className="text-slate-600 dark:text-slate-400">Your data stays on your infrastructure</p>
                                </div>
                            </div>
                        </div>

                        {/* Smart Categorization */}
                        <div className="group relative p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
                            <div className="absolute -inset-4 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            <div className="relative flex items-start gap-6">
                                <div className="flex-shrink-0 w-20 h-20 relative flex items-center justify-center">
                                    <div className="relative w-16 h-12 flex flex-col justify-center gap-2">
                                        {[100, 70, 85].map((width, i) => (
                                            <div
                                                key={i}
                                                className="h-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400 transition-all duration-500 group-hover:shadow-lg"
                                                style={{
                                                    width: `${width}%`,
                                                    transitionDelay: `${i * 100}ms`,
                                                    opacity: 0.3 + (i * 0.2)
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">Smart categorization</p>
                                    <p className="text-slate-600 dark:text-slate-400">Auto-organized into goals, projects, and preferences</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA - Gradient background */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white">
                        Stop losing your AI context
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Build your unified memory in the next 5 minutes. Free, open-source, yours forever.
                    </p>
                    <Link
                        href="/import"
                        className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-slate-900 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 shadow-2xl hover:shadow-3xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative">Start Building Now</span>
                        <ArrowRight className="h-6 w-6 relative group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-8 text-sm text-slate-400">
                        No credit card. No signup. Just download and run.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <p className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">Unified LLM Workspace</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">One memory for all your AI</p>
                        </div>
                        <div className="flex gap-8 text-sm text-slate-600 dark:text-slate-400">
                            {["Dashboard", "Memory Bank", "Chat", "GitHub"].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link === "GitHub" ? "https://github.com" : `/${link.toLowerCase().replace(" ", "")}`}
                                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors relative group"
                                >
                                    {link}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 dark:bg-slate-100 group-hover:w-full transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
                        <p>Open source. Self-hostable. Built for those who value their data.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
