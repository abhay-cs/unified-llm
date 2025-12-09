"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Brain, Database, MessageSquare, Upload, Sparkles, Zap, Library } from "lucide-react";
import Link from "next/link";

export default function Home() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["stats"],
        queryFn: api.getStats,
    });

    return (
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-background text-foreground">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex mb-12">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-border bg-background/95 pb-6 pt-8 backdrop-blur-xl lg:static lg:w-auto lg:rounded-xl lg:border lg:p-4 font-medium">
                    Unified LLM Workspace
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-background via-background/80 lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <div className="flex items-center gap-2 p-8 lg:p-0">
                        <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className="text-muted-foreground">{isLoading ? 'Connecting...' : 'System Online'}</span>
                    </div>
                </div>
            </div>

            <div className="relative flex place-items-center mb-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-300 dark:to-slate-400">
                        Your AI Memory Center
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        One unified memory for ChatGPT, Claude, and Gemini.
                        Store, retrieve, and query your digital brain.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
                <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300">
                            <Brain className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Memories</p>
                            <h3 className="text-3xl font-bold tracking-tight">
                                {isLoading ? "..." : stats?.total_facts?.toLocaleString() || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 text-blue-700 dark:text-blue-300">
                            <Database className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Storage Type</p>
                            <h3 className="text-3xl font-bold capitalize tracking-tight">
                                {isLoading ? "..." : stats?.storage_type || "Unknown"}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 text-emerald-700 dark:text-emerald-300">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                            <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">Active</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                <Link
                    href="/import"
                    className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
                >
                    <div className="mb-6 p-4 w-fit rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:from-blue-100 group-hover:to-cyan-100 dark:group-hover:from-blue-950 dark:group-hover:to-cyan-950 transition-all">
                        <Upload className="h-7 w-7 text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                    </div>
                    <h2 className="mb-3 text-xl font-bold tracking-tight">
                        Import Data{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Add conversations from ChatGPT, Claude, and other providers.
                    </p>
                </Link>

                <Link
                    href="/chat"
                    className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
                >
                    <div className="mb-6 p-4 w-fit rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:from-blue-100 group-hover:to-cyan-100 dark:group-hover:from-blue-950 dark:group-hover:to-cyan-950 transition-all">
                        <Zap className="h-7 w-7 text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                    </div>
                    <h2 className="mb-3 text-xl font-bold tracking-tight">
                        Chat{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Ask questions and get answers based on your unified memory.
                    </p>
                </Link>

                <Link
                    href="/memory"
                    className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
                >
                    <div className="mb-6 p-4 w-fit rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:from-emerald-100 group-hover:to-teal-100 dark:group-hover:from-emerald-950 dark:group-hover:to-teal-950 transition-all">
                        <Library className="h-7 w-7 text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors" />
                    </div>
                    <h2 className="mb-3 text-xl font-bold tracking-tight">
                        Memory Bank{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Explore, search, and manage your extracted facts.
                    </p>
                </Link>
            </div>
        </main>
    );
}
