import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const palette = {
  "Linear Regression": "#38bdf8",
  "Random Forest Regressor": "#14b8a6",
  "Support Vector Regressor": "#f59e0b",
  "Gaussian Noise": "#38bdf8",
  "Missing Data": "#14b8a6",
  Outliers: "#f97316",
};

export default function ResultsCharts({ noiseResults, modelResults }) {
  const highestDegradation =
    modelResults.gaussian_degradation_by_noise[modelResults.gaussian_degradation_by_noise.length - 1];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card rounded-[2rem] p-8 text-slate-100"
    >
      <p className="section-kicker">Model Performance Charts</p>
      <h2 className="mt-4 section-title">Performance decay across corruption types</h2>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="RMSE vs Gaussian Noise">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={modelResults.gaussian_rmse_by_noise}>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="noise_level" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(palette)
                .filter((key) => key.includes("Regression") || key.includes("Forest") || key.includes("Support"))
                .map((key) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={palette[key]} strokeWidth={3} dot={{ r: 4 }} />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="R² vs Gaussian Noise">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={modelResults.gaussian_r2_by_noise}>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="noise_level" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(palette)
                .filter((key) => key.includes("Regression") || key.includes("Forest") || key.includes("Support"))
                .map((key) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={palette[key]} strokeWidth={3} dot={{ r: 4 }} />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Degradation at Highest Gaussian Noise">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Object.entries(highestDegradation)
                .filter(([key]) => key !== "noise_level")
                .map(([model, value]) => ({ model, value }))}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="model" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {Object.entries(highestDegradation)
                  .filter(([key]) => key !== "noise_level")
                  .map(([model]) => (
                    <Cell key={model} fill={palette[model]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gaussian vs Missing vs Outlier Impact">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={noiseResults.chart_friendly.model_comparison}>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="model" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Gaussian Noise" fill={palette["Gaussian Noise"]} radius={[8, 8, 0, 0]} />
              <Bar dataKey="Missing Data" fill={palette["Missing Data"]} radius={[8, 8, 0, 0]} />
              <Bar dataKey="Outliers" fill={palette.Outliers} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </motion.section>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 h-80">{children}</div>
    </div>
  );
}
