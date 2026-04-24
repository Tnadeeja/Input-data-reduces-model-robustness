import { motion } from "framer-motion";

export default function Conclusion({ findings }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card rounded-[2rem] p-8 text-slate-100"
    >
      <p className="section-kicker">Final Findings</p>
      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        {findings.map((finding) => (
          <div key={finding.title} className="metric-card">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{finding.title}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{finding.headline}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{finding.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
        <p className="section-kicker">Conclusion</p>
        <p className="mt-4 text-base leading-8 text-slate-50">
          This experiment demonstrates that noisy input data reduces model robustness by increasing prediction error,
          weakening feature-target relationships, and reducing generalization ability. The results support the
          alternative hypothesis that noise significantly reduces model robustness.
        </p>
      </div>
    </motion.section>
  );
}

