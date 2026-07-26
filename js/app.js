/* ============================================================
   APP — boot, window manager, section rendering
   ============================================================ */
const App = (() => {
  const windows = ["home","about","projects","skills","experience","education","certifications",
    "achievements","opensource","github","blog","resume","contact","sysmon","settings","game-snake","game-typing"];
  let matrix;
  let hackSim;

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  /* ---------------- Swing avatar illustration ---------------- */
  function swingAvatarSVG(size = 180, small = false) {
    const linkY = [];
    for (let y = 14; y <= 150; y += 15) linkY.push(y);
    const chainLinks = (cx) => linkY.map((y, i) =>
      `<ellipse class="chain-link" cx="${cx}" cy="${y}" rx="${i % 2 === 0 ? 5 : 8}" ry="${i % 2 === 0 ? 8 : 5}"/>`
    ).join("");
    const clipId = "headclip-" + (small ? "sm" : "lg");
    const photo = CONFIG.avatarPhoto && CONFIG.avatarPhoto.trim();
    const headMarkup = photo
      ? `<clipPath id="${clipId}"><circle cx="100" cy="132" r="17"/></clipPath>
         <image href="${photo}" x="82" y="114" width="36" height="36" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
         <circle cx="100" cy="132" r="17" fill="none" stroke="var(--text)" stroke-width="2"/>`
      : `<circle class="figure-head" cx="100" cy="132" r="17"/>
         <circle class="figure-face" cx="93" cy="131" r="2"/>
         <circle class="figure-face" cx="107" cy="131" r="2"/>
         <path d="M93,139 Q100,143 107,139" stroke="var(--text)" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    return `
    <svg class="swing-avatar${small ? " sm" : ""}" width="${size}" height="${size * 1.55}" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a figure sitting on a chain swing">
      <defs>
        <linearGradient id="seatGradFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="var(--secondary)" stop-opacity="0.55"/>
        </linearGradient>
        <linearGradient id="hoodieGradFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="var(--secondary)" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      <rect x="35" y="4" width="130" height="7" rx="3.5" fill="var(--muted)" opacity="0.45"/>
      <g class="swing-pivot">
        <g>${chainLinks(78)}</g>
        <g>${chainLinks(122)}</g>
        <!-- arms gripping chains -->
        <path class="figure-limb" d="M88,142 L78,118"/>
        <path class="figure-limb" d="M112,142 L122,118"/>
        <!-- seat -->
        <rect class="seat-plank" x="64" y="166" width="72" height="11" rx="5"/>
        <!-- dangling legs -->
        <path class="figure-limb" d="M82,182 C80,200 86,208 78,224"/>
        <path class="figure-limb" d="M118,182 C120,200 114,208 122,224"/>
        <ellipse class="figure-limb" cx="76" cy="228" rx="6" ry="3.5" style="fill:var(--secondary);stroke:none"/>
        <ellipse class="figure-limb" cx="124" cy="228" rx="6" ry="3.5" style="fill:var(--secondary);stroke:none"/>
        <!-- hoodie body -->
        <path class="figure-hoodie" d="M74,150 Q100,136 126,150 L130,178 Q100,188 70,178 Z"/>
        <!-- head (photo or illustrated) -->
        ${headMarkup}
      </g>
    </svg>`;
  }

  /* ---------------- Boot sequence ---------------- */
  async function runBoot() {
    try {
      console.log("runBoot called");
      const linesEl = document.getElementById("boot-lines");
      const bar = document.getElementById("boot-bar");
      const pct = document.getElementById("boot-pct");
      const access = document.getElementById("boot-access");
      
      console.log("Boot elements:", { linesEl, bar, pct, access });
      
      if (!linesEl || !bar || !pct || !access) {
        console.error("Boot elements not found, skipping boot sequence");
        document.getElementById("boot")?.remove();
        document.getElementById("app")?.classList.add("ready");
        document.getElementById("app")?.style.opacity = "1";
        return;
      }
      
      const steps = [
        "Initializing Portfolio OS...",
        "Loading modules...",
        "Connecting to GitHub...",
        "Loading projects...",
        "Authenticating user...",
      ];
      console.log("Starting boot steps:", steps.length);
      for (let i = 0; i < steps.length; i++) {
        console.log(`Boot step ${i}: ${steps[i]}`);
        await sleep(220);
        const d = document.createElement("div");
        d.style.color = "#00FF88";
        d.textContent = steps[i];
        linesEl.appendChild(d);
        const target = Math.round(((i + 1) / steps.length) * 100);
        console.log(`Animating bar to ${target}%`);
        await animateBar(bar, pct, target);
      }
      await sleep(200);
      access.textContent = "ACCESS GRANTED.";
      access.style.transition = "opacity .4s";
      access.style.opacity = "1";
      await sleep(500);
      const bootEl = document.getElementById("boot");
      if (bootEl) {
        bootEl.style.transition = "opacity .5s";
        bootEl.style.opacity = "0";
      }
      await sleep(500);
      bootEl?.remove();
      const appEl = document.getElementById("app");
      if (appEl) {
        appEl.classList.add("ready");
        appEl.style.opacity = "1";
      }
      console.log("Boot sequence complete");
    } catch (e) {
      console.error("Boot sequence error:", e);
      document.getElementById("boot")?.remove();
      const appEl = document.getElementById("app");
      if (appEl) {
        appEl.classList.add("ready");
        appEl.style.opacity = "1";
      }
    }
  }
  function animateBar(bar, pct, target) {
    return new Promise(resolve => {
      let cur = parseInt(bar.style.width) || 0;
      const step = () => {
        cur += 4;
        if (cur >= target) cur = target;
        bar.style.width = cur + "%";
        pct.textContent = cur + "%";
        if (cur < target) requestAnimationFrame(step); else resolve();
      };
      step();
    });
  }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ---------------- Window manager ---------------- */
  function openWindow(id) {
    windows.forEach(w => {
      const el = document.getElementById("win-" + w);
      if (el) el.classList.toggle("active", w === id);
    });
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.win === id));
    $("#topbar .title").textContent = titleFor(id);
    if (id === "sidebar-close") return;
    if (window.innerWidth <= 780) closeSidebar();
    renderWindow(id);
  }
  function titleFor(id) {
    const map = { home: "~/terminal", about: "about.md", projects: "projects/", skills: "skills/",
      experience: "experience/", education: "education/", certifications: "certifications/",
      achievements: "achievements/", opensource: "open-source/", github: "github — live",
      blog: "blog/", resume: "resume.pdf", contact: "contact/", sysmon: "system-monitor — live",
      settings: "settings.json",
      "game-snake": "games/snake", "game-typing": "games/typingtest" };
    return "portfolio-os — " + (map[id] || id);
  }
  function closeSidebar() { document.getElementById("sidebar").classList.remove("open"); }

  const rendered = new Set();
  function renderWindow(id) {
    if (rendered.has(id) && !["github","projects","sysmon"].includes(id)) return; // static sections render once
    switch (id) {
      case "about": return renderAbout();
      case "projects": return renderProjects();
      case "skills": return renderSkills();
      case "experience": return renderTimeline("experience", CONFIG.experience, e => ({
        period: e.period, title: e.role, sub: e.org, points: e.points }));
      case "education": return renderTimeline("education", CONFIG.education, e => ({
        period: e.period, title: e.degree, sub: e.school, points: [] }));
      case "certifications": return renderCertifications();
      case "achievements": return renderAchievements();
      case "opensource": return renderOpenSource();
      case "github": return renderGithub();
      case "blog": return renderBlog();
      case "resume": return renderResume();
      case "contact": return renderContact();
      case "sysmon": return renderSysmon();
      case "settings": return renderSettings();
      case "game-snake": return renderSnake();
      case "game-typing": return renderTyping();
    }
  }

  function renderAbout() {
    rendered.add("about");
    const el = document.getElementById("win-about");
    el.innerHTML = `
      <h1>About</h1>
      <div class="subtitle">whoami --verbose</div>
      <div class="grid cols-2">
        <div class="panel">
          <div class="swing-wrap">${swingAvatarSVG(150)}</div>
          <h3 style="margin-top:0;color:var(--text);text-align:center">${CONFIG.name}</h3>
          <p class="muted" style="color:var(--muted);text-align:center">${CONFIG.role}</p>
          ${CONFIG.bio.map(p => `<p>${p}</p>`).join("")}
          <p><span class="accent">${CONFIG.favoriteQuote}</span></p>
        </div>
        <div class="panel">
          <div class="setting-row"><span>Location</span><span class="muted">${CONFIG.location}</span></div>
          <div class="setting-row"><span>Timezone</span><span class="muted">${CONFIG.timezone}</span></div>
          <div class="setting-row"><span>Languages</span><span class="muted">${CONFIG.languagesSpoken.join(", ")}</span></div>
          <div class="setting-row"><span>Availability</span><span class="ok">${CONFIG.availability}</span></div>
          <div class="setting-row"><span>Years coding</span><span class="muted">${CONFIG.stats.yearsCoding}</span></div>
          <div class="setting-row"><span>Lines of code</span><span class="muted">${CONFIG.stats.linesOfCode}</span></div>
          <div class="setting-row" style="border-bottom:none"><span>Coffee</span><span class="muted">${CONFIG.stats.coffeeCount} cups ☕</span></div>
        </div>
      </div>
      <div class="panel" style="margin-top:14px">
        <h3 style="margin-top:0;color:var(--text)">Fun facts</h3>
        <ul style="color:var(--muted)">${CONFIG.funFacts.map(f => `<li>${f}</li>`).join("")}</ul>
      </div>`;
  }

  async function renderProjects() {
    const el = document.getElementById("win-projects");
    el.innerHTML = `<h1>Projects</h1><div class="subtitle">Live-synced from GitHub — zero manual entry.</div>
      <div class="toolbar">
        <input id="proj-search" placeholder="Search projects…" />
        <select id="proj-lang"><option value="">All languages</option></select>
        <select id="proj-sort"><option value="stars">Sort: Stars</option><option value="updated">Sort: Updated</option><option value="name">Sort: Name</option></select>
      </div>
      <div id="proj-grid" class="project-grid"><div class="muted">Loading repositories…</div></div>`;
    const repos = await GitHubSync.getRepos();
    if (!repos || !repos.length) {
      document.getElementById("proj-grid").innerHTML = `<div class="panel">Couldn't load GitHub repos. Set <code>githubUsername</code> in <code>js/config.js</code> to a real, public GitHub account.</div>`;
      return;
    }
    const langs = [...new Set(repos.map(r => r.language).filter(Boolean))];
    const langSel = document.getElementById("proj-lang");
    langs.forEach(l => { const o = document.createElement("option"); o.value = l; o.textContent = l; langSel.appendChild(o); });

    function draw() {
      const q = document.getElementById("proj-search").value.toLowerCase();
      const lang = langSel.value;
      const sort = document.getElementById("proj-sort").value;
      let list = repos.filter(r =>
        (!q || r.name.toLowerCase().includes(q) || (r.description||"").toLowerCase().includes(q)) &&
        (!lang || r.language === lang));
      if (sort === "stars") list.sort((a,b)=>b.stargazers_count-a.stargazers_count);
      if (sort === "updated") list.sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at));
      if (sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name));
      const grid = document.getElementById("proj-grid");
      grid.innerHTML = list.map(r => `
        <div class="card" onclick="window.open('${r.html_url}','_blank')">
          <div class="name"><span>${r.name}</span><span class="badge">★ ${r.stargazers_count}</span></div>
          <div class="desc">${r.description ? escapeHtml(r.description) : "No description provided."}</div>
          <div class="meta">
            <span>${r.language ? `<span class="lang-dot"></span>${r.language}` : ""}</span>
            <span>⑂ ${r.forks_count}</span>
            <span>${new Date(r.updated_at).toLocaleDateString()}</span>
          </div>
        </div>`).join("") || `<div class="panel">No projects match your filters.</div>`;
    }
    ["proj-search"].forEach(id => document.getElementById(id).addEventListener("input", draw));
    ["proj-lang","proj-sort"].forEach(id => document.getElementById(id).addEventListener("change", draw));
    draw();
  }
  function escapeHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  function renderSkills() {
    rendered.add("skills");
    const el = document.getElementById("win-skills");
    el.innerHTML = `<h1>Skills</h1><div class="subtitle">cat /skills/*.json</div>
      <div class="grid cols-2">
      ${CONFIG.skills.map(g => `
        <div class="panel">
          <h3 style="margin-top:0;color:var(--text)">${g.category}</h3>
          ${g.items.map(s => `
            <div class="skill-row">
              <div class="top"><span>${s.name}</span><span class="muted">${s.years}y</span></div>
              <div class="track"><div class="fill" data-level="${s.level}"></div></div>
            </div>`).join("")}
        </div>`).join("")}
      </div>`;
    requestAnimationFrame(() => {
      $$("#win-skills .fill").forEach(f => { f.style.width = f.dataset.level + "%"; });
    });
  }

  function renderTimeline(id, items, mapFn) {
    rendered.add(id);
    const el = document.getElementById("win-" + id);
    const mapped = items.map(mapFn);
    el.innerHTML = `<h1>${id[0].toUpperCase()+id.slice(1)}</h1><div class="subtitle">Interactive timeline</div>
      <div class="timeline">
      ${mapped.map((m,i) => `
        <div class="tl-item" style="animation-delay:${i*0.12}s">
          <div class="period">${m.period}</div>
          <div class="role">${m.title}</div>
          <div class="org">${m.sub}</div>
          ${m.points.length ? `<ul>${m.points.map(p=>`<li>${p}</li>`).join("")}</ul>` : ""}
        </div>`).join("")}
      </div>`;
  }

  function renderCertifications() {
    rendered.add("certifications");
    const el = document.getElementById("win-certifications");
    el.innerHTML = `<h1>Certifications</h1><div class="subtitle">ls /certifications</div>
      <div class="grid cols-3">
      ${CONFIG.certifications.map(c => `
        <div class="panel">
          <div style="color:var(--primary);font-weight:700">${c.name}</div>
          <div class="muted" style="font-size:12px;margin-top:6px">${c.issuer} · ${c.year}</div>
        </div>`).join("")}
      </div>`;
  }
  function renderAchievements() {
    rendered.add("achievements");
    const el = document.getElementById("win-achievements");
    el.innerHTML = `<h1>Achievements</h1><div class="subtitle">cat /achievements/*</div>
      <div class="grid cols-2">
      ${CONFIG.achievements.map(a => `
        <div class="panel">
          <div style="color:var(--primary);font-weight:700">🏆 ${a.title}</div>
          <div class="muted" style="font-size:12.5px;margin-top:6px">${a.desc}</div>
        </div>`).join("")}
      </div>`;
  }

  async function renderOpenSource() {
    const el = document.getElementById("win-opensource");
    el.innerHTML = `<h1>Open Source</h1><div class="subtitle">Contribution activity — live from GitHub</div>
      <div class="panel"><img src="${GitHubSync.contributionGraphUrl()}" style="max-width:100%;border-radius:6px" onerror="this.outerHTML='<div class=&quot;muted&quot;>Heatmap unavailable offline.</div>'"/></div>
      <div id="os-repos" class="project-grid" style="margin-top:16px"></div>`;
    const repos = await GitHubSync.getRepos();
    if (repos && repos.length) {
      document.getElementById("os-repos").innerHTML = repos.filter(r=>r.stargazers_count>0 || r.forks_count>0).slice(0,6).map(r => `
        <div class="card" onclick="window.open('${r.html_url}','_blank')">
          <div class="name"><span>${r.name}</span><span class="badge">★ ${r.stargazers_count}</span></div>
          <div class="desc">${r.description ? escapeHtml(r.description) : ""}</div>
        </div>`).join("");
    }
  }

  async function renderGithub() {
    const el = document.getElementById("win-github");
    el.innerHTML = `<h1>GitHub Dashboard</h1><div class="subtitle">Live developer stats</div><div id="gh-body" class="muted">Loading…</div>`;
    const [profile, repos] = await Promise.all([GitHubSync.getProfile(), GitHubSync.getRepos()]);
    if (!profile) {
      document.getElementById("gh-body").innerHTML = `Set a valid <code>githubUsername</code> in <code>js/config.js</code> to enable this dashboard.`;
      return;
    }
    const languages = await GitHubSync.getLanguages(repos || []);
    document.getElementById("gh-body").outerHTML = `
      <div class="grid cols-3">
        <div class="panel" style="text-align:center">
          <img src="${profile.avatar_url}" style="width:64px;height:64px;border-radius:12px;border:1px solid var(--border)"/>
          <div style="margin-top:10px;font-weight:700">${profile.login}</div>
          <div class="muted" style="font-size:12px">${profile.bio || ""}</div>
        </div>
        <div class="panel"><div class="muted">Public repos</div><div style="font-size:28px;color:var(--primary);font-weight:700">${profile.public_repos}</div></div>
        <div class="panel"><div class="muted">Followers</div><div style="font-size:28px;color:var(--secondary);font-weight:700">${profile.followers}</div></div>
      </div>
      <div class="panel" style="margin-top:14px">
        <div class="muted" style="margin-bottom:8px">Top languages</div>
        ${languages.map(([l,c]) => `<span class="badge" style="margin-right:6px">${l} · ${c}</span>`).join("") || "—"}
      </div>
      <div class="panel" style="margin-top:14px">
        <div class="muted" style="margin-bottom:8px">Contribution activity</div>
        <img src="${GitHubSync.contributionGraphUrl()}" style="max-width:100%;border-radius:6px"/>
      </div>`;
  }

  function renderBlog() {
    rendered.add("blog");
    const el = document.getElementById("win-blog");
    el.innerHTML = `<h1>Blog</h1><div class="subtitle">Markdown-powered notes</div>
      <div class="grid cols-2">
      ${CONFIG.blog.map(b => `
        <div class="panel">
          <div style="color:var(--text);font-weight:700">${b.title}</div>
          <div class="muted" style="font-size:11px;margin:4px 0">${b.date} · ${b.tags.join(", ")} · ${Math.ceil(b.excerpt.split(" ").length/40)||1} min read</div>
          <div style="font-size:13px;color:var(--muted)">${b.excerpt}</div>
        </div>`).join("")}
      </div>`;
  }

  function renderResume() {
    rendered.add("resume");
    const el = document.getElementById("win-resume");
    el.innerHTML = `<h1>Resume</h1><div class="subtitle">Preview, print, or download</div>
      <div style="display:flex;gap:10px;margin-bottom:16px">
        <a class="btn" href="${CONFIG.resumeUrl}" download>⬇ Download PDF</a>
        <button class="btn ghost" onclick="window.print()">🖨 Print</button>
      </div>
      <div class="panel" style="min-height:400px">
        <iframe src="${CONFIG.resumeUrl}" style="width:100%;height:520px;border:none;border-radius:6px;background:#111" title="Resume preview"></iframe>
        <div class="muted" style="margin-top:8px;font-size:12px">Drop your real resume PDF at <code>${CONFIG.resumeUrl}</code> — this preview will pick it up automatically.</div>
      </div>`;
  }

  function renderContact() {
    rendered.add("contact");
    const el = document.getElementById("win-contact");
    const rows = [
      ["Email", CONFIG.email, `mailto:${CONFIG.email}`],
      ["Phone", CONFIG.phone, `tel:${CONFIG.phone.replace(/\s/g,"")}`],
      ["GitHub", CONFIG.socials.github, CONFIG.socials.github],
      ["LinkedIn", CONFIG.socials.linkedin, CONFIG.socials.linkedin],
      ["Twitter/X", CONFIG.socials.twitter, CONFIG.socials.twitter],
      ["WhatsApp", CONFIG.whatsapp, CONFIG.whatsapp],
      ["Telegram", CONFIG.telegram, CONFIG.telegram],
      ["Discord", CONFIG.discord, "#"],
    ];
    el.innerHTML = `<h1>Contact</h1><div class="subtitle">Reach out — I usually reply within a day.</div>
      <div class="grid cols-2">
        <div>
          ${rows.map(([label,val,href]) => `
            <div class="contact-row">
              <div class="l"><span class="muted">${label}</span><span>${val}</span></div>
              <button class="copy-btn" data-copy="${val}">Copy</button>
            </div>`).join("")}
        </div>
        <div class="panel">
          <div id="contact-success" class="ok hidden" style="margin-bottom:10px">✓ Message sent — thanks! I'll get back to you soon.</div>
          <div id="contact-error" class="err hidden" style="margin-bottom:10px">Something went wrong — try emailing me directly at ${CONFIG.email}.</div>
          ${!CONFIG.contactFormEndpoint ? `<div class="warn" style="margin-bottom:10px;font-size:12px">Form isn't wired up yet — set <code>contactFormEndpoint</code> in <code>js/config.js</code> to a Formspree endpoint (free at formspree.io) to make this live.</div>` : ""}
          <form id="contact-form">
            <div style="margin-bottom:10px"><input name="name" required placeholder="Your name" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:10px;border-radius:6px;font-family:inherit"/></div>
            <div style="margin-bottom:10px"><input name="email" required type="email" placeholder="Your email" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:10px;border-radius:6px;font-family:inherit"/></div>
            <div style="margin-bottom:10px"><textarea name="message" required placeholder="Message" rows="4" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:10px;border-radius:6px;font-family:inherit"></textarea></div>
            <button class="btn" type="submit" id="contact-submit-btn">Send message</button>
          </form>
        </div>
      </div>`;
    $$("#win-contact .copy-btn").forEach(btn => btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = "Copy", 1200);
    }));
    document.getElementById("contact-form").addEventListener("submit", handleContactSubmit);
  }
  async function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const successEl = document.getElementById("contact-success");
    const errorEl = document.getElementById("contact-error");
    const btn = document.getElementById("contact-submit-btn");
    successEl.classList.add("hidden");
    errorEl.classList.add("hidden");

    if (!CONFIG.contactFormEndpoint) {
      // No endpoint configured — show the success state as a visual preview only.
      successEl.textContent = "✓ Preview only — set contactFormEndpoint in js/config.js to actually send messages.";
      successEl.classList.remove("hidden");
      form.reset();
      return false;
    }

    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      const res = await fetch(CONFIG.contactFormEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        successEl.textContent = "✓ Message sent — thanks! I'll get back to you soon.";
        successEl.classList.remove("hidden");
        form.reset();
      } else {
        throw new Error("Non-OK response");
      }
    } catch (err) {
      errorEl.classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.textContent = "Send message";
    }
    return false;
  }

  function renderSettings() {
    rendered.add("settings");
    const el = document.getElementById("win-settings");
    const themes = [
      ["hacker","#00FF88"],["ubuntu","#E95420"],["powershell","#01A2FF"],
      ["vscode","#007ACC"],["dracula","#FF79C6"],["matrix","#00FF41"],["light","#0A8F5B"]
    ];
    el.innerHTML = `<h1>Settings</h1><div class="subtitle">Customize your environment</div>
      <div class="panel">
        <div class="muted" style="margin-bottom:10px">Theme</div>
        <div class="theme-swatches">
          ${themes.map(([name,color]) => `<div class="swatch" style="background:${color}" data-theme="${name}" title="${name}"></div>`).join("")}
        </div>
      </div>
      <div class="panel" style="margin-top:14px">
        <div class="setting-row"><span>CRT / scanline effect</span><div class="switch on" id="sw-crt"><div class="knob"></div></div></div>
        <div class="setting-row"><span>Floating particles</span><div class="switch on" id="sw-particles"><div class="knob"></div></div></div>
        <div class="setting-row" style="border-bottom:none"><span>Sound effects (stub)</span><div class="switch" id="sw-sound"><div class="knob"></div></div></div>
      </div>`;
    $$(".swatch").forEach(s => s.addEventListener("click", () => setTheme(s.dataset.theme)));
    document.getElementById("sw-crt").addEventListener("click", function(){ this.classList.toggle("on"); setCRT(this.classList.contains("on")); });
    document.getElementById("sw-particles").addEventListener("click", function(){ this.classList.toggle("on"); setParticlesFX(this.classList.contains("on")); });
    document.getElementById("sw-sound").addEventListener("click", function(){ this.classList.toggle("on"); });
  }

  function setTheme(name) {
    if (name === "dark") name = "hacker";
    document.body.setAttribute("data-theme", name === "hacker" ? "" : name);
  }

  /* ---------------- System Monitor ---------------- */
  let sysmonLoopId = null;
  const sysmonProcs = [
    "node --watch server.js", "next dev --turbo", "postgres: writer", "docker-compose up",
    "vim README.md", "webpack --watch", "python train.py", "ssh deploy@prod", "tmux: session0", "cargo build --release"
  ];
  function renderSysmon() {
    if (sysmonLoopId) cancelAnimationFrame(sysmonLoopId);
    const el = document.getElementById("win-sysmon");
    el.innerHTML = `<h1>System Monitor</h1><div class="subtitle">top -o cpu · live simulated telemetry (this runs in your browser, not a real server)</div>
      <div class="grid cols-3">
        <div class="panel"><div class="muted">CPU</div><div style="font-size:26px;color:var(--primary);font-weight:700" id="sm-cpu-val">—</div><canvas id="sm-cpu" width="380" height="80"></canvas></div>
        <div class="panel"><div class="muted">Memory</div><div style="font-size:26px;color:var(--secondary);font-weight:700" id="sm-ram-val">—</div><canvas id="sm-ram" width="380" height="80"></canvas></div>
        <div class="panel"><div class="muted">Disk I/O</div><div style="font-size:26px;color:var(--accent);font-weight:700" id="sm-disk-val">—</div><canvas id="sm-disk" width="380" height="80"></canvas></div>
      </div>
      <div class="grid cols-2" style="margin-top:14px">
        <div class="panel">
          <div class="muted" style="margin-bottom:8px">Network</div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>↓ Down</span><span id="sm-net-down" class="ok">0 KB/s</span></div>
          <div class="track" style="margin-bottom:10px"><div class="fill" id="sm-net-down-bar" style="width:0%"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>↑ Up</span><span id="sm-net-up" class="cyan">0 KB/s</span></div>
          <div class="track"><div class="fill" id="sm-net-up-bar" style="width:0%"></div></div>
          <div class="setting-row" style="border-bottom:none;margin-top:10px;padding-top:10px"><span>Uptime</span><span class="muted" id="sm-uptime">0s</span></div>
        </div>
        <div class="panel">
          <div class="muted" style="margin-bottom:8px">Processes</div>
          <div id="sm-procs" style="font-size:12px;line-height:1.9"></div>
        </div>
      </div>`;

    const cpuCtx = document.getElementById("sm-cpu").getContext("2d");
    const ramCtx = document.getElementById("sm-ram").getContext("2d");
    const diskCtx = document.getElementById("sm-disk").getContext("2d");
    const cpuHist = Array(60).fill(30), ramHist = Array(60).fill(45), diskHist = Array(60).fill(10);
    let cpu = 30, ram = 45, disk = 10;
    const bootTime = Date.now();

    function walk(val, min, max, vol) {
      val += (Math.random() - 0.5) * vol;
      return Math.max(min, Math.min(max, val));
    }
    function drawGraph(ctx, hist, color) {
      const w = ctx.canvas.width, h = ctx.canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, (h/4)*i); ctx.lineTo(w, (h/4)*i); ctx.stroke(); }
      ctx.beginPath();
      hist.forEach((v, i) => {
        const x = (i / (hist.length - 1)) * w;
        const y = h - (v / 100) * h;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.shadowColor = color; ctx.shadowBlur = 8; ctx.stroke();
      ctx.shadowBlur = 0;
      const grad = ctx.createLinearGradient(0,0,0,h);
      grad.addColorStop(0, color.replace(")", ",0.25)").replace("rgb","rgba"));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    }
    function renderProcs() {
      const rows = sysmonProcs.slice(0, 6).map(p => {
        const c = (Math.random()*30 + (p.includes("node")||p.includes("next")?15:0)).toFixed(1);
        const m = (Math.random()*400 + 50).toFixed(0);
        return `<div style="display:flex;justify-content:space-between"><span class="muted">${p}</span><span>${c}% <span class="muted">/ ${m}MB</span></span></div>`;
      }).join("");
      document.getElementById("sm-procs").innerHTML = rows;
    }
    let tick = 0;
    function loop() {
      if (!document.getElementById("win-sysmon").classList.contains("active")) { sysmonLoopId = null; return; }
      cpu = walk(cpu, 8, 96, 10); ram = walk(ram, 20, 90, 5); disk = walk(disk, 2, 80, 14);
      cpuHist.push(cpu); cpuHist.shift(); ramHist.push(ram); ramHist.shift(); diskHist.push(disk); diskHist.shift();
      drawGraph(cpuCtx, cpuHist, "rgb(0,255,136)");
      drawGraph(ramCtx, ramHist, "rgb(0,217,255)");
      drawGraph(diskCtx, diskHist, "rgb(139,92,246)");
      document.getElementById("sm-cpu-val").textContent = cpu.toFixed(0) + "%";
      document.getElementById("sm-ram-val").textContent = ram.toFixed(0) + "%";
      document.getElementById("sm-disk-val").textContent = disk.toFixed(0) + " MB/s";
      const down = Math.max(0, walk(220, 5, 900, 200));
      const up = Math.max(0, walk(60, 2, 300, 90));
      document.getElementById("sm-net-down").textContent = down.toFixed(0) + " KB/s";
      document.getElementById("sm-net-up").textContent = up.toFixed(0) + " KB/s";
      document.getElementById("sm-net-down-bar").style.width = Math.min(100, down/9) + "%";
      document.getElementById("sm-net-up-bar").style.width = Math.min(100, up/3) + "%";
      document.getElementById("sm-uptime").textContent = formatUptime(Date.now() - bootTime);
      if (tick % 25 === 0) renderProcs();
      tick++;
      sysmonLoopId = requestAnimationFrame(loop);
    }
    renderProcs();
    loop();
  }
  function formatUptime(ms) {
    const s = Math.floor(ms/1000);
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${h>0?h+"h ":""}${m}m ${sec}s`;
  }

  /* ---------------- Mini games ---------------- */
  function renderSnake() {
    const el = document.getElementById("win-game-snake");
    el.innerHTML = `<h1>Snake</h1><div class="subtitle">Arrow keys to move. Esc to leave.</div>
      <div class="panel" style="display:flex;justify-content:center"><canvas id="snake-canvas" width="400" height="400" style="background:#000;border-radius:6px"></canvas></div>
      <div class="muted" style="margin-top:8px;text-align:center">Score: <span id="snake-score">0</span></div>`;
    startSnake();
  }
  function startSnake() {
    const canvas = document.getElementById("snake-canvas");
    const ctx = canvas.getContext("2d");
    const grid = 20, cells = 20;
    let snake = [{x:10,y:10}], dir = {x:1,y:0}, food = randCell(), score = 0, alive = true;
    function randCell(){ return { x: Math.floor(Math.random()*cells), y: Math.floor(Math.random()*cells) }; }
    function key(e) {
      const map = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0} };
      if (map[e.key] && !(map[e.key].x === -dir.x && map[e.key].y === -dir.y)) dir = map[e.key];
    }
    document.addEventListener("keydown", key);
    function tick() {
      if (!alive || !document.getElementById("win-game-snake").classList.contains("active")) { document.removeEventListener("keydown", key); return; }
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x<0||head.y<0||head.x>=cells||head.y>=cells||snake.some(s=>s.x===head.x&&s.y===head.y)) { alive=false; ctx.fillStyle="rgba(255,77,77,.8)"; ctx.font="20px monospace"; ctx.fillText("Game over — refresh window to retry",20,200); return; }
      snake.unshift(head);
      if (head.x===food.x && head.y===food.y) { score++; document.getElementById("snake-score").textContent=score; food=randCell(); } else snake.pop();
      ctx.fillStyle="#000"; ctx.fillRect(0,0,400,400);
      ctx.fillStyle="#00FF88"; snake.forEach(s=>ctx.fillRect(s.x*grid,s.y*grid,grid-2,grid-2));
      ctx.fillStyle="#FF4D4D"; ctx.fillRect(food.x*grid,food.y*grid,grid-2,grid-2);
      setTimeout(()=>requestAnimationFrame(tick), 110);
    }
    tick();
  }

  function renderTyping() {
    const el = document.getElementById("win-game-typing");
    const sample = "the quick brown fox jumps over the lazy dog while the terminal hums quietly in the dark";
    el.innerHTML = `<h1>Typing Speed Test</h1><div class="subtitle">Type the line below as fast (and accurately) as you can.</div>
      <div class="panel"><p class="muted" id="typing-sample" style="font-size:15px;letter-spacing:.5px">${sample}</p>
      <textarea id="typing-input" rows="3" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:10px;border-radius:6px;font-family:inherit" placeholder="Start typing here…"></textarea>
      <div style="margin-top:10px" class="muted">WPM: <span id="typing-wpm">0</span> · Accuracy: <span id="typing-acc">100%</span></div></div>`;
    let start = null;
    const input = document.getElementById("typing-input");
    input.addEventListener("input", () => {
      if (!start) start = Date.now();
      const typed = input.value;
      let correct = 0;
      for (let i=0;i<typed.length;i++) if (typed[i]===sample[i]) correct++;
      const acc = typed.length ? Math.round((correct/typed.length)*100) : 100;
      const mins = (Date.now()-start)/60000;
      const wpm = mins > 0 ? Math.round((typed.split(" ").length)/mins) : 0;
      document.getElementById("typing-wpm").textContent = wpm;
      document.getElementById("typing-acc").textContent = acc + "%";
    });
  }

  /* ---------------- Sidebar / nav wiring ---------------- */
  function bindNav() {
    $$(".nav-item").forEach(n => n.addEventListener("click", () => openWindow(n.dataset.win)));
    document.getElementById("mobile-nav-toggle").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("open");
    });
  }

  /* ---------------- Clock / status ---------------- */
  function bindClock() {
    function tick() {
      const now = new Date();
      document.getElementById("topbar-clock").textContent = now.toLocaleTimeString();
    }
    tick(); setInterval(tick, 1000);
  }

  /* ---------------- Command palette ---------------- */
  function bindPalette() {
    const overlay = document.getElementById("palette-overlay");
    const input = document.getElementById("palette-input");
    const results = document.getElementById("palette-results");
    const items = windows.filter(w=>!w.startsWith("game")).map(w => ({ id:w, label: titleFor(w) }))
      .concat([{id:"cmd:matrix",label:"Run command: matrix"},{id:"cmd:neofetch",label:"Run command: neofetch"}]);
    let sel = 0;
    function draw(list) {
      results.innerHTML = list.map((it,i) => `<div class="res-item ${i===sel?'sel':''}" data-id="${it.id}">${it.label}</div>`).join("");
      $$(".res-item").forEach(r => r.addEventListener("click", () => choose(r.dataset.id)));
    }
    function choose(id) {
      overlay.classList.remove("open");
      if (id.startsWith("cmd:")) { openWindow("home"); Terminal.run(id.slice(4)); }
      else openWindow(id);
    }
    document.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        overlay.classList.add("open"); input.value=""; input.focus(); draw(items); sel=0;
      } else if (e.key === "Escape") {
        overlay.classList.remove("open");
        if (document.getElementById("matrix-overlay").classList.contains("open")) matrix.stop();
        if (document.getElementById("hack-overlay").classList.contains("open")) hackSim.stop();
      }
    });
    input.addEventListener("input", () => {
      const q = input.value.toLowerCase();
      draw(items.filter(it => it.label.toLowerCase().includes(q)));
    });
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });
  }

  function openMatrix() { matrix.start(); }
  function openHack() { hackSim.start(); }

  /* ---------------- Init ---------------- */
  async function init() {
    console.log("App.init starting...");
    try {
      // Set boot logo
      const bootLogo = document.getElementById("boot-logo");
      if (bootLogo && typeof CONFIG !== 'undefined' && CONFIG.asciiLogo) {
        bootLogo.textContent = CONFIG.asciiLogo;
      }
      
      // Run boot sequence
      await runBoot();
      
      initParticles();
      console.log("Particles initialized");
      matrix = initMatrixRain();
      console.log("Matrix rain initialized");
      hackSim = initHackSimulation(() => CONFIG.name, () => CONFIG.location);
      console.log("Hack sim initialized");
      initKonami(() => openMatrix());
      console.log("Konami initialized");
      bindNav();
      console.log("Nav bound");
      bindClock();
      console.log("Clock bound");
      bindPalette();
      console.log("Palette bound");
      const avatarSlot = document.getElementById("brand-avatar-slot");
      if (avatarSlot) avatarSlot.innerHTML = swingAvatarSVG(34, true);
      Terminal.bindInput();
      console.log("Terminal input bound");
      await Terminal.boot();
      console.log("Terminal booted");
      Terminal.focus();
      console.log("Terminal focused");
      const termInputRow = document.getElementById("terminal-input-row");
      if (termInputRow) {
        termInputRow.addEventListener("click", Terminal.focus);
      }
    } catch (e) {
      console.error("Error during init:", e);
      // Force show the app even if something fails
      document.getElementById("boot")?.remove();
      const appEl = document.getElementById("app");
      if (appEl) {
        appEl.classList.add("ready");
        appEl.style.opacity = "1";
      }
    }
  }

  return { init, openWindow, setTheme, openMatrix, openHack, handleContactSubmit };
})();

console.log("app.js loaded, waiting for DOMContentLoaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired, calling App.init");
  App.init();
});
