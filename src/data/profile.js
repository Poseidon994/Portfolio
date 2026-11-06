// All site copy lives in this file. Edit it to update the site without touching components.
// Everything here is taken from the resume (Om_Bharadwaj_Resume.pdf in /public).
// The Solar project is not on the latest resume; it stays on the site and has no repository link.

const base = import.meta.env.BASE_URL

export const profile = {
  name: 'Om Bharadwaj',
  role: 'Software engineer and applied AI developer.',
  intro:
    'I build machine-learning systems that explain their predictions, and the full-stack products that put them in front of users.',
  email: 'bharadwajom07@gmail.com',
  location: 'Jamshedpur, India',
  links: {
    github: 'https://github.com/Poseidon994',
    linkedin: 'https://www.linkedin.com/in/om-bharadwaj-916b802a5/',
    kaggle: 'https://www.kaggle.com/ombharadwaj994',
    leetcode: 'https://leetcode.com/u/Poseidon994/',
    resume: `${base}Om_Bharadwaj_Resume_V7_Natoe.pdf`,
  },
}

export const about = {
  school: 'Indian Institute of Information Technology Manipur, Imphal',
  heading: 'Computer science undergraduate at IIIT Manipur',
  degree: 'B.Tech in Computer Science & Engineering (AI & Data Science), 2023 to 2027 (expected).',
  body: [
    'I build models and then ship them as working products. Ocula and Cutis each run as four Docker Compose services, not as notebooks.',
    'Ocula, my diabetic retinopathy screening platform, is the basis of a first-author paper under review at an IEEE conference. Cutis screens skin lesions on ISIC 2024, and at Tata Technologies I built an enterprise CRM portal.',
    'I am looking for software engineering, backend, or applied AI roles.',
  ],
  cgpa: {
    value: 9.05,
    outOf: 10,
    note: 'Top 5% of the cohort, across five semesters.',
  },
}

