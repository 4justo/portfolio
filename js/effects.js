/* ---------------- Floating particles ---------------- */
function initParticles() {
  const canvas = document.getElementById("fx-particles");
  if (!canvas) {
    console.warn("Particles canvas not found, skipping particles");
    return;
  }
  if (canvas.tagName !== 'CANVAS') {
    console.warn("fx-particles element is not a canvas, skipping particles");
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("Could not get canvas context, skipping particles");
    return;
  }
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function make() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.25 + 0.05,
      a: Math.random() * 0.5 + 0.1,
    }));
  }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    const color = getComputedStyle(document.body).getPropertyValue("--primary").trim() || "#00FF88";
    particles.forEach(p => {
      p.y -= p.vy;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(color, p.a);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  function hexToRgba(hex, a) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    return `rgba(${r},${g},${b},${a})`;
  }
  window.addEventListener("resize", () => { resize(); make(); });
  resize(); make(); tick();
}

/* ---------------- Matrix rain ---------------- */
function initMatrixRain() {
  const overlay = document.getElementById("matrix-overlay");
  const canvas = document.createElement("canvas");
  overlay.innerHTML = "";
  overlay.appendChild(canvas);
  const hint = document.createElement("div");
  hint.className = "hint";
  hint.textContent = "Press ESC to wake up";
  overlay.appendChild(hint);

  const ctx = canvas.getContext("2d");
  let w, h, drops, fontSize = 15, animId;
  const chars = "アイウエオカキクケコ01ｱｲｳｴｵ$#@&%*+-<>{}[]";

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    drops = Array(Math.floor(w / fontSize)).fill(0);
  }
  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#00FF88";
    ctx.font = fontSize + "px monospace";
    drops.forEach((y, i) => {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, y * fontSize);
      if (y * fontSize > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    animId = requestAnimationFrame(draw);
  }
  function start() { resize(); overlay.classList.add("open"); draw(); }
  function stop() { overlay.classList.remove("open"); cancelAnimationFrame(animId); }
  window.addEventListener("resize", () => { if (overlay.classList.contains("open")) resize(); });
  return { start, stop };
}

/* ---------------- Konami code easter egg ---------------- */
function initKonami(onTrigger) {
  const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let idx = 0;
  window.addEventListener("keydown", (e) => {
    idx = e.key === seq[idx] ? idx + 1 : (e.key === seq[0] ? 1 : 0);
    if (idx === seq.length) { idx = 0; onTrigger(); }
  });
}

/* ---------------- Fake "breach" hacking simulation ---------------- */
function initHackSimulation(getName, getLocation) {
  const overlay = document.getElementById("hack-overlay");
  const logEl = document.getElementById("hack-log");
  const glitchEl = document.getElementById("hack-glitch");
  const revealEl = document.getElementById("hack-reveal");
  let session = 0;

  function rint(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function fakeIp() { return `${rint(10,220)}.${rint(0,255)}.${rint(0,255)}.${rint(1,254)}`; }

  function buildScript() {
    const name = getName ? getName() : "visitor";
    const loc = getLocation ? getLocation() : "Unknown";
    return [
      { t: `[!] Initiating security scan on ${location.hostname || "localhost"}...`, cls: "ok-line" },
      { t: `[!] Connection intercepted from ${fakeIp()}`, cls: "ok-line" },
      { t: `[!] Bypassing firewall`, bar: true },
      { t: `[!] Cracking session token... done`, cls: "warn-line" },
      { t: `[!] Accessing webcam feed... 📷 denied (browsers don't work that way, nice try)`, cls: "warn-line" },
      { t: `[!] Enumerating cookies...`, cls: "ok-line" },
      { t: `[!] Triangulating location: ${loc}`, cls: "ok-line" },
      { t: `[!] Target identified: ${name}`, cls: "ok-line" },
      { t: `[!] Downloading personal_data.zip`, bar: true },
      { t: `[!] Deploying ransomware... 🚫 blocked by common sense`, cls: "warn-line" },
    ];
  }

  function print(line, mySession) {
    return new Promise(resolve => {
      const div = document.createElement("div");
      div.className = "line " + (line.cls || "");
      logEl.appendChild(div);
      if (line.bar) {
        div.innerHTML = `${escapeHtmlLocal(line.t)}<div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>`;
        const fill = div.querySelector(".progress-fill");
        let pct = 0;
        const step = () => {
          if (session !== mySession) return resolve();
          pct += rint(8, 22);
          fill.style.width = Math.min(pct, 100) + "%";
          if (pct < 100) setTimeout(step, 90); else setTimeout(resolve, 200);
        };
        step();
      } else {
        div.textContent = line.t;
        setTimeout(resolve, rint(260, 480));
      }
      logEl.scrollTop = logEl.scrollHeight;
    });
  }
  function escapeHtmlLocal(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  async function start() {
    session++;
    const mySession = session;
    logEl.innerHTML = ""; glitchEl.style.display = "none"; revealEl.style.display = "none";
    overlay.classList.add("open", "shake");

    for (const line of buildScript()) {
      if (session !== mySession) return;
      await print(line, mySession);
    }
    if (session !== mySession) return;
    await new Promise(r => setTimeout(r, 300));
    if (session !== mySession) return;
    overlay.classList.remove("shake");
    glitchEl.style.display = "block";
    await new Promise(r => setTimeout(r, 2200));
    if (session !== mySession) return;
    glitchEl.style.display = "none";
    revealEl.style.display = "flex";
  }
  function stop() {
    session++; // invalidate any in-flight sequence
    overlay.classList.remove("open", "shake");
    glitchEl.style.display = "none";
    revealEl.style.display = "none";
  }
  overlay.addEventListener("click", stop);
  return { start, stop };
}
function setCRT(enabled) { document.body.classList.toggle("crt-off", !enabled); }
function setParticlesFX(enabled) { document.body.classList.toggle("fx-off", !enabled); }
