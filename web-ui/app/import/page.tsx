"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ImportPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<"chatgpt" | "claude">("chatgpt");

    const mutation = useMutation({
        mutationFn: (data: { file: File; type: "chatgpt" | "claude" }) =>
            api.importData(data.file, data.type),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            mutation.mutate({ file, type });
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-background text-foreground">
            <div className="w-full max-w-3xl">
                <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Import Conversations</h1>
                            <p className="text-muted-foreground">Upload your export files to populate your memory.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Type Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Provider</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setType("chatgpt")}
                                    className={`p-4 rounded-lg border text-left transition-all ${type === "chatgpt"
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                                            : "border-border hover:bg-accent"
                                        }`}
                                >
                                    <div className="font-semibold">ChatGPT</div>
                                    <div className="text-xs text-muted-foreground">conversations.json</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("claude")}
                                    className={`p-4 rounded-lg border text-left transition-all ${type === "claude"
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                                            : "border-border hover:bg-accent"
                                        }`}
                                >
                                    <div className="font-semibold">Claude</div>
                                    <div className="text-xs text-muted-foreground">conversations.json</div>
                                </button>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Export File</label>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent/50 transition-colors relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                    {file ? (
                                        <div className="font-medium text-blue-600">{file.name}</div>
                                    ) : (
                                        <>
                                            <div className="font-medium">Click to upload or drag and drop</div>
                                            <div className="text-xs text-muted-foreground">JSON files only</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!file || mutation.isPending}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {mutation.isPending ? (
                                <>Processing...</>
                            ) : (
                                <>Start Import</>
                            )}
                        </button>

                        {/* Status Messages */}
                        {mutation.isSuccess && (
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Import started successfully! Check the dashboard for progress.
                            </div>
                        )}

                        {mutation.isError && (
                            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Import failed. Please try again.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
