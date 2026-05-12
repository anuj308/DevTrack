import Link from "next/link";

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            DevTrack Lite
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slate-300">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/problems" className="hover:text-white">Problems</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">Daily Goals</h1>
        <p className="mt-2 text-sm text-slate-300">Create and track your daily preparation goals.</p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="font-medium">Solve 2 medium problems</p>
              <p className="text-xs text-slate-400">Due today</p>
            </div>
            <button className="rounded-full bg-cyan-400 px-3 py-1 text-sm font-semibold text-slate-950">
              Complete
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}