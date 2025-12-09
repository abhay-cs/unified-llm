"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { api, Fact } from "@/lib/api";
import { Send, Sparkles, ArrowLeft, Brain, Lightbulb, Circle, User } from "lucide-react";
import Link from "next/link";

interface Message {
    role: "user" | "assistant";
    content: string;
    facts?: Fact[];
}

export default function ChatPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const mutation = useMutation({
        mutationFn: api.query,
        onSuccess: (data) => {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.answer, facts: data.retrieved_facts },
            ]);
        },
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { role: "user", content: input }]);
        mutation.mutate(input);
        setInput("");
    };

    return (
        <main className="flex h-screen flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/30 dark:to-slate-700/30">
                            <Sparkles className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-slate-900 dark:text-slate-100">Unified Chat</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by your memory</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                {/* Empty State */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-slate-600/20 blur-3xl rounded-full" />
                                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                                        {/* AI Icon - Custom sparkle pattern */}
                                        <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                                            <circle cx="24" cy="24" r="20" fill="url(#aiGrad)" opacity="0.2" />
                                            <path d="M24 8L26 16L24 24L22 16L24 8Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                            <path d="M40 24L32 26L24 24L32 22L40 24Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                            <path d="M24 40L22 32L24 24L26 32L24 40Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                            <path d="M8 24L16 22L24 24L16 26L8 24Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                            <circle cx="24" cy="24" r="4" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                            <defs>
                                                <radialGradient id="aiGrad">
                                                    <stop offset="0%" stopColor="rgb(168 85 247)" />
                                                    <stop offset="100%" stopColor="rgb(236 72 153)" />
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    Your AI with memory
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
                                    Ask me anything. I have access to your entire conversation history and extracted memories.
                                </p>

                                {/* Suggested Prompts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                                    {[
                                        { icon: Brain, text: "What are my current projects?" },
                                        { icon: Lightbulb, text: "What are my preferences?" },
                                        { icon: Sparkles, text: "Summarize my goals" },
                                        { icon: User, text: "What do you know about me?" }
                                    ].map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(prompt.text)}
                                            className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 text-left"
                                        >
                                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/30 transition-colors">
                                                <prompt.icon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{prompt.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {msg.role === "assistant" && (
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/30 dark:to-slate-700/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        {/* AI sparkle icon */}
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                                            <path d="M10 2L11 8L10 14L9 8L10 2Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                            <path d="M18 10L12 11L6 10L12 9L18 10Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                            <circle cx="10" cy="10" r="2" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                        </svg>
                                    </div>
                                )}

                                <div className={`flex flex-col max-w-[75%] gap-3 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`group relative p-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${msg.role === "user"
                                            ? "bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 text-white dark:text-slate-900 rounded-tr-sm"
                                            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-sm"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>

                                    {/* Retrieved Facts (Memory Context) */}
                                    {msg.facts && msg.facts.length > 0 && (
                                        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '200ms' }}>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 ml-1">
                                                <Brain className="h-3.5 w-3.5" />
                                                <span className="font-medium">Memory Used ({msg.facts.length})</span>
                                            </div>
                                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border border-slate-200 dark:border-slate-800/30 rounded-xl p-4 space-y-2.5">
                                                {msg.facts.map((fact, fi) => (
                                                    <div
                                                        key={fi}
                                                        className="flex gap-2.5 text-sm group/fact"
                                                    >
                                                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-400 mt-2 group-hover/fact:scale-150 transition-transform" />
                                                        <div className="flex-1">
                                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                                {fact.content}
                                                            </p>
                                                            {fact.category && (
                                                                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                                                                    {fact.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {msg.role === "user" && (
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        {/* User icon - simple circle */}
                                        <Circle className="h-5 w-5 fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {mutation.isPending && (
                            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/30 dark:to-slate-700/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    {/* AI sparkle icon */}
                                    <svg className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 2L11 8L10 14L9 8L10 2Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                        <path d="M18 10L12 11L6 10L12 9L18 10Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                        <circle cx="10" cy="10" r="2" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                                    </svg>
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 shadow-sm">
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce"
                                                style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                            <div className="relative group">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything about your memories..."
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-300 dark:focus:border-slate-700 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    disabled={mutation.isPending}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || mutation.isPending}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 text-white dark:text-slate-900 rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                                Responses are powered by your extracted memories and DeepSeek AI
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
