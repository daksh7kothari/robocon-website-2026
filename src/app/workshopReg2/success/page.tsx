"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 p-8 shadow-2xl shadow-emerald-500/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                <svg
                  className="w-12 h-12 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ animation: "checkDraw 0.6s ease-out" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                Registration Successful! 🎉
              </h1>
              <p className="text-emerald-400 font-medium mb-6">
                You are registered for the workshop
              </p>

              {transactionId && (
                <div className="bg-black/30 rounded-xl p-5 mb-6 text-left space-y-3 border border-gray-700/30">
                  <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-3">
                    Payment Receipt
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Transaction ID (UTR)</span>
                    <span className="text-white text-sm font-mono bg-gray-800/50 px-2 py-1 rounded">
                      {transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Amount</span>
                    <span className="text-emerald-400 font-bold">₹599</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="text-emerald-400 text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />
                      Registered
                    </span>
                  </div>
                </div>
              )}

              <p className="text-gray-400 text-sm mb-6">
                Our team will contact you with workshop details soon.
                <br />
                Please save your Transaction ID for reference.
              </p>

              <div className="text-gray-500 text-sm">
                For any queries contact us on Instagram{" "}
                <a
                  href="https://www.instagram.com/srmteamrobocon/"
                  className="text-rose-400 hover:text-rose-300 hover:underline transition-colors"
                >
                  @srmteamrobocon
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function RegSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
