"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

function FailedContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");

    return (
        <>
            <Header />
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-lg w-full">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 p-8 shadow-2xl shadow-red-500/10">
                        {/* Background glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 text-center">
                            {/* Failed icon */}
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full flex items-center justify-center border-2 border-red-500/30">
                                <svg
                                    className="w-12 h-12 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">
                                Payment Failed
                            </h1>
                            <p className="text-red-400 font-medium mb-6">
                                {reason || "Your payment could not be processed"}
                            </p>

                            <div className="bg-black/30 rounded-xl p-5 mb-6 border border-gray-700/30">
                                <div className="flex items-start gap-3">
                                    <svg
                                        className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="text-gray-400 text-sm text-left">
                                        If money was deducted from your account, it will be{" "}
                                        <span className="text-white font-medium">
                                            automatically refunded within 5-7 business days
                                        </span>
                                        . No action needed.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/workshopReg2"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Try Again
                            </Link>

                            <p className="text-gray-500 text-sm mt-6">
                                For support, contact us on Instagram{" "}
                                <a
                                    href="https://www.instagram.com/srmteamrobocon/"
                                    className="text-rose-400 hover:text-rose-300 hover:underline transition-colors"
                                >
                                    @srmteamrobocon
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default function PaymentFailedPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-black">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <FailedContent />
        </Suspense>
    );
}
