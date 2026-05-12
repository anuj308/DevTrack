"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            DevTrack Lite
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Continue with Google
          </h1>
          <p className="text-sm leading-6 text-slate-300">
            Sign in with your Google account to access your DSA tracker, goals,
            and productivity dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
        >
          Continue with Google
        </button>
      </section>
    </main>
  );
}