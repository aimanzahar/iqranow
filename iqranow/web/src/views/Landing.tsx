import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Landing() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
          animate={{ y: [0, 12, 0], x: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Learn Quranic recitation with
            <span className="text-brand-400"> real-time feedback</span>
          </h1>
          <p className="mt-6 text-white/80 text-lg max-w-prose">
            Guided by Tajweed rules, voice-enabled, and inclusive by design. Set goals, track your progress, and recite with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="px-5 py-3 rounded-full bg-brand-500 text-white font-semibold shadow-glow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-400"
              to="/learn"
            >
              Start Learning
            </Link>
            <Link
              className="px-5 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              to="/progress"
            >
              View Progress
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-4 text-sm text-white/80">
            <li className="bg-white/5 p-4 rounded-xl">Speech recognition feedback</li>
            <li className="bg-white/5 p-4 rounded-xl">Tajweed guidance</li>
            <li className="bg-white/5 p-4 rounded-xl">Goals & achievements</li>
            <li className="bg-white/5 p-4 rounded-xl">Accessibility-first UX</li>
          </ul>
        </div>
        <div className="relative">
          <motion.div
            className="aspect-[9/16] md:aspect-[4/5] rounded-3xl bg-gradient-to-br from-brand-500/20 via-white/5 to-fuchsia-500/10 p-1 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-full w-full rounded-[calc(theme(borderRadius.3xl)-4px)] bg-surface/80 backdrop-blur p-6">
              <div className="h-full rounded-2xl border border-white/10 p-6 flex flex-col gap-4">
                <div className="text-white/70">Live Pronunciation</div>
                <div className="flex-1 rounded-xl bg-black/30 border border-white/10" />
                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 rounded-lg bg-white/10 hover:bg-white/20">Record</button>
                  <button className="py-2 rounded-lg bg-white/10 hover:bg-white/20">Listen</button>
                  <button className="py-2 rounded-lg bg-white/10 hover:bg-white/20">Compare</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
