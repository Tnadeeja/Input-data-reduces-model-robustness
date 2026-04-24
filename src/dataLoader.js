const RESULT_FILES = [
  "dataset_summary",
  "descriptive_stats",
  "correlation_matrix",
  "model_results",
  "noise_results",
  "statistical_tests",
  "feature_decay",
];

export async function loadDashboardData() {
  try {
    const entries = await Promise.all(
      RESULT_FILES.map(async (name) => {
        const response = await fetch(`/results/${name}.json`);
        if (!response.ok) {
          throw new Error(`Missing result file: ${name}.json`);
        }
        return [name, await response.json()];
      }),
    );

    return {
      data: Object.fromEntries(entries),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Run python analysis/generate_results.py first to generate results.",
    };
  }
}

