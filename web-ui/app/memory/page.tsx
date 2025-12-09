"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Library, Search, Sparkles, Rocket, Star, Folder, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
    { id: "goal", label: "Goals", icon: Sparkles, color: "emerald" },
    { id: "project", label: "Projects", icon: Rocket, color: "blue" },
    { id: "preference", label: "Preferences", icon: Star, color: "rose" },
    { id: "other", label: "Other", icon: Folder, color: "slate" },
];

export default function MemoryPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { data: facts, isLoading } = useQuery({
        queryKey: ["facts"],
        queryFn: () => api.getFacts(3000),
    });

    const filteredFacts = facts?.filter((fact) => {
        const matchesSearch = fact.content.toLowerCase().includes(search.toLowerCase()) ||
            fact.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || fact.category.toLowerCase() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryStats = (categoryId: string) => {
        return facts?.filter(f => f.category.toLowerCase() === categoryId).length || 0;
    };

    return (
        <main className="flex min-h-screen flex-col p-8 md:p-24 bg-background text-foreground">
            <div className="w-full max-w-6xl mx-auto">
                <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300">
                            <Library className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Memory Bank</h1>
                            <p className="text-muted-foreground">
                                {isLoading ? "Loading..." : `${filteredFacts?.length || 0} of ${facts?.length || 0} memories`}
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search memories..."
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all"
                        />
                    </div>
                </div>

                {/* Category Selector */}
                <div className="mb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.id;
                            const count = getCategoryStats(category.id);

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                                    className={`
                    relative group p-6 rounded-2xl border-2 transition-all duration-300 ease-out
                    ${isSelected
                                            ? `border-${category.color}-500 bg-${category.color}-50 dark:bg-${category.color}-950/30 shadow-lg scale-105`
                                            : 'border-border bg-card hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:scale-102'
                                        }
                  `}
                                    style={{
                                        borderColor: isSelected ? `var(--${category.color}-500)` : undefined,
                                        backgroundColor: isSelected
                                            ? `hsl(var(--${category.color}) / 0.1)`
                                            : undefined,
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`
                      p-3 rounded-xl transition-all duration-300
                      ${isSelected
                                                ? `bg-gradient-to-br from-${category.color}-100 to-${category.color}-200 dark:from-${category.color}-900 dark:to-${category.color}-950`
                                                : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900'
                                            }
                    `}>
                                            <Icon className={`
                        h-6 w-6 transition-all duration-300
                        ${isSelected
                                                    ? `text-${category.color}-600 dark:text-${category.color}-400`
                                                    : 'text-slate-600 dark:text-slate-400'
                                                }
                      `} />
                                        </div>
                                        <div className="text-center">
                                            <p className={`
                        font-semibold text-sm transition-colors duration-300
                        ${isSelected ? 'text-foreground' : 'text-muted-foreground'}
                      `}>
                                                {category.label}
                                            </p>
                                            <p className={`
                        text-xs mt-1 transition-all duration-300
                        ${isSelected
                                                    ? `text-${category.color}-600 dark:text-${category.color}-400 font-medium`
                                                    : 'text-muted-foreground'
                                                }
                      `}>
                                                {count} {count === 1 ? 'item' : 'items'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Selection indicator */}
                                    {isSelected && (
                                        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center animate-in zoom-in duration-200">
                                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Facts Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-40 rounded-2xl bg-card border border-border animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFacts?.map((fact, index) => {
                            const categoryInfo = categories.find(c => c.id === fact.category.toLowerCase());
                            const Icon = categoryInfo?.icon || Folder;

                            return (
                                <div
                                    key={fact.id}
                                    className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'backwards' }}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                                <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium capitalize">
                                                {fact.category}
                                            </span>
                                        </div>
                                        {fact.timestamp && (
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(fact.timestamp).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm leading-relaxed">{fact.content}</p>

                                    {fact.metadata?.source && (
                                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                                            <span className="capitalize">{fact.metadata.source}</span>
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                                                {fact.id.slice(0, 8)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {filteredFacts?.length === 0 && (
                            <div className="col-span-full text-center py-16">
                                <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                                    <Search className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-muted-foreground text-lg">
                                    {selectedCategory
                                        ? `No ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} found`
                                        : search
                                            ? `No memories found matching "${search}"`
                                            : "No memories yet"
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
