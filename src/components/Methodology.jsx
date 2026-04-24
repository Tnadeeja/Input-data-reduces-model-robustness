import { motion } from "framer-motion";

const pipeline = [
  "Clean CSV Data",
  "Preprocessing",
  "Train/Test Split",
  "Noise Injection on Training Data",
  "Model Training",
  "Clean Test Evaluation",
  "Statistical Testing",
];

export default function Methodology() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="report-section rounded-[2rem] p-8">
        <p className="section-kicker">Problem Statement and Hypothesis</p>
        <h2 className="mt-4 section-title">Why robustness matters in real-world machine learning</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Real-world data contains errors, missing values and outliers. Machine learning models often assume clean input
          structure, so this project tests how data corruption changes predictive robustness.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="report-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">H0</p>
            <p className="mt-3 text-base leading-7 text-slate-800">
              Noise in input data does not significantly affect model robustness.
            </p>
          </div>
          <div className="report-card border-blue-200">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">H1</p>
            <p className="mt-3 text-base leading-7 text-slate-800">
              Noise in input data significantly reduces model robustness.
            </p>
          </div>
        </div>
      </div>

      <div className="report-section rounded-[2rem] p-8">
        <p className="section-kicker">Methodology</p>
        <h2 className="mt-4 section-title">Experimental pipeline</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {pipeline.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-slate-800">
                {step}
              </span>
              {index < pipeline.length - 1 && <span className="text-blue-500">&rarr;</span>}
            </div>
          ))}
        </div>
        <div className="report-card-muted mt-6 p-5 text-sm leading-7 text-slate-600">
          Noise was injected only into training data. Testing was always performed on the clean test data, preserving a
          fair estimate of generalization performance after corrupted training conditions.
        </div>
      </div>
    </motion.section>
  );
}
