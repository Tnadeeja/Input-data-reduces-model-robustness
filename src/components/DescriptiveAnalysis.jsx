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

const qualityColors = ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#0f766e", "#0891b2"];

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
      className="report-section rounded-[2rem] px-6 py-10 sm:px-8"
    >
      <p className="section-kicker">Descriptive Analysis</p>
      <div className="mt-4 flex flex-col gap-6">
        <div>
          <h2 className="section-title">Feature distributions and descriptive statistics</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Every value shown here is generated from the real red wine CSV and exported by the Python analysis script.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="report-card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Quality Distribution</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.quality_distribution}>
                  <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
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

          <div className="report-card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Alcohol Distribution</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.alcohol_distribution}>
                  <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
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
                  <Bar dataKey="count" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <CorrelationHighlights strongestPositive={strongestPositive} strongestNegative={strongestNegative} />

        <div className="table-shell">
          <div className="max-h-[32rem] overflow-auto">
            <table className="report-table min-w-full text-sm">
              <thead className="sticky top-0 text-left text-xs uppercase tracking-[0.2em]">
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
                  <tr key={row.feature} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.feature}</td>
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
      <div className="report-card p-5">
        <h3 className="text-lg font-semibold text-slate-900">Strongest Positive Correlations with Quality</h3>
        <div className="mt-4 space-y-3">
          {strongestPositive.map((item) => (
            <div key={item.feature} className="flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3">
              <span className="text-sm text-slate-700">{item.feature}</span>
              <span className="text-sm font-semibold text-blue-600">{item.correlation_with_quality}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="report-card p-5">
        <h3 className="text-lg font-semibold text-slate-900">Strongest Negative Correlations with Quality</h3>
        <div className="mt-4 space-y-3">
          {strongestNegative.map((item) => (
            <div key={item.feature} className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-3">
              <span className="text-sm text-slate-700">{item.feature}</span>
              <span className="text-sm font-semibold text-rose-500">{item.correlation_with_quality}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
