/**
 * GitHub live sync — uses the public REST API (no token required).
 * Rate limit: 60 req/hr per IP when unauthenticated. Fine for a personal
 * portfolio. For higher limits, add a token server-side (see README).
 */
const GitHubSync = (() => {
  const user = CONFIG.githubUsername;
  const base = "https://api.github.com";
  let cache = { profile: null, repos: null };

  async function safeFetch(url) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[GitHubSync]", err.message);
      return null;
    }
  }

  async function getProfile() {
    if (cache.profile) return cache.profile;
    cache.profile = await safeFetch(`${base}/users/${user}`);
    return cache.profile;
  }

  async function getRepos() {
    if (cache.repos) return cache.repos;
    const data = await safeFetch(`${base}/users/${user}/repos?per_page=100&sort=updated`);
    cache.repos = Array.isArray(data)
      ? data.filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count)
      : [];
    return cache.repos;
  }

  async function getLanguages(repos) {
    const totals = {};
    repos.slice(0, 12).forEach(r => {
      if (r.language) totals[r.language] = (totals[r.language] || 0) + 1;
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }

  function contributionGraphUrl() {
    // ghchart.rshah.org renders a public contribution heatmap image, no auth needed
    return `https://ghchart.rshah.org/00FF88/${user}`;
  }

  return { getProfile, getRepos, getLanguages, contributionGraphUrl, user };
})();
