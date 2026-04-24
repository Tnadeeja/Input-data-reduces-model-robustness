import { motion } from "framer-motion";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function FeatureSignalDecay({ featureDecay }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card rounded-[2rem] p-8 text-slate-100"
    >
      <p className="section-kicker">Correlation and Signal Decay</p>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="section-title">Alcohol vs quality weakens as noise increases</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Noise weakens the real relationship between input features and target. Here, the correlation between alcohol
            and quality decays as Gaussian corruption is added specifically to the alcohol feature.
          </p>
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Clean correlation</p>
            <p className="mt-3 text-3xl font-semibold text-white">{featureDecay.clean_correlation}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-5">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={featureDecay.points}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="noise_level" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="correlation" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

