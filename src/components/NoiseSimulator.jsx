import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const NOISE_TYPES = [
  {
    title: "Gaussian Noise",
    detail: "Simulates measurement noise by adding random Gaussian perturbations to standardized training features.",
    levels: "0%, 10%, 20%, 30%, 50%",
  },
  {
    title: "Missing Data",
    detail: "Simulates incomplete records by replacing random training values with NaN before median imputation.",
    levels: "5%, 10%, 20%, 30%",
  },
  {
    title: "Outliers",
    detail: "Simulates extreme observations by injecting IQR-based abnormal feature values into training data.",
    levels: "5%, 10%, 20%, 40%",
  },
];

function Interpretation({ bestModel, worstDegradation }) {
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm leading-7 text-slate-100">
      <p>
        At the selected Gaussian noise level, <span className="font-semibold text-white">{bestModel}</span> delivers the
        best RMSE on the clean test set.
      </p>
      <p className="mt-2">
        The strongest performance degradation is observed for{" "}
        <span className="font-semibold text-white">{worstDegradation.model}</span> at{" "}
        <span className="font-semibold text-white">{worstDegradation.value.toFixed(2)}%</span>, showing how corruption in
        training data propagates into weaker generalization.
      </p>
    </div>
  );
}

export default function NoiseSimulator({ noiseResults }) {
  const [selectedLevel, setSelectedLevel] = useState("0%");
  const gaussianResults = noiseResults.gaussian_noise.results;

  const selectedEntry = useMemo(
    () => gaussianResults.find((entry) => entry.noise_label === selectedLevel) ?? gaussianResults[0],
    [gaussianResults, selectedLevel],
  );

  const bestModel = useMemo(
    () =>
      Object.entries(selectedEntry.models).sort((a, b) => a[1].rmse - b[1].rmse)[0]?.[0] ??
      "No model available",
    [selectedEntry],
  );

  const worstDegradation = useMemo(() => {
    return Object.entries(selectedEntry.models)
      .map(([model, metrics]) => ({ model, value: metrics.degradation_pct }))
      .sort((a, b) => b.value - a.value)[0];
  }, [selectedEntry]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card rounded-[2rem] p-8 text-slate-100"
    >
      <p className="section-kicker">Noise Experiments</p>
      <h2 className="mt-4 section-title">Interactive Noise Simulator</h2>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {NOISE_TYPES.map((item) => (
          <div key={item.title} className="metric-card">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{item.detail}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-cyan-300">Levels: {item.levels}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
          <label htmlFor="noise-level" className="text-sm font-medium text-slate-300">
            Select Gaussian noise level
          </label>
          <select
            id="noise-level"
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          >
            {gaussianResults.map((entry) => (
              <option key={entry.noise_label} value={entry.noise_label}>
                {entry.noise_label}
              </option>
            ))}
          </select>
          <div className="mt-5 space-y-3">
            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Best model</p>
              <p className="mt-2 text-xl font-semibold text-white">{bestModel}</p>
            </div>
            <Interpretation bestModel={bestModel} worstDegradation={worstDegradation} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(selectedEntry.models).map(([model, metrics]) => (
            <div key={model} className="metric-card">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{model}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div>
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">RMSE</span>
                  <span className="text-2xl font-semibold text-white">{metrics.rmse}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">MAE</span>
                  <span className="text-lg font-medium text-white">{metrics.mae}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">R²</span>
                  <span className="text-lg font-medium text-white">{metrics.r2}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Degradation</span>
                  <span className="text-lg font-medium text-rose-300">{metrics.degradation_pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

