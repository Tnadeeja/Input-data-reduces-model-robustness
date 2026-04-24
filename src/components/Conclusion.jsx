import { motion } from "framer-motion";

export default function Conclusion({ findings }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="report-section rounded-[2rem] p-8"
    >
      <p className="section-kicker">Final Findings</p>
      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        {findings.map((finding) => (
          <div key={finding.title} className="report-card">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">{finding.title}</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{finding.headline}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{finding.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-blue-200 bg-blue-50 p-6">
        <p className="section-kicker">Conclusion</p>
        <p className="mt-4 text-base leading-8 text-slate-700">
          This experiment demonstrates that noisy input data reduces model robustness by increasing prediction error,
          weakening feature-target relationships, and reducing generalization ability. The results support the
          alternative hypothesis that noise significantly reduces model robustness.
        </p>
      </div>
    </motion.section>
  );
}
