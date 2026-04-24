import { motion } from "framer-motion";

const summaryKeys = [
  { label: "Rows", key: "rows" },
  { label: "Input Features", key: "input_features" },
  { label: "Target Variable", key: "target_variable" },
  { label: "Quality Range", key: "range" },
  { label: "Missing Values", key: "missing_values_count" },
];

export default function DatasetOverview({ summary }) {
  const cards = summaryKeys.map((item) => ({
    label: item.label,
    value:
      item.key === "range"
        ? `${summary.quality_min} - ${summary.quality_max}`
        : summary[item.key],
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card rounded-[2rem] p-8 text-slate-100"
    >
      <p className="section-kicker">Dataset Overview</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="section-title">Real dataset summary from `dataset_summary.json`</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <div key={card.label} className="metric-card">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Feature List</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.feature_names.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

