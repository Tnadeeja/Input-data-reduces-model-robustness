import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const qualityColors = ["#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#155e75", "#0f766e"];

export default function DescriptiveAnalysis({ stats, correlationMatrix }) {
  const sortedPairs = [...correlationMatrix.pairs].sort(
    (a, b) => Math.abs(b.correlation_with_quality) - Math.abs(a.correlation_with_quality),
  );

  const strongestPositive = [...sortedPairs]
    .filter((item) => item.correlation_with_quality > 0)
    .slice(0, 3);
  const strongestNegative = [...sortedPairs]
    .filter((item) => item.correlation_with_quality < 0)
    .slice(0, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card rounded-[2rem] p-8 text-slate-100"
    >
      <p className="section-kicker">Descriptive Analysis</p>
      <div className="mt-4 flex flex-col gap-6">
        <div>
          <h2 className="section-title">Feature distributions and descriptive statistics</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Every value shown here is generated from the real red wine CSV and exported by the Python analysis script.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
            <h3 className="text-lg font-semibold text-white">Quality Distribution</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.quality_distribution}>
                  <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="quality" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {stats.quality_distribution.map((entry, index) => (
                      <Cell key={entry.quality} fill={qualityColors[index % qualityColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
            <h3 className="text-lg font-semibold text-white">Alcohol Distribution</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.alcohol_distribution}>
                  <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="bin_start" tickFormatter={(value) => value.toFixed(1)} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, "Count"]}
                    labelFormatter={(value, payload) =>
                      payload?.[0]
                        ? `${payload[0].payload.bin_start.toFixed(1)} - ${payload[0].payload.bin_end.toFixed(1)}`
                        : value
                    }
                  />
                  <Bar dataKey="count" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <CorrelationHighlights strongestPositive={strongestPositive} strongestNegative={strongestNegative} />

        <div className="table-shell">
          <div className="max-h-[32rem] overflow-auto">
            <table className="min-w-full text-sm text-slate-200">
              <thead className="sticky top-0 bg-slate-950/95 text-left text-xs uppercase tracking-[0.2em] text-cyan-300">
                <tr>
                  <th className="px-4 py-4">Feature</th>
                  <th className="px-4 py-4">Mean</th>
                  <th className="px-4 py-4">Median</th>
                  <th className="px-4 py-4">Std</th>
                  <th className="px-4 py-4">Min</th>
                  <th className="px-4 py-4">Max</th>
                  <th className="px-4 py-4">Skewness</th>
                </tr>
              </thead>
              <tbody>
                {stats.table.map((row) => (
                  <tr key={row.feature} className="border-t border-slate-800/80">
                    <td className="px-4 py-3 font-medium text-white">{row.feature}</td>
                    <td className="px-4 py-3">{row.mean}</td>
                    <td className="px-4 py-3">{row.median}</td>
                    <td className="px-4 py-3">{row.std}</td>
                    <td className="px-4 py-3">{row.min}</td>
                    <td className="px-4 py-3">{row.max}</td>
                    <td className="px-4 py-3">{row.skewness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function CorrelationHighlights({ strongestPositive, strongestNegative }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
        <h3 className="text-lg font-semibold text-white">Strongest Positive Correlations with Quality</h3>
        <div className="mt-4 space-y-3">
          {strongestPositive.map((item) => (
            <div key={item.feature} className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
              <span className="text-sm text-slate-200">{item.feature}</span>
              <span className="text-sm font-semibold text-cyan-300">{item.correlation_with_quality}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
        <h3 className="text-lg font-semibold text-white">Strongest Negative Correlations with Quality</h3>
        <div className="mt-4 space-y-3">
          {strongestNegative.map((item) => (
            <div key={item.feature} className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
              <span className="text-sm text-slate-200">{item.feature}</span>
              <span className="text-sm font-semibold text-rose-300">{item.correlation_with_quality}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
