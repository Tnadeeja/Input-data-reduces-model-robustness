import { motion } from "framer-motion";
import { CircleAlert, Database, Layers3, List, Target } from "lucide-react";

const summaryKeys = [
  { label: "Total Rows", key: "rows" },
  { label: "Input Features", key: "input_features" },
  { label: "Target Variable", key: "target_variable" },
  { label: "Quality Range", key: "range" },
  { label: "Missing Values", key: "missing_values_count" },
];

const icons = {
  "Total Rows": Database,
  "Input Features": Layers3,
  "Target Variable": Target,
  "Quality Range": CircleAlert,
  "Missing Values": CircleAlert,
};

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
      className="report-section rounded-[2rem] px-6 py-10 sm:px-8"
    >
      <p className="section-kicker text-center">Dataset Overview</p>
      <div className="mt-4 text-center">
        <h2 className="section-title">Dataset Overview</h2>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600">
          The Red Wine Quality dataset contains physicochemical measurements of Portuguese "Vinho Verde" wines.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = icons[card.label] ?? List;
          return (
            <div key={card.label} className="report-card text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <Icon size={18} className="text-blue-600" />
              </div>
              <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">{card.value}</p>
              <p className="mt-2 text-sm text-slate-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="report-card-muted mt-8 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <List size={18} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Feature List</h3>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summary.feature_names.map((feature, index) => (
            <div key={feature} className="flex items-center gap-3 text-sm text-slate-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                {index + 1}
              </span>
              <span className="capitalize">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
