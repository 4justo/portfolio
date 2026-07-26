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
  role: "Full-Stack Engineer · Systems Tinkerer",
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
███████╗██╗   ██╗███╗   ███╗ ██████╗ ███╗   ██╗
██╔════╝╚██╗ ██╔╝████╗ ████║██╔═══██╗████╗  ██║
███████╗ ╚████╔╝ ██╔████╔██║██║   ██║██╔██╗ ██║
╚════██║  ╚██╔╝  ██║╚██╔╝██║██║   ██║██║╚██╗██║
███████║   ██║   ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║
╚══════╝   ╚═╝   ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝`,

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
    "I build fast, resilient, slightly over-engineered software — because the boring parts deserve care too.",
    "Currently focused on developer tooling, distributed systems, and making terminals feel alive again.",
  ],
  mission: "Ship things that respect the user's time and the machine's resources.",
  currentFocus: "Distributed systems & AI-assisted developer tooling.",
  favoriteQuote: "\"Programs must be written for people to read, and only incidentally for machines to execute.\"",
  funFacts: [
    "Has strong, unsolicited opinions about tabs vs spaces (tabs, obviously).",
    "Once debugged a race condition in a dream.",
    "Coffee-to-commit ratio: roughly 1:1.",
  ],
  stats: {
    yearsCoding: 6,
    coffeeCount: 4821,
    linesOfCode: "1.2M+",
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
      { name: "LLM Integration", level: 84, years: 2 },
      { name: "PyTorch", level: 65, years: 2 },
    ]},
  ],

  experience: [
    {
      role: "Senior Software Engineer",
      org: "Example Corp",
      period: "2023 — Present",
      points: [
        "Led migration of monolith to microservices, cutting deploy time 70%.",
        "Mentored 4 junior engineers.",
      ],
    },
    {
      role: "Software Engineer",
      org: "Another Company",
      period: "2020 — 2023",
      points: [
        "Built internal developer platform used by 50+ engineers.",
      ],
    },
  ],

  education: [
    { school: "University of Example", degree: "B.Sc. Computer Science", period: "2016 — 2020" },
  ],

  certifications: [
    { name: "AWS Certified Solutions Architect", year: "2023", issuer: "Amazon Web Services" },
    { name: "Certified Kubernetes Administrator", year: "2022", issuer: "CNCF" },
  ],

  achievements: [
    { title: "Hackathon Winner — DevFest 2023", desc: "1st place, built a real-time collab tool in 24h." },
    { title: "Open Source Contributor of the Month", desc: "Recognized for contributions to a major OSS project." },
  ],

  blog: [
    { title: "Why I Rebuilt My Portfolio as an Operating System", date: "2026-05-12", tags: ["meta", "design"], excerpt: "A walkthrough of the terminal-first approach and why it beats a static page." },
    { title: "Notes on Building Fast React Apps", date: "2026-03-02", tags: ["react", "performance"], excerpt: "Practical, boring techniques that actually move the needle." },
  ],
};
