import Link from "next/link";

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            DevTrack Lite
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slate-300">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/goals" className="hover:text-white">Goals</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Solved Problems</h1>
          <button className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
            Add problem
          </button>
        </div>

        <ul className="mt-6 space-y-4">
          <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two Sum</p>
                <p className="text-xs text-cyan-300">Easy · Arrays</p>
              </div>
              <div className="text-sm text-slate-400">03 May</div>
            </div>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Graph - Shortest Path</p>
                <p className="text-xs text-cyan-300">Hard · Graphs</p>
              </div>
              <div className="text-sm text-slate-400">28 Apr</div>
            </div>
          </li>
        </ul>
      </main>
    </div>
  );
}