import DarkModeToggle from '../components/DarkModeToggle';
import NavBar from '../components/NavBar';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 flex flex-col items-center justify-center transition-colors">
      <div className="absolute top-6 right-8">
        <DarkModeToggle />
      </div>
      <section className="bg-white/80 dark:bg-zinc-800/95 shadow-2xl rounded-2xl px-10 py-12 max-w-xl w-full flex flex-col items-center border border-zinc-100 dark:border-zinc-700">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 drop-shadow-lg">
          Document Editor Playground
        </h1>
        <p className="text-lg md:text-xl mb-8 text-zinc-700 dark:text-zinc-200 text-center">
          Preview and compare modern document editors with plugins, extensions, and beautiful UI.
        </p>
        <NavBar />
        <div className="mt-10 text-xs text-zinc-400 dark:text-zinc-500 text-center">
          Built with Next.js, Tailwind CSS, and open-source editors.
        </div>
      </section>
    </main>
  );
}
