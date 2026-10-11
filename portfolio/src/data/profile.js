// All site copy lives in this file. Edit it to update the site without touching components.
// Everything here is taken from the resume (Om_Bharadwaj_Resume.pdf in /public).

const base = import.meta.env.BASE_URL

export const profile = {
  name: 'Om Bharadwaj',
  role: 'Software engineer and applied AI developer.',
  intro:
    'I build machine-learning systems that explain their predictions, and the full-stack products that put them in front of users.',
  email: 'bharadwajom07@gmail.com',
  links: {
    github: 'https://github.com/Poseidon994',
    linkedin: 'https://linkedin.com/in/om-bharadwaj-916b802a5',
    resume: `${base}Om_Bharadwaj_Resume.pdf`,
  },
}

export const about = {
  school: 'Indian Institute of Information Technology Manipur, Imphal',
  heading: 'Computer science student at IIIT Manipur',
  degree: 'B.Tech in Computer Science & Engineering (AI & Data Science), 2023 to 2027 (expected).',
  body: [
    'I build full-stack products and machine-learning systems, and I finish them: both of my AI projects run as containerized REST APIs, not as notebooks.',
    'I am looking for software engineering, applied AI, or backend roles where I can build scalable, high-impact systems.',
  ],
  cgpa: {
    value: 9.05,
    outOf: 10,
    note: 'Top 4% of a 228-student cohort, across five semesters.',
  },
}

export const skillGroups = [
  { label: 'Languages', items: ['Python', 'JavaScript', 'C++', 'Java', 'SQL', 'PHP', 'C'] },
  {
    label: 'Frontend and backend',
    items: ['React.js', 'FastAPI', 'Express.js', 'Node.js', 'PHP', 'REST APIs', 'Microservices'],
  },
  { label: 'Databases', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'] },
  { label: 'DevOps and tools', items: ['Docker', 'Git', 'GitHub', 'CI/CD', 'Render'] },
  {
    label: 'AI and machine learning',
    wide: true,
    items: [
      'PyTorch',
      'scikit-learn',
      'EfficientNet-B4',
      'ResNet-18',
      'GoogLeNet',
      'DenseNet-121',
      'XGBoost',
      'LightGBM',
      'Random Forest',
      'SVM',
      'Grad-CAM',
      'LIME',
      'SHAP',
      'Gemini API',
      'Groq API',
      'Pandas',
      'NumPy',
      'Matplotlib',
    ],
  },
  {
    label: 'CS fundamentals',
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
    body: "Selected through Google's competitive process, which evaluates technical depth and community leadership.",
    reach: 1200,
    events: ['Study Jams', 'Workshops', 'Developer events'],
  },
  gfg: {
    title: 'GeeksforGeeks campus ambassador',
    org: 'IIIT Manipur',
    body: 'I connect students with technical resources, competitive programming initiatives, and industry learning opportunities on campus.',
  },
}

export const experience = {
  role: 'Software Engineering Intern',
  company: 'Tata Technologies',
  period: 'May 2026 to July 2026',
  place: 'Remote',
  summary:
    'I developed an enterprise CRM portal in an agile team, to streamline customer relationship management workflows for large-scale clients. My work covered all three layers.',
  layers: [
    {
      id: 'ui',
      tech: 'React.js',
      layer: 'Frontend',
      point:
        'Built a responsive React.js frontend with dynamic dashboards, data visualization components, and real-time notification modules.',
    },
    {
      id: 'api',
      tech: 'PHP',
      layer: 'REST API',
      point:
        'Engineered secure REST APIs in PHP with role-based access control (RBAC), authentication middleware, and automated report generation.',
    },
    {
      id: 'db',
      tech: 'MySQL',
      layer: 'Database',
      point:
        'Designed optimized MySQL schemas using normalized tables, indexed queries, and stored procedures for scalable data operations.',
    },
  ],
}

// The resume's project links both point at the GitHub profile root.
// Replace `repo` with the exact repository URL when you have it.
export const projects = [
  {
    id: 'retinopathy',
    title: 'Diabetic retinopathy detection with explainable AI',
    summary:
      'A hybrid CNN ensemble and SVM that grades retinopathy severity from retinal images, and shows where in the image it looked.',
    pipeline: ['Retinal image', 'Four CNN backbones', 'SVM grading', 'Grad-CAM, LIME, SHAP', 'LLM patient report'],
    highlights: [
      'Architected a hybrid CNN ensemble and SVM pipeline on the APTOS 2019 dataset for binary and five-class severity grading.',
      'Applied five-view test-time augmentation and PDR class-weight boosting to address severe class imbalance across severity grades.',
      'Integrated Grad-CAM, LIME, and SHAP for localized saliency maps and clinical interpretability.',
      'Automated structured patient reports through the Gemini and Groq LLM APIs, with feature caching to avoid redundant CNN inference.',
      'Deployed end to end as a containerized application (FastAPI, Express.js, React.js, Docker) for reproducible clinical inference.',
    ],
    stack: [
      'Python',
      'PyTorch',
      'EfficientNet-B4',
      'ResNet-18',
      'GoogLeNet',
      'DenseNet-121',
      'SVM',
      'FastAPI',
      'React.js',
      'Docker',
    ],
    repo: 'https://github.com/Poseidon994',
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
    repo: 'https://github.com/Poseidon994',
  },
]
