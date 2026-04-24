import { useEffect, useState } from "react";
import { loadDashboardData } from "./dataLoader";
import HeroSection from "./components/HeroSection";
import DatasetOverview from "./components/DatasetOverview";
import DescriptiveAnalysis from "./components/DescriptiveAnalysis";
import Methodology from "./components/Methodology";
import NoiseSimulator from "./components/NoiseSimulator";
import ResultsCharts from "./components/ResultsCharts";
import StatisticalEvidence from "./components/StatisticalEvidence";
import FeatureSignalDecay from "./components/FeatureSignalDecay";
import Conclusion from "./components/Conclusion";

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-8 py-6 text-center shadow-2xl shadow-slate-950/60">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Loading analysis</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Preparing the robustness dashboard...</h1>
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-200">
      <div className="max-w-xl rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/70">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Missing results</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{message}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          This dashboard reads real generated JSON outputs from <code>public/results/</code>. No fake analysis is used.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    let active = true;
    loadDashboardData().then((result) => {
      if (active) {
        setState({ ...result, loading: false });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return <LoadingState />;
  }

  if (state.error || !state.data) {
    return <ErrorState message={state.error} />;
  }

  const {
    dataset_summary: datasetSummary,
    descriptive_stats: descriptiveStats,
    correlation_matrix: correlationMatrix,
    model_results: modelResults,
    noise_results: noiseResults,
    statistical_tests: statisticalTests,
    feature_decay: featureDecay,
  } = state.data;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_38%),linear-gradient(180deg,_#020617_0%,_#0f172a_38%,_#e2e8f0_100%)] text-slate-900">
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <HeroSection />
        <DatasetOverview summary={datasetSummary} />
        <DescriptiveAnalysis stats={descriptiveStats} correlationMatrix={correlationMatrix} />
        <Methodology />
        <NoiseSimulator noiseResults={noiseResults} modelResults={modelResults} />
        <ResultsCharts noiseResults={noiseResults} modelResults={modelResults} />
        <FeatureSignalDecay featureDecay={featureDecay} />
        <StatisticalEvidence statisticalTests={statisticalTests} />
        <Conclusion findings={modelResults.portfolio_findings} />
      </main>
    </div>
  );
}

