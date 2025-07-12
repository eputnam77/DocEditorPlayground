import { motion } from "framer-motion";
import DarkModeToggle from "../components/DarkModeToggle";
import NavBar from "../components/NavBar";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 transition-colors">
      {/* moving grid backdrop */}
      <div className="pointer-events-none absolute inset-0 isolate [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <div className="absolute inset-0 animate-[spin_30s_linear_infinite] bg-[length:80px_80px] bg-[radial-gradient(theme(colors.slate.300/.3)_1px,transparent_1px)] dark:bg-[radial-gradient(theme(colors.zinc.700/.4)_1px,transparent_1px)]" />
      </div>

      {/* dark-mode button */}
      <div className="absolute top-6 right-8 z-10">
        <DarkModeToggle />
      </div>

      {/* glass card */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[95%] max-w-2xl px-10 py-12 flex flex-col items-center rounded-3xl backdrop-blur-md bg-white/70 dark:bg-zinc-800/80 ring-1 ring-slate-200/60 dark:ring-zinc-700 shadow-xl"
      >
        <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 text-transparent bg-clip-text drop-shadow-sm">
          Document&nbsp;Editor&nbsp;Playground
        </h1>

        <p className="text-lg md:text-xl text-center text-zinc-700 dark:text-zinc-200/90 mb-8 max-w-md">
          Explore and compare today’s best open-source document editors —
          complete with plugins, extensions, and beautiful UI.
        </p>

        <NavBar />

        <footer className="mt-10 text-xs text-zinc-500 dark:text-zinc-400 text-center">
          Built with&nbsp;Next.js, Tailwind&nbsp;CSS, Framer&nbsp;Motion, and OSS editors.
        </footer>
      </motion.section>
    </main>
  );
}
