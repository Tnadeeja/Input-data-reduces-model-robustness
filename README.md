# Noise in Input Data Reduces Model Robustness

Professional React-based interactive visualization dashboard backed by a real Python analysis pipeline on the Red Wine Quality dataset.

## Project Structure

```text
project-root/
├── analysis/
│   └── generate_results.py
├── data/
│   └── winequality-red.csv
├── public/
│   └── results/
│       ├── correlation_matrix.json
│       ├── dataset_summary.json
│       ├── descriptive_stats.json
│       ├── feature_decay.json
│       ├── model_results.json
│       ├── noise_results.json
│       └── statistical_tests.json
├── src/
│   ├── App.jsx
│   ├── dataLoader.js
│   ├── index.css
│   ├── main.jsx
│   └── components/
└── package.json
```

## Setup

Step 1:
Place dataset at `data/winequality-red.csv`

Step 2:
Install Python dependencies:

```bash
pip install pandas numpy scikit-learn scipy
```

Step 3:
Run analysis:

```bash
python analysis/generate_results.py
```

Step 4:
Install React dependencies:

```bash
npm install
```

Step 5:
Run dashboard:

```bash
npm run dev
```

## Important

The React dashboard does not run fake analysis. All values come from generated JSON files created from the real CSV inside `public/results/`.

If the JSON files are missing, the dashboard shows:

`Run python analysis/generate_results.py first to generate results.`
