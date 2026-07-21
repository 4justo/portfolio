/* ============================================================
   TERMINAL ENGINE
   ============================================================ */
const Terminal = (() => {
  const outEl = () => document.getElementById("terminal");
  const inputEl = () => document.getElementById("terminal-input");
  let history = [];
  let histIdx = -1;
  let cwd = "/";

  // ---- Virtual filesystem ----
  const fs = {
    "/": { type: "dir", children: ["about", "projects", "experience", "education", "certifications", "achievements", "open-source", "skills", "blog", "contact", "resume.pdf"] },
    "/about": { type: "dir", children: ["bio.md", "mission.md", "hobbies.md", "interests.md"] },
    "/about/bio.md": { type: "file", content: () => CONFIG.bio.join("\n\n") },
    "/about/mission.md": { type: "file", content: () => CONFIG.mission },
    "/about/hobbies.md": { type: "file", content: () => CONFIG.funFacts.join("\n") },
    "/about/interests.md": { type: "file", content: () => CONFIG.currentFocus },
    "/projects": { type: "dir", children: [] },
    "/experience": { type: "dir", children: [] },
    "/education": { type: "dir", children: [] },
    "/certifications": { type: "dir", children: [] },
    "/achievements": { type: "dir", children: [] },
    "/open-source": { type: "dir", children: [] },
    "/skills": { type: "dir", children: [] },
    "/blog": { type: "dir", children: [] },
    "/contact": { type: "dir", children: [] },
    "/resume.pdf": { type: "file", content: () => "[binary] — use `download resume` or open the Resume window." },
  };

  const COMMANDS = [
    "help","about","whoami","clear","projects","skills","experience","education",
    "certifications","achievements","opensource","resume","contact","social","github",
    "tree","ls","pwd","cd","cat","find","grep",
    "theme","weather","date","time","neofetch","stats","blog",
    "download","hire","sudo","matrix","ascii","snake","typingtest","history","exit",
    "passwordgen","uuid","hash","json","color","regex","shortcuts","sysmon","htop","top","hack"
  ];

  function print(html, cls) {
    const div = document.createElement("div");
    div.className = "line" + (cls ? " " + cls : "");
    div.innerHTML = html;
    outEl().appendChild(div);
    outEl().scrollTop = outEl().scrollHeight;
  }
  function printRaw(text, cls) { print(escapeHtml(text), cls); }
  function escapeHtml(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  function promptLabel() { return `visitor@portfolio:<span class="cyan">${cwd}</span>$`; }

  function echoCommand(cmd) {
    print(`<span class="prompt-row"><span class="prompt-label">${promptLabel()}</span><span class="cmd-echo">${escapeHtml(cmd)}</span></span>`);
  }

  async function typeLines(lines, delay = 90) {
    for (const l of lines) {
      await new Promise(r => setTimeout(r, delay));
      print(`<span class="ok">${escapeHtml(l)}</span>`);
    }
  }

  function boldHeader(text) { print(`<span style="color:var(--secondary);font-weight:700">${text}</span>`); }

  async function run(raw) {
    const cmd = raw.trim();
    if (cmd === "") return;
    history.push(cmd);
    histIdx = history.length;
    echoCommand(cmd);
    const [verb, ...rest] = cmd.split(/\s+/);
    const args = rest.join(" ");
    try {
      await dispatch(verb.toLowerCase(), args, rest);
    } catch (e) {
      print(`<span class="err">command failed: ${escapeHtml(e.message)}</span>`);
    }
  }

  async function dispatch(verb, args, rest) {
    switch (verb) {
      case "help": return cmdHelp();
      case "about": return cmdAbout();
      case "whoami": return cmdWhoami();
      case "clear": return (outEl().innerHTML = "");
      case "projects": return cmdProjects();
      case "skills": return cmdSkills();
      case "experience": return cmdExperience();
      case "education": return cmdEducation();
      case "certifications": return cmdCertifications();
      case "achievements": return cmdAchievements();
      case "opensource": return cmdOpenSource();
      case "resume": case "download":
        if (rest[0] === "resume" || verb === "resume") return cmdResume();
        return print(`<span class="err">unknown target</span>`);
      case "contact": return cmdContact();
      case "social": return cmdSocial();
      case "github": return cmdGithub(rest);
      case "tree": return cmdTree();
      case "ls": return cmdLs();
      case "pwd": return printRaw(cwd);
      case "cd": return cmdCd(args);
      case "cat": return cmdCat(args);
      case "find": return cmdFind(args);
      case "grep": return cmdGrep(args);
      case "theme": return cmdTheme(rest[0]);
      case "weather": return cmdWeather();
      case "date": return printRaw(new Date().toDateString());
      case "time": return printRaw(new Date().toLocaleTimeString());
      case "neofetch": return cmdNeofetch();
      case "stats": return cmdStats();
      case "blog": return cmdBlog();
      case "hire": return cmdHire();
      case "sudo": return cmdSudo(rest);
      case "matrix": return App.openMatrix();
      case "ascii": return print(`<pre class="ascii-logo">${CONFIG.asciiLogo}</pre>`);
      case "snake": return App.openWindow("game-snake");
      case "typingtest": return App.openWindow("game-typing");
      case "history": return history.forEach((h,i)=>printRaw(`${i+1}  ${h}`));
      case "passwordgen": return cmdPasswordGen(rest);
      case "uuid": return printRaw(cryptoUUID());
      case "hash": return cmdHash(rest);
      case "json": return cmdJson(args);
      case "color": return cmdColor(rest[0]);
      case "regex": return cmdRegex(rest);
      case "shortcuts": return cmdShortcuts();
      case "sysmon": case "htop": case "top": return App.openWindow("sysmon");
      case "hack": return App.openHack();
      case "exit": return print(`<span class="warn">There is no escape. (This is a browser tab.) Try `+"`clear`"+` instead.</span>`);
      default:
        print(`<span class="err">command not found:</span> ${escapeHtml(verb)}. Type <span class="ok">help</span> for a list of commands.`);
    }
  }

  function cmdHelp() {
    boldHeader("AVAILABLE COMMANDS");
    const groups = {
      "Navigation": ["ls","cd","pwd","tree","cat","find","grep","clear"],
      "Sections": ["about","projects","skills","experience","education","certifications","achievements","opensource","blog","contact","resume","social","github"],
      "System": ["neofetch","stats","date","time","weather","theme <name>","history","shortcuts"],
      "Utilities": ["passwordgen [len]","uuid","hash [algo] <text>","json <text>","color #hex","regex /pattern/flags text","sysmon / htop"],
      "Fun": ["matrix","ascii","snake","typingtest","sudo hire me","sudo coffee","hack"],
    };
    Object.entries(groups).forEach(([g, cmds]) => {
      print(`<span class="accent">${g}</span>`);
      print(`  ${cmds.map(c=>`<span class="ok">${c}</span>`).join("  ")}`);
    });
    print(`<span class="muted">Tip: press Tab to autocomplete, ↑/↓ for history, Ctrl+K for global search.</span>`);
  }

  function cmdWhoami() {
    print(`<pre class="ascii-logo">${CONFIG.asciiLogo}</pre>`);
    printRaw(`${CONFIG.name} — ${CONFIG.role}`);
    printRaw(CONFIG.location + " · " + CONFIG.availability);
  }

  function cmdAbout() {
    boldHeader(`${CONFIG.name} · ${CONFIG.role}`);
    CONFIG.bio.forEach(p => printRaw(p));
    print(`<span class="muted">Mission:</span> ${CONFIG.mission}`);
    print(`<span class="muted">Currently:</span> ${CONFIG.currentFocus}`);
    print(`<span class="muted">Quote:</span> <span class="accent">${CONFIG.favoriteQuote}</span>`);
    App.openWindow("about");
  }

  async function cmdProjects() {
    print(`<span class="muted">Fetching live repositories from GitHub…</span>`);
    const repos = await GitHubSync.getRepos();
    if (!repos || !repos.length) return print(`<span class="err">Could not reach GitHub (check githubUsername in config.js).</span>`);
    repos.slice(0, 8).forEach(r => {
      print(`<span class="ok">${r.name}</span> <span class="muted">★${r.stargazers_count} · ${r.language || "—"}</span>`);
      if (r.description) printRaw("  " + r.description, "muted");
    });
    print(`<span class="muted">Showing top 8 by stars. Open the Projects window for the full, filterable grid.</span>`);
    App.openWindow("projects");
  }

  function cmdSkills() {
    CONFIG.skills.forEach(group => {
      boldHeader(group.category);
      group.items.forEach(s => {
        const filled = Math.round(s.level / 5);
        print(`  ${s.name.padEnd(20)} <span class="ok">${"█".repeat(filled)}</span><span class="muted">${"░".repeat(20-filled)}</span> ${s.level}%`);
      });
    });
    App.openWindow("skills");
  }

  function cmdExperience() {
    CONFIG.experience.forEach(e => {
      boldHeader(`${e.role} — ${e.org}`);
      printRaw(e.period, "muted");
      e.points.forEach(p => printRaw("  • " + p));
    });
    App.openWindow("experience");
  }
  function cmdEducation() {
    CONFIG.education.forEach(e => printRaw(`${e.degree} — ${e.school} (${e.period})`));
    App.openWindow("education");
  }
  function cmdCertifications() {
    CONFIG.certifications.forEach(c => printRaw(`${c.name} — ${c.issuer} (${c.year})`));
    App.openWindow("certifications");
  }
  function cmdAchievements() {
    CONFIG.achievements.forEach(a => { boldHeader(a.title); printRaw(a.desc, "muted"); });
    App.openWindow("achievements");
  }
  function cmdOpenSource() {
    print(`<span class="muted">Pulling contribution data…</span>`);
    App.openWindow("opensource");
  }
  function cmdResume() {
    print(`Opening resume… <a href="${CONFIG.resumeUrl}" target="_blank">${CONFIG.resumeUrl}</a>`);
    App.openWindow("resume");
  }
  function cmdContact() {
    boldHeader("CONTACT");
    printRaw(`Email:    ${CONFIG.email}`);
    printRaw(`Phone:    ${CONFIG.phone}`);
    printRaw(`GitHub:   ${CONFIG.socials.github}`);
    printRaw(`LinkedIn: ${CONFIG.socials.linkedin}`);
    App.openWindow("contact");
  }
  function cmdSocial() {
    Object.entries(CONFIG.socials).forEach(([k,v]) => printRaw(`${k}: ${v}`));
  }
  async function cmdGithub(rest) {
    if (rest[0] === "activity") {
      print(`<img src="${GitHubSync.contributionGraphUrl()}" style="max-width:100%;border-radius:8px;border:1px solid var(--border)"/>`);
      return;
    }
    const profile = await GitHubSync.getProfile();
    if (!profile) return print(`<span class="err">GitHub profile unavailable.</span>`);
    printRaw(`${profile.login} — ${profile.followers} followers · ${profile.public_repos} public repos`);
    App.openWindow("github");
  }
  function cmdTree() {
    printRaw("/");
    const root = fs["/"].children;
    root.forEach((name, i) => {
      const last = i === root.length - 1;
      printRaw(`${last ? "└── " : "├── "}${name}`);
      const node = fs["/" + name];
      if (node && node.type === "dir" && node.children.length) {
        node.children.forEach((c, j) => {
          const l2 = j === node.children.length - 1;
          printRaw(`${last ? "    " : "│   "}${l2 ? "└── " : "├── "}${c}`);
        });
      }
    });
  }
  function resolvePath(p) {
    if (!p) return cwd;
    if (p === "..") return "/";
    if (p.startsWith("/")) return p;
    return (cwd === "/" ? "" : cwd) + "/" + p;
  }
  function cmdLs() {
    const node = fs[cwd];
    if (!node || node.type !== "dir") return print(`<span class="err">not a directory</span>`);
    printRaw(node.children.join("  "));
  }
  function cmdCd(args) {
    if (!args || args === "~" || args === "/") { cwd = "/"; return; }
    const target = resolvePath(args);
    if (fs[target] && fs[target].type === "dir") cwd = target;
    else print(`<span class="err">cd: no such directory: ${escapeHtml(args)}</span>`);
  }
  function cmdCat(args) {
    const target = resolvePath(args);
    const node = fs[target];
    if (!node) return print(`<span class="err">cat: no such file: ${escapeHtml(args)}</span>`);
    if (node.type === "dir") return print(`<span class="err">cat: ${escapeHtml(args)} is a directory</span>`);
    printRaw(typeof node.content === "function" ? node.content() : node.content);
  }
  function cmdFind(args) {
    const q = (args || "").toLowerCase();
    const matches = Object.keys(fs).filter(p => p.toLowerCase().includes(q));
    matches.forEach(m => printRaw(m));
    if (!matches.length) print(`<span class="muted">no matches</span>`);
  }
  function cmdGrep(args) {
    const q = (args || "").toLowerCase();
    if (!q) return print(`<span class="err">usage: grep &lt;term&gt;</span>`);
    Object.entries(fs).forEach(([path, node]) => {
      if (node.type === "file") {
        const content = typeof node.content === "function" ? node.content() : node.content;
        if (content && content.toLowerCase().includes(q)) printRaw(`${path}: …${content.slice(0, 60)}…`);
      }
    });
  }
  function cmdTheme(name) {
    if (!name) return print(`<span class="err">usage: theme &lt;hacker|ubuntu|powershell|vscode|matrix|dracula|light|dark&gt;</span>`);
    App.setTheme(name);
    print(`Theme switched to <span class="ok">${name}</span>.`);
  }
  function cmdWeather() {
    printRaw(`${CONFIG.location} — fetching would require a weather API key.`);
    printRaw(`Configure one in js/github.js-style module if you want this live. For now: probably sunny, definitely coding.`);
  }
  function cmdNeofetch() {
    const lines = [
      `${CONFIG.name}@portfolio`,
      `------------------`,
      `OS: Portfolio OS v1.0`,
      `Host: ${location.hostname || "localhost"}`,
      `Uptime: ${Math.floor(performance.now()/1000)}s`,
      `Shell: portfolio-sh`,
      `Theme: ${document.body.getAttribute("data-theme") || "hacker"}`,
      `Languages: ${CONFIG.languagesSpoken.join(", ")}`,
      `Coffee: ${CONFIG.stats.coffeeCount} cups`,
    ];
    print(`<pre class="ascii-logo">${CONFIG.asciiLogo}</pre>`);
    lines.forEach(l => printRaw(l));
  }
  async function cmdStats() {
    const [profile, repos] = await Promise.all([GitHubSync.getProfile(), GitHubSync.getRepos()]);
    printRaw(`Years coding:     ${CONFIG.stats.yearsCoding}`);
    printRaw(`Lines of code:    ${CONFIG.stats.linesOfCode}`);
    printRaw(`Coffee consumed:  ${CONFIG.stats.coffeeCount} cups`);
    if (profile) printRaw(`GitHub followers: ${profile.followers}`);
    if (repos) printRaw(`Public repos:     ${repos.length}`);
  }
  function cmdBlog() {
    CONFIG.blog.forEach(b => { boldHeader(b.title); printRaw(`${b.date} · ${b.tags.join(", ")}`, "muted"); printRaw(b.excerpt); });
    App.openWindow("blog");
  }
  function cmdHire() {
    print(`<span class="accent">📬 Let's talk.</span> Email <a href="mailto:${CONFIG.email}">${CONFIG.email}</a> or open the Contact window.`);
    App.openWindow("contact");
  }
  async function cmdSudo(rest) {
    const phrase = rest.join(" ").toLowerCase();
    if (phrase === "hire me") {
      print(`<span class="warn">[sudo] password for visitor:</span>`);
      await typeLines(["Authenticating...", "Access granted.", `Redirecting to contact form...`], 300);
      App.openWindow("contact");
      return;
    }
    if (phrase === "coffee") {
      await typeLines(["Brewing...", "☕ Coffee ready. Productivity +100%."], 250);
      return;
    }
    print(`<span class="err">visitor is not in the sudoers file. This incident will be reported (to no one).</span>`);
  }

  function cryptoUUID() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  function cmdPasswordGen(rest) {
    const len = Math.min(Math.max(parseInt(rest[0]) || 16, 6), 64);
    const sets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    const pass = Array.from(arr, n => sets[n % sets.length]).join("");
    print(`<span class="ok">${escapeHtml(pass)}</span> <span class="muted">(${len} chars)</span>`);
  }
  async function cmdHash(rest) {
    const algoMap = { md5:null, sha1:"SHA-1", sha256:"SHA-256", sha512:"SHA-512" };
    let algo = "sha256", text = rest.join(" ");
    if (algoMap.hasOwnProperty(rest[0])) { algo = rest[0]; text = rest.slice(1).join(" "); }
    if (!text) return print(`<span class="err">usage: hash [sha1|sha256|sha512] &lt;text&gt;</span>`);
    if (algo === "md5") return print(`<span class="err">MD5 isn't available via the browser Web Crypto API (by design — it's insecure). Try sha256.</span>`);
    const buf = await crypto.subtle.digest(algoMap[algo], new TextEncoder().encode(text));
    const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
    print(`<span class="muted">${algo}(${escapeHtml(text)}) =</span>`);
    printRaw(hex, "ok");
  }
  function cmdJson(args) {
    if (!args) return print(`<span class="err">usage: json &lt;text&gt; — pretty-prints/validates JSON</span>`);
    try {
      const parsed = JSON.parse(args);
      print(`<pre style="margin:0;white-space:pre-wrap" class="ok">${escapeHtml(JSON.stringify(parsed, null, 2))}</pre>`);
    } catch (e) {
      print(`<span class="err">Invalid JSON: ${escapeHtml(e.message)}</span>`);
    }
  }
  function cmdColor(hex) {
    if (!hex || !/^#?[0-9a-fA-F]{3,8}$/.test(hex)) return print(`<span class="err">usage: color #RRGGBB</span>`);
    if (!hex.startsWith("#")) hex = "#" + hex;
    let h = hex.replace("#","");
    if (h.length === 3) h = h.split("").map(c=>c+c).join("");
    const r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16);
    print(`<span style="display:inline-block;width:14px;height:14px;background:${hex};border-radius:3px;vertical-align:middle;margin-right:8px;border:1px solid var(--border)"></span>${hex.toUpperCase()} <span class="muted">rgb(${r}, ${g}, ${b})</span>`);
  }
  function cmdRegex(rest) {
    const joined = rest.join(" ");
    const m = joined.match(/^\/(.+)\/([a-z]*)\s+(.*)$/) || joined.match(/^(\S+)\s+(.*)$/);
    if (!m) return print(`<span class="err">usage: regex /pattern/flags test-string</span>`);
    let pattern, flags, str;
    if (m.length === 4) { pattern = m[1]; flags = m[2]; str = m[3]; } else { pattern = m[1]; flags = ""; str = m[2]; }
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const matches = [...str.matchAll(re)];
      if (!matches.length) return print(`<span class="warn">No matches.</span>`);
      matches.forEach(mm => printRaw(`match: "${mm[0]}" at index ${mm.index}`));
    } catch (e) {
      print(`<span class="err">Invalid regex: ${escapeHtml(e.message)}</span>`);
    }
  }
  function cmdShortcuts() {
    boldHeader("KEYBOARD SHORTCUTS");
    [["Ctrl / Cmd + K","Open global command palette"],
     ["↑ / ↓","Navigate command history"],
     ["Tab","Autocomplete current command"],
     ["Esc","Close palette / exit Matrix rain"],
     ["↑↑↓↓←→←→ B A","Konami code — Matrix rain easter egg"]].forEach(([k,d]) => printRaw(`${k.padEnd(22)} ${d}`));
  }

  // ---- input handling ----
  function bindInput() {
    const el = inputEl();
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = el.value;
        el.value = "";
        run(val);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; el.value = history[histIdx] || ""; }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx < history.length - 1) { histIdx++; el.value = history[histIdx] || ""; }
        else { histIdx = history.length; el.value = ""; }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const partial = el.value.split(/\s+/).pop().toLowerCase();
        const match = COMMANDS.find(c => c.startsWith(partial));
        if (match) {
          const parts = el.value.split(/\s+/);
          parts[parts.length - 1] = match;
          el.value = parts.join(" ");
        }
      }
    });
  }

  function focus() { inputEl().focus(); }

  async function boot() {
    print(`<pre class="ascii-logo">${CONFIG.asciiLogo}</pre>`);
    printRaw(`Welcome to Portfolio OS. Type `);
    print(`Welcome to <span class="ok">Portfolio OS</span>. Type <span class="ok">help</span> to see available commands, or try <span class="ok">whoami</span>, <span class="ok">projects</span>, <span class="ok">neofetch</span>.`);
  }

  return { run, boot, bindInput, focus, print, printRaw };
})();
