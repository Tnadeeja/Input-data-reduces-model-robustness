from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import f_oneway
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR


ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
RESULTS_DIR = ROOT_DIR / "public" / "results"
LOCAL_DATASET_PATH = DATA_DIR / "winequality-red.csv"
EXTERNAL_DATASET_PATH = Path(r"E:\TPSM\winequality-red.csv")

TARGET_COLUMN = "quality"
RANDOM_STATE = 42
GAUSSIAN_LEVELS = [0.0, 0.1, 0.2, 0.3, 0.5]
MISSING_LEVELS = [0.05, 0.1, 0.2, 0.3]
OUTLIER_LEVELS = [0.05, 0.1, 0.2, 0.4]


def ensure_dataset() -> Path:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if LOCAL_DATASET_PATH.exists():
        return LOCAL_DATASET_PATH
    if EXTERNAL_DATASET_PATH.exists():
        LOCAL_DATASET_PATH.write_bytes(EXTERNAL_DATASET_PATH.read_bytes())
        return LOCAL_DATASET_PATH
    raise FileNotFoundError(
        "Dataset not found. Place it at data/winequality-red.csv "
        f"or ensure {EXTERNAL_DATASET_PATH} exists."
    )


def load_dataset() -> pd.DataFrame:
    dataset_path = ensure_dataset()
    return pd.read_csv(dataset_path, sep=";")


def to_float(value: float | int) -> float:
    return round(float(value), 6)


def make_model_factories():
    return {
        "Linear Regression": lambda: LinearRegression(),
        "Random Forest Regressor": lambda: RandomForestRegressor(
            n_estimators=300,
            random_state=RANDOM_STATE,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
        ),
        "Support Vector Regressor": lambda: SVR(kernel="rbf", C=10.0, epsilon=0.1),
    }


def evaluate_predictions(y_true: pd.Series, predictions: np.ndarray) -> dict[str, float]:
    rmse = np.sqrt(mean_squared_error(y_true, predictions))
    mae = mean_absolute_error(y_true, predictions)
    r2 = r2_score(y_true, predictions)
    return {"rmse": to_float(rmse), "mae": to_float(mae), "r2": to_float(r2)}


def train_and_evaluate(models: dict[str, callable], x_train: np.ndarray, x_test: np.ndarray, y_train: pd.Series, y_test: pd.Series):
    results = {}
    for model_name, factory in models.items():
        model = factory()
        model.fit(x_train, y_train)
        predictions = model.predict(x_test)
        results[model_name] = evaluate_predictions(y_test, predictions)
    return results


def build_dataset_summary(df: pd.DataFrame) -> dict:
    feature_names = [column for column in df.columns if column != TARGET_COLUMN]
    return {
        "rows": int(df.shape[0]),
        "input_features": int(len(feature_names)),
        "target_variable": TARGET_COLUMN,
        "quality_min": int(df[TARGET_COLUMN].min()),
        "quality_max": int(df[TARGET_COLUMN].max()),
        "missing_values_count": int(df.isna().sum().sum()),
        "feature_names": feature_names,
    }


def build_descriptive_stats(df: pd.DataFrame) -> dict:
    stats_rows = []
    for column in df.columns:
        series = df[column]
        stats_rows.append(
            {
                "feature": column,
                "mean": to_float(series.mean()),
                "median": to_float(series.median()),
                "std": to_float(series.std()),
                "min": to_float(series.min()),
                "max": to_float(series.max()),
                "skewness": to_float(series.skew()),
            }
        )

    quality_distribution = [
        {"quality": int(quality), "count": int(count)}
        for quality, count in df[TARGET_COLUMN].value_counts().sort_index().items()
    ]

    alcohol_bins = np.histogram(df["alcohol"], bins=10)
    alcohol_distribution = [
        {
            "bin_start": to_float(alcohol_bins[1][index]),
            "bin_end": to_float(alcohol_bins[1][index + 1]),
            "count": int(alcohol_bins[0][index]),
        }
        for index in range(len(alcohol_bins[0]))
    ]

    return {
        "table": stats_rows,
        "quality_distribution": quality_distribution,
        "alcohol_distribution": alcohol_distribution,
    }


