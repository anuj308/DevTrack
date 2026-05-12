export default function Home() {
  const navItems = ["Home", "Features", "Modules", "Workflow"];

  const features = [
    {
      title: "Track DSA progress",
      description:
        "Store solved problems with difficulty, topics, and notes in one place.",
    },
    {
      title: "Manage daily goals",
      description:
        "Keep preparation focused with small, trackable daily objectives.",
    },
    {
      title: "See productivity clearly",
      description:
        "Monitor solved counts, completion trends, and overall momentum.",
    },
    {
      title: "Built for real workflows",
      description:
        "A clean frontend that connects to Spring Boot, PostgreSQL, Docker, and CI/CD.",
    },
  ];

  const modules = [
    "Authentication Module",
    "DSA Tracker Module",
    "Goal Tracker Module",
    "Dashboard Module",
  ];

  const workflow = [
    "Frontend: Next.js + Tailwind CSS",
    "Backend: Spring Boot + Maven",
    "Database: PostgreSQL",
    "Containerization: Docker",
    "CI/CD: GitHub Actions",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="text-lg font-semibold tracking-tight">
            DevTrack Lite
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-300 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
             <a
                href={`/dashboard`}
                className="text-sm text-slate-300 transition-colors hover:text-white"
              >
                Dashboard
              </a>
          </nav>

          <a
            href="/login"
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
          >
            Login
          </a>
        </div>
      </header>

      <main id="home" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Developer Productivity and DSA Progress Tracker
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                One place to track coding progress, daily goals, and interview preparation.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                DevTrack Lite helps students and developers organize solved DSA problems,
                manage preparation goals, and monitor productivity through a clear dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-full bg-cyan-400 px-6 text-sm font-semibold text-slate-950"
              >
                Explore Features
              </a>
              <a
                href="#workflow"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white"
              >
                View Workflow
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Solved Problems</p>
                <p className="mt-2 text-2xl font-semibold">128+</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Daily Goals</p>
                <p className="mt-2 text-2xl font-semibold">09</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Streak</p>
                <p className="mt-2 text-2xl font-semibold">14 days</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="rounded-3xl bg-slate-900 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                Project Overview
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Problem</p>
                  <p className="mt-1 text-white">
                    Coding preparation is scattered across multiple platforms and notes.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Solution</p>
                  <p className="mt-1 text-white">
                    A centralized tracker for DSA, goals, productivity, and progress summaries.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Stack</p>
                  <p className="mt-1 text-white">
                    Next.js, Tailwind CSS, Spring Boot, PostgreSQL, Docker, GitHub Actions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">Core features</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="modules" className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">Modules of the project</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => (
              <div key={module} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm font-medium text-cyan-300">{module}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">System workflow</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {workflow.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-cyan-300">0{index + 1}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}