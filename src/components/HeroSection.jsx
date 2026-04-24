import { motion } from "framer-motion";
import { Activity, Database, FlaskConical, ShieldAlert, Sigma, Target, Waves } from "lucide-react";

const badges = [
  { label: "Real CSV Analysis", icon: Database },
  { label: "Red Wine Dataset", icon: FlaskConical },
  { label: "Noise Injection", icon: ShieldAlert },
  { label: "Regression Models", icon: Activity },
  { label: "Statistical Testing", icon: Sigma },
  { label: "3 Noise Types", icon: Waves },
];

const highlights = [
  { label: "Wine Samples", value: "1,599", tone: "text-blue-400" },
  { label: "Input Features", value: "11", tone: "text-emerald-400" },
  { label: "ML Models Tested", value: "3", tone: "text-violet-400" },
];

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-shell rounded-[2rem] px-6 py-16 text-slate-100 sm:px-10"
    >
      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
          <Target size={14} />
          Interactive Analytical Report
        </p>
        <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Noise in Input Data Reduces Model Robustness
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Interactive Machine Learning Robustness Dashboard
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {badges.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-slate-600/70 bg-slate-800/55 px-4 py-3 text-sm text-slate-100"
            >
              <Icon size={15} className="text-blue-300" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid w-full max-w-4xl gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-600/60 bg-[#1f2a42] px-6 py-7 text-left">
              <p className={`text-4xl font-bold tracking-tight ${item.tone}`}>{item.value}</p>
              <p className="mt-2 text-sm text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