// `wide` groups take the full width of the skills tile on large screens.
export const skillGroups = [
  { label: 'Languages', items: ['Python', 'JavaScript', 'C++', 'Java', 'SQL', 'PHP', 'C'] },
  { label: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'] },
  {
    label: 'Backend and web',
    wide: true,
    items: [
      'FastAPI',
      'Node.js',
      'Express.js',
      'PHP',
      'REST APIs',
      'Microservices',
      'JWT auth',
      'Role-based access control',
      'React.js',
    ],
  },
  {
    label: 'Machine learning',
    items: [
      'PyTorch',
      'scikit-learn',
      'XGBoost',
      'LightGBM',
      'CatBoost',
      'Random Forest',
      'SVM',
      'ADASYN',
      'Pandas',
      'NumPy',
    ],
  },
  {
    label: 'Models',
    items: ['EfficientNet-B4', 'ResNet-18', 'DenseNet-121', 'GoogLeNet', 'ConvNeXt', 'Swin-T', 'EdgeNeXt', 'EVA02'],
  },
  { label: 'Explainability and LLMs', items: ['Grad-CAM', 'LIME', 'SHAP', 'Groq API', 'Gemini API'] },
  { label: 'DevOps', items: ['Docker', 'Docker Compose', 'Git', 'GitHub', 'CI/CD', 'Render'] },
  {
    label: 'Fundamentals',
    wide: true,
    items: [
      'Data structures and algorithms',
      'OOP',
      'DBMS',
      'Operating systems',
      'Computer networks',
      'System design',
    ],
  },
]

export const leadership = {
  gdg: {
    title: 'GDG On Campus chapter lead',
    org: 'IIIT Manipur',
    body: "Selected through Google's competitive process.",
    reach: 1200,
    events: ['Study Jams', 'Workshops', 'Developer events'],
  },
  gfg: {
    title: 'GeeksforGeeks campus ambassador',
    org: 'IIIT Manipur',
    body: 'I connect students with technical resources and competitive programming initiatives, and I solve problems regularly on',
    link: { label: 'LeetCode', href: profile.links.leetcode },
  },
}

export const experience = {
  role: 'Software Engineering Intern',
  company: 'Tata Technologies',
  period: 'May 2026 to July 2026',
  place: 'Jamshedpur, Jharkhand, India',
  summary:
    'Worked in an agile team on an enterprise CRM portal that large clients use to manage their customer relationships. My work covered all three layers.',
  layers: [
    {
      id: 'ui',
      tech: 'React.js',
      layer: 'Frontend',
      point: 'Built a responsive React.js frontend with dashboards, charts and real-time notifications.',
    },
    {
      id: 'api',
      tech: 'PHP',
      layer: 'REST API',
      point:
        'Wrote REST APIs in PHP with role-based access control, authentication middleware and automated reporting.',
    },
    {
      id: 'db',
      tech: 'MySQL',
      layer: 'Database',
      point:
        'Designed MySQL schemas with normalized tables, indexed queries and stored procedures so the system could scale.',
    },
  ],
}

// A project shows a "View on GitHub" link only when it has a `repo`.
export const projects = [
  {
    id: 'retinopathy',
    name: 'Ocula',
    title: 'Diabetic retinopathy screening platform',
    summary:
      'A full-stack platform that screens retinal images for diabetic retinopathy, grades the severity, and shows where in the image the model looked.',
    metrics: [
      { value: '98.50%', label: 'Binary accuracy on APTOS 2019, AUC 0.997' },
      { value: '90.68%', label: 'Five-class accuracy, 1.39 points above the Butt et al. (2022) baseline' },
      { value: '<45 s', label: 'For a full prediction with explanations, on CPU' },
    ],
    pipeline: [
      'Retinal image',
      'Five CNN backbones, 8-view test-time augmentation',
      'SVM, RF and XGBoost soft voting',
      'Hierarchical SVM cascade for the five-class grade',
      'Grad-CAM, LIME, SHAP and Groq LLaMA-3 reports',
    ],
    highlights: [
      'Built a full-stack screening platform. On APTOS 2019 it reaches 98.50% binary accuracy (AUC 0.997) and 90.68% five-class accuracy, which is 0.70 and 1.39 points above the published Butt et al. (2022) baseline. The work is the basis of my first-author paper under review at an IEEE conference.',
      'Ensembled five CNN backbones (ResNet-18, GoogLeNet, EfficientNet-B4, DenseNet-121, ConvNeXt-Tiny) with 8-view test-time augmentation and soft-voting classical classifiers (SVM, RF, XGBoost). Binary accuracy rose 1.38 points over the best single backbone.',
      'Designed a two-level hierarchical SVM cascade with ADASYN oversampling for five-class grading. It gained 1.27 points over a flat classifier and lifted recall on the minority Severe DR class from 0.79 to 0.82.',
      'Added Grad-CAM, LIME and SHAP explanations plus two Groq LLaMA-3 reports (clinical and patient); a full prediction with explanations takes under 45 seconds on CPU.',
      'Deployed as four Docker Compose services (React, Node.js/Express, FastAPI, PostgreSQL) with JWT auth and role-based access, on a validated clinical dataset of 3,662 images.',
    ],
    stack: ['Python', 'PyTorch', 'FastAPI', 'Node.js/Express', 'React', 'PostgreSQL', 'Docker'],
    repo: 'https://github.com/Poseidon994/XAI-Powered-Diagnosis-Platform-for-Eye-Disease-Diabetic-Retinopathy-Analysis',
  },
  {
    id: 'cutis',
    name: 'Cutis',
    title: 'Skin lesion screening platform',
    summary:
      'A two-stage skin-cancer risk pipeline on ISIC 2024. A fast tabular gate clears half of the lesions, and a CNN ensemble scores the rest.',
    metrics: [
      { value: '0.958', label: 'AUROC with patient-grouped 5-fold validation' },
      { value: '0.165', label: 'pAUC (≥80% TPR) with the same validation' },
      { value: '98.7%', label: 'Malignant recall while the gate clears 50% of lesions' },
    ],
    pipeline: [
      'Lesion image and 153 tabular features',
      'Tabular gate: LightGBM, XGBoost, CatBoost',
      '4-backbone CNN ensemble for the rest',
      'Stage-2 LightGBM fusion',
      'Risk tier, Grad-CAM, LIME, SHAP, Groq report',
    ],
    highlights: [
      'Built a skin-cancer risk pipeline on ISIC 2024 (401,059 lesions, 393 malignant, 1,042 patients). With patient-grouped 5-fold validation it reaches AUROC 0.958 and pAUC (≥80% TPR) 0.165. A late Kaggle submission scored 0.174 public and 0.160 private.',
      'Designed a two-stage cascade. A tabular GBDT gate (LightGBM, XGBoost, CatBoost on 153 features, including patient-context features) clears 50% of lesions at 98.7% malignant recall. The rest go to a 4-backbone CNN ensemble (ConvNeXt-Tiny, Swin-T, EdgeNeXt, EVA02; 5 folds each) fused by a stage-2 LightGBM.',
      'Ran a leakage audit showing how image-level splits inflate results (97.6% vs 64.0% patient-grouped nearest-neighbour accuracy). Used paired bootstrap CIs and leave-one-institution-out validation, and reported the honest numbers instead of augment-then-split ones.',
      'Deployed as four Docker Compose services (React, Node.js/Express, FastAPI, SQLite) with role-based access for patients and clinicians. Each scan gets Grad-CAM, LIME and SHAP explanations in parallel, a role-specific Groq LLM report, scan history with trend and a PDF download.',
      'Added safeguards: patients never see raw scores or cancer types, the LLM never receives the photo or patient ID, and urgency text follows the risk tier with a template fallback. Covered by 51 automated tests.',
    ],
    stack: ['Python', 'PyTorch', 'LightGBM', 'FastAPI', 'Node.js/Express', 'React', 'SQLite', 'Docker'],
    repo: 'https://github.com/Poseidon994/Cutis--XAI-Powered-Skin-Lesion-Detection-App',
  },
  {
    id: 'solar',
    title: 'AI-powered solar power output prediction',
    summary:
      'Weather data and time-aware features feed three benchmarked models. The best one by RMSE and R² is served as a REST API.',
    pipeline: ['Weather inputs', 'Time-aware features', 'Random Forest, XGBoost, LightGBM', 'Grid search, RMSE, R²', 'REST API'],
    highlights: [
      'Engineered time-aware features (hour of day, seasonality, solar angle proxies) from meteorological inputs: irradiance, temperature, humidity, cloud cover, and wind speed.',
      'Trained and benchmarked Random Forest, XGBoost, and LightGBM with cross-validated grid search.',
      'Selected the best model by RMSE and R², outperforming all baseline models.',
      'Containerized the full stack with Docker and deployed it as a REST API (FastAPI and Express.js backend, React.js frontend) for reproducible production inference.',
    ],
    stack: ['Python', 'XGBoost', 'LightGBM', 'Random Forest', 'FastAPI', 'Express.js', 'React.js', 'Docker', 'Pandas', 'NumPy'],
  },
]
