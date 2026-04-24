import { motion } from "framer-motion";

export default function StatisticalEvidence({ statisticalTests }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card rounded-[2rem] p-8 text-slate-100"
    >
      <p className="section-kicker">Statistical Evidence</p>
      <h2 className="mt-4 section-title">One-way ANOVA results across corruption levels</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {statisticalTests.tests.map((test) => (
          <div key={test.experiment} className="metric-card">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{test.experiment}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{test.interpretation}</p>
            <p className="mt-3 text-sm text-slate-300">p-value: {test.p_value}</p>
            <p className="mt-1 text-sm text-slate-300">F-statistic: {test.anova_f_statistic}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm leading-7 text-slate-100">
        Final decision: <span className="font-semibold text-white">{statisticalTests.final_decision}</span>
        {statisticalTests.final_decision === "Reject H0"
          ? " because Gaussian noise or missing-data corruption produced statistically significant RMSE differences."
          : " because the tested corruption regimes did not produce statistically significant RMSE differences for Gaussian or missing-data experiments."}
      </div>
    </motion.section>
  );
}