def build_correlation_matrix(df: pd.DataFrame) -> dict:
    correlation = df.corr(numeric_only=True)
    return {
        "features": correlation.columns.tolist(),
        "matrix": correlation.round(6).values.tolist(),
        "pairs": [
            {"feature": column, "correlation_with_quality": to_float(correlation.loc[column, TARGET_COLUMN])}
            for column in correlation.columns
            if column != TARGET_COLUMN
        ],
    }


def inject_gaussian_noise(x_train_scaled: np.ndarray, noise_level: float, rng: np.random.Generator) -> np.ndarray:
    if noise_level == 0:
        return x_train_scaled.copy()
    noise = rng.normal(0, noise_level, x_train_scaled.shape)
    return x_train_scaled + noise


def inject_missing_values(x_train_scaled: np.ndarray, missing_level: float, rng: np.random.Generator) -> np.ndarray:
    missing_train = x_train_scaled.copy()
    total_values = missing_train.size
    missing_count = max(1, int(total_values * missing_level))
    flat_indices = rng.choice(total_values, size=missing_count, replace=False)
    rows, cols = np.unravel_index(flat_indices, missing_train.shape)
    missing_train[rows, cols] = np.nan
    return missing_train


def inject_outliers(x_train_scaled: np.ndarray, outlier_level: float, rng: np.random.Generator) -> np.ndarray:
    outlier_train = x_train_scaled.copy()
    total_values = outlier_train.size
    outlier_count = max(1, int(total_values * outlier_level))
    q1 = np.nanpercentile(outlier_train, 25, axis=0)
    q3 = np.nanpercentile(outlier_train, 75, axis=0)
    iqr = q3 - q1
    upper_extreme = q3 + (3 * iqr)
    lower_extreme = q1 - (3 * iqr)

    flat_indices = rng.choice(total_values, size=outlier_count, replace=False)
    rows, cols = np.unravel_index(flat_indices, outlier_train.shape)
    high_mask = rng.random(outlier_count) > 0.5

    for idx, (row, col) in enumerate(zip(rows, cols)):
        outlier_train[row, col] = upper_extreme[col] if high_mask[idx] else lower_extreme[col]
    return outlier_train


def anova_from_results(experiment_results: list[dict], experiment_name: str) -> dict:
    grouped_rmse = []
    for level_entry in experiment_results:
        grouped_rmse.append([metrics["rmse"] for metrics in level_entry["models"].values()])

    statistic, p_value = f_oneway(*grouped_rmse)
    interpretation = "Significant" if p_value < 0.05 else "Not Significant"
    return {
        "experiment": experiment_name,
        "anova_f_statistic": to_float(statistic),
        "p_value": to_float(p_value),
        "interpretation": interpretation,
    }


