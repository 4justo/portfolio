/**
 * ============================================================
 *  PORTFOLIO OS — CONFIG
 *  Edit THIS FILE ONLY to update your entire site.
 *  No component code needs to change.
 * ============================================================
 */
const CONFIG = {
  // ---- Identity ----
  githubUsername: "your-github-username", // <-- CHANGE THIS. Everything in Projects/GitHub/Stats is fetched live from this.
  name: "Symon",
  handle: "@symon",
  role: "Full-Stack Engineer · AI/ML Engineer",
  location: "Nairobi, Kenya",
  timezone: "GMT+3",
  languagesSpoken: ["English", "Swahili"],
  availability: "Open to freelance & full-time roles",
  email: "you@example.com",
  phone: "+254 700 000000",
  whatsapp: "https://wa.me/254700000000",
  telegram: "https://t.me/yourhandle",
  discord: "yourhandle",

  // Contact form: sign up free at https://formspree.io, create a form, and
  // paste its endpoint here (e.g. "https://formspree.io/f/abcdwxyz").
  // Leave empty to keep the form as a visual-only stub.
  contactFormEndpoint: "",

  asciiLogo: `
██████╗ ███████╗ ██████╗ ██████╗ ██████╗ ███████╗
██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
██████╔╝█████╗  ██║     ██║   ██║██████╔╝███████╗
██╔══██╗██╔══╝  ██║     ██║   ██║██╔══██╗╚════██║
██║  ██║███████╗╚██████╗╚██████╔╝██║  ██║███████║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██╗     ██╗███╗   ██╗ █████╗
██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██║     ██║████╗  ██║██╔══██╗
███████║███████║██║     █████╔╝ █████╗  ██║     ██║██╔██╗ ██║███████║
██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██║     ██║██║╚██╗██║██╔══██║
██║  ██║██║  ██║╚██████╗██║  ██╗███████╗███████╗██║██║ ╚████║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝`,

  socials: {
    github: "https://github.com/your-github-username",
    linkedin: "https://linkedin.com/in/your-handle",
    twitter: "https://x.com/your-handle",
  },

  resumeUrl: "assets/resume.pdf", // drop your real PDF here

  // Put a photo of yourself at e.g. assets/me.jpg and set the path below to
  // show it as the "head" of the chain-swing avatar (sidebar + About page).
  // Leave empty to keep the illustrated face. Square-ish photos, face
  // centered, work best — it's cropped into a circle automatically.
  avatarPhoto: "",

  bio: [
    "Full-Stack Engineer and AI/ML Specialist with 6+ years of experience building scalable applications and intelligent systems.",
    "Proven track record of delivering production-ready solutions that increase user engagement by 40%+ and reduce operational costs by 60%.",
    "Expert in bridging traditional software engineering with cutting-edge AI capabilities to solve real business problems.",
  ],
  mission: "Build intelligent, scalable systems that drive measurable business impact while maintaining exceptional code quality.",
  currentFocus: "Leading AI/ML initiatives, implementing RAG systems at scale, and architecting next-generation developer tools.",
  favoriteQuote: "\"The best way to predict the future is to invent it.\"",
  funFacts: [
    "Built an AI-powered code review assistant that won a hackathon in 24 hours.",
    "Published a fine-tuned model on HuggingFace with 10K+ downloads for African language processing.",
    "Contributed to open-source projects used by 50K+ developers worldwide.",
  ],
  stats: {
    yearsCoding: 6,
    projectsDelivered: 25,
    teamSizeLed: 15,
    costReduction: "60%",
  },

  skills: [
    { category: "Frontend", items: [
      { name: "React / Next.js", level: 92, years: 5 },
      { name: "TypeScript", level: 90, years: 5 },
      { name: "Tailwind CSS", level: 88, years: 4 },
    ]},
    { category: "Backend", items: [
      { name: "Node.js", level: 88, years: 5 },
      { name: "Python", level: 82, years: 4 },
      { name: "PostgreSQL", level: 80, years: 4 },
    ]},
    { category: "Cloud & DevOps", items: [
      { name: "AWS", level: 75, years: 3 },
      { name: "Docker", level: 85, years: 4 },
      { name: "CI/CD", level: 78, years: 3 },
    ]},
    { category: "AI / ML", items: [
      { name: "LLM Integration (OpenAI, Anthropic, HuggingFace)", level: 88, years: 2 },
      { name: "PyTorch / TensorFlow", level: 75, years: 2 },
      { name: "RAG Systems & Vector Databases", level: 82, years: 2 },
      { name: "Fine-tuning & Model Optimization", level: 70, years: 2 },
      { name: "LangChain & AI Agents", level: 85, years: 2 },
      { name: "Computer Vision (OpenCV, YOLO)", level: 68, years: 1 },
    ]},
  ],

  experience: [
    {
      role: "Senior AI/ML Engineer",
      org: "Example Corp",
      period: "2023 — Present",
      points: [
        "Led AI integration initiatives, implementing LLM-powered features that increased user engagement by 40% and reduced support tickets by 25%.",
        "Architected and deployed RAG systems handling 100K+ documents with 95% retrieval accuracy.",
        "Developed custom AI agents using LangChain that automated 30+ workflows, saving 200+ hours monthly.",
        "Fine-tuned open-source models for domain-specific tasks, reducing inference costs by 60% while maintaining 92% accuracy.",
        "Mentored team of 5 engineers on AI best practices, improving team productivity by 35%.",
      ],
    },
    {
      role: "Software Engineer",
      org: "Another Company",
      period: "2020 — 2023",
      points: [
        "Built internal developer platform used by 50+ engineers, reducing deployment time by 70%.",
        "Implemented ML pipelines for data processing and model deployment, handling 1M+ data points daily.",
        "Developed computer vision solutions for automated quality inspection, achieving 98% accuracy and reducing manual inspection by 80%.",
        "Led migration of legacy systems to microservices architecture, improving system reliability by 45%.",
      ],
    },
  ],

  education: [
    { school: "University of Example", degree: "B.Sc. Computer Science", period: "2016 — 2020" },
  ],

  certifications: [
    { name: "AWS Certified Solutions Architect - Professional", year: "2023", issuer: "Amazon Web Services" },
    { name: "Google Professional Machine Learning Engineer", year: "2023", issuer: "Google Cloud" },
    { name: "Certified Kubernetes Administrator (CKA)", year: "2022", issuer: "CNCF" },
    { name: "Deep Learning Specialization", year: "2023", issuer: "Coursera / DeepLearning.AI" },
    { name: "Machine Learning Engineering for Production (MLOps) Specialization", year: "2023", issuer: "Coursera / DeepLearning.AI" },
    { name: "TensorFlow Developer Certificate", year: "2022", issuer: "Google" },
  ],

  achievements: [
    { title: "Hackathon Winner — AI DevFest 2023", desc: "1st place out of 200+ teams, built an AI-powered code review assistant in 24h." },
    { title: "Open Source Contributor of the Month", desc: "Recognized by LangChain and HuggingFace for significant contributions to AI frameworks." },
    { title: "AI Model Published on HuggingFace", desc: "Released a fine-tuned model for African language processing with 10K+ downloads and 4.8/5 rating." },
    { title: "Tech Speaker — AI Conference 2023", desc: "Delivered talk on 'Building Production RAG Systems' to 500+ attendees." },
    { title: "Employee of the Quarter", desc: "Recognized for outstanding contributions to AI initiatives and team mentorship." },
  ],

  blog: [
    { title: "Why I Rebuilt My Portfolio as an Operating System", date: "2026-05-12", tags: ["meta", "design"], excerpt: "A walkthrough of the terminal-first approach and why it beats a static page." },
    { title: "Building Production RAG Systems at Scale", date: "2026-04-15", tags: ["ai", "rag", "vector-db"], excerpt: "Lessons learned from deploying RAG systems handling millions of documents." },
    { title: "Fine-tuning LLaMA for Domain-Specific Tasks", date: "2026-03-20", tags: ["ai", "llm", "fine-tuning"], excerpt: "A practical guide to fine-tuning open-source models for specialized applications." },
    { title: "Notes on Building Fast React Apps", date: "2026-03-02", tags: ["react", "performance"], excerpt: "Practical, boring techniques that actually move the needle." },
  ],
};
