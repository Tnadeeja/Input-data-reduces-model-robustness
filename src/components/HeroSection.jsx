import { motion } from "framer-motion";
import { Activity, Database, FlaskConical, ShieldAlert, Sigma } from "lucide-react";

const badges = [
  { label: "Real CSV Analysis", icon: Database },
  { label: "Red Wine Dataset", icon: FlaskConical },
  { label: "Noise Injection", icon: ShieldAlert },
  { label: "Regression Models", icon: Activity },
  { label: "Statistical Testing", icon: Sigma },
];

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card overflow-hidden rounded-[2rem] p-8 text-slate-100 sm:p-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_30%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div>
          <p className="section-kicker">Interactive Analytical Report</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Noise in Input Data Reduces Model Robustness
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Interactive Machine Learning Robustness Dashboard using the Red Wine Quality Dataset
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {badges.map(({ label, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-cyan-400/20 bg-slate-950/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-cyan-300" />
                <span className="text-sm font-medium text-slate-100">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