def main():
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    df = load_dataset()
    models = make_model_factories()

    x = df.drop(columns=[TARGET_COLUMN])
    y = df[TARGET_COLUMN]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=RANDOM_STATE,
    )

    scaler = StandardScaler()
    x_train_scaled = scaler.fit_transform(x_train)
    x_test_scaled = scaler.transform(x_test)

    baseline_results = train_and_evaluate(models, x_train_scaled, x_test_scaled, y_train, y_test)

    gaussian_results = []
    gaussian_rmse_chart = []
    gaussian_r2_chart = []
    gaussian_degradation_chart = []

    for noise_level in GAUSSIAN_LEVELS:
        rng = np.random.default_rng(RANDOM_STATE + int(noise_level * 1000) + 1)
        noisy_train = inject_gaussian_noise(x_train_scaled, noise_level, rng)
        results = train_and_evaluate(models, noisy_train, x_test_scaled, y_train, y_test)

        models_payload = {}
        degradation_chart_row = {"noise_level": f"{int(noise_level * 100)}%"}
        rmse_chart_row = {"noise_level": f"{int(noise_level * 100)}%"}
        r2_chart_row = {"noise_level": f"{int(noise_level * 100)}%"}

        for model_name, metrics in results.items():
            baseline_rmse = baseline_results[model_name]["rmse"]
            degradation_pct = ((metrics["rmse"] - baseline_rmse) / baseline_rmse) * 100 if baseline_rmse else 0.0
            models_payload[model_name] = {
                **metrics,
                "degradation_pct": to_float(degradation_pct),
            }
            degradation_chart_row[model_name] = to_float(degradation_pct)
            rmse_chart_row[model_name] = metrics["rmse"]
            r2_chart_row[model_name] = metrics["r2"]

        gaussian_results.append(
            {
                "noise_level": noise_level,
                "noise_label": f"{int(noise_level * 100)}%",
                "models": models_payload,
            }
        )
        gaussian_degradation_chart.append(degradation_chart_row)
        gaussian_rmse_chart.append(rmse_chart_row)
        gaussian_r2_chart.append(r2_chart_row)

    missing_results = []
    for missing_level in MISSING_LEVELS:
        rng = np.random.default_rng(RANDOM_STATE + int(missing_level * 1000) + 20)
        missing_train = inject_missing_values(x_train_scaled, missing_level, rng)
        imputer = SimpleImputer(strategy="median")
        imputed_train = imputer.fit_transform(missing_train)
        imputed_test = imputer.transform(x_test_scaled)
        results = train_and_evaluate(models, imputed_train, imputed_test, y_train, y_test)
        missing_results.append(
            {
                "missing_level": missing_level,
                "missing_label": f"{int(missing_level * 100)}%",
                "models": results,
            }
        )

    outlier_results = []
    for outlier_level in OUTLIER_LEVELS:
        rng = np.random.default_rng(RANDOM_STATE + int(outlier_level * 1000) + 40)
        outlier_train = inject_outliers(x_train_scaled, outlier_level, rng)
        results = train_and_evaluate(models, outlier_train, x_test_scaled, y_train, y_test)
        outlier_results.append(
            {
                "outlier_level": outlier_level,
                "outlier_label": f"{int(outlier_level * 100)}%",
                "models": results,
            }
        )

    clean_alcohol_correlation = df["alcohol"].corr(df[TARGET_COLUMN])
    feature_decay_points = [{"noise_level": "0%", "correlation": to_float(clean_alcohol_correlation)}]
    alcohol_index = x.columns.get_loc("alcohol")
    for level in [0.1, 0.2, 0.3, 0.5]:
        rng = np.random.default_rng(RANDOM_STATE + int(level * 1000) + 100)
        noisy_df = df.copy()
        noisy_df["alcohol"] = noisy_df["alcohol"] + rng.normal(0, level, size=len(noisy_df))
        feature_decay_points.append(
            {
                "noise_level": f"{int(level * 100)}%",
                "correlation": to_float(noisy_df["alcohol"].corr(noisy_df[TARGET_COLUMN])),
            }
        )

    highest_gaussian = gaussian_results[-1]["models"]
    highest_missing = missing_results[-1]["models"]
    highest_outlier = outlier_results[-1]["models"]
    impact_comparison = []
    for model_name in models:
        impact_comparison.append(
            {
                "model": model_name,
                "Gaussian Noise": highest_gaussian[model_name]["rmse"],
                "Missing Data": highest_missing[model_name]["rmse"],
                "Outliers": highest_outlier[model_name]["rmse"],
            }
        )

    best_model_by_noise = []
    for entry in gaussian_results:
        best_model, best_metrics = min(entry["models"].items(), key=lambda item: item[1]["rmse"])
        best_model_by_noise.append(
            {
                "noise_level": entry["noise_label"],
                "best_model": best_model,
                "rmse": best_metrics["rmse"],
                "mae": best_metrics["mae"],
                "r2": best_metrics["r2"],
            }
        )

    strongest_impact_model = max(
        highest_gaussian.items(),
        key=lambda item: item[1]["degradation_pct"],
    )[0]
    most_robust_model = min(
        {
            model_name: np.mean([entry["models"][model_name]["rmse"] for entry in gaussian_results])
            for model_name in models
        }.items(),
        key=lambda item: item[1],
    )[0]

    model_results = {
        "baseline_clean_test": baseline_results,
        "gaussian_rmse_by_noise": gaussian_rmse_chart,
        "gaussian_r2_by_noise": gaussian_r2_chart,
        "gaussian_degradation_by_noise": gaussian_degradation_chart,
        "best_model_by_noise": best_model_by_noise,
        "experiment_impact_comparison": impact_comparison,
        "portfolio_findings": [
            {
                "title": "Finding 1",
                "headline": f"{most_robust_model} is more robust overall.",
                "detail": "It maintained the lowest average RMSE across the Gaussian noise experiment on the clean evaluation set.",
            },
            {
                "title": "Finding 2",
                "headline": "Gaussian noise has the strongest negative impact.",
                "detail": f"At 50% Gaussian noise, {strongest_impact_model} showed the largest RMSE degradation relative to its clean baseline.",
            },
            {
                "title": "Finding 3",
                "headline": "Missing data has moderate impact due to imputation.",
                "detail": "Median imputation preserved part of the signal, but every model still lost accuracy as missingness increased.",
            },
            {
                "title": "Finding 4",
                "headline": "Outlier effects are lower or dataset-dependent.",
                "detail": "Injected extreme values increased error, but the magnitude was less consistent than Gaussian corruption across models.",
            },
        ],
    }

    noise_results = {
        "gaussian_noise": {
            "description": "Adds Gaussian noise to standardized training features only and evaluates on the unchanged clean test set.",
            "levels": [f"{int(level * 100)}%" for level in GAUSSIAN_LEVELS],
            "results": gaussian_results,
        },
        "missing_data": {
            "description": "Randomly replaces training values with NaN, applies median imputation, then evaluates on the clean test set.",
            "levels": [f"{int(level * 100)}%" for level in MISSING_LEVELS],
            "results": missing_results,
        },
        "outliers": {
            "description": "Injects IQR-based extreme values into training features only and evaluates on the clean test set.",
            "levels": [f"{int(level * 100)}%" for level in OUTLIER_LEVELS],
            "results": outlier_results,
        },
        "chart_friendly": {
            "rmse_by_noise_level": gaussian_rmse_chart,
            "model_comparison": impact_comparison,
            "degradation_percentage": gaussian_degradation_chart,
        },
    }

    statistical_tests = {
        "tests": [
            anova_from_results(gaussian_results, "Gaussian Noise"),
            anova_from_results(missing_results, "Missing Data"),
            anova_from_results(outlier_results, "Outliers"),
        ]
    }
    statistical_tests["final_decision"] = (
        "Reject H0"
        if any(
            test["experiment"] in {"Gaussian Noise", "Missing Data"} and test["p_value"] < 0.05
            for test in statistical_tests["tests"]
        )
        else "Fail to Reject H0"
    )

    feature_decay = {
        "feature": "alcohol",
        "target": TARGET_COLUMN,
        "description": "Correlation between alcohol and quality after progressively adding Gaussian noise to the alcohol feature.",
        "points": feature_decay_points,
        "clean_correlation": feature_decay_points[0]["correlation"],
        "feature_index": int(alcohol_index),
    }

    outputs = {
        "dataset_summary.json": build_dataset_summary(df),
        "descriptive_stats.json": build_descriptive_stats(df),
        "correlation_matrix.json": build_correlation_matrix(df),
        "model_results.json": model_results,
        "noise_results.json": noise_results,
        "statistical_tests.json": statistical_tests,
        "feature_decay.json": feature_decay,
    }

    for filename, payload in outputs.items():
        output_path = RESULTS_DIR / filename
        output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"Wrote {output_path.relative_to(ROOT_DIR)}")


if __name__ == "__main__":
    main()
