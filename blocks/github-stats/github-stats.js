/**
 * Content model: a "Github Stats" table, ONE row, ONE cell:
 *   the repo path, e.g. "adobe/aem-boilerplate"
 *
 * Real integration: fetches live data from GitHub's public REST API
 * (no auth needed for public repos) and renders it client-side.
 */
export default function decorate(block) {
  const repo = block.textContent.trim();
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'github-stats-wrapper';
  wrapper.innerHTML = '<p class="github-stats-loading">Loading live repo stats…</p>';
  block.append(wrapper);

  fetch(`https://api.github.com/repos/${repo}`)
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
      return res.json();
    })
    .then((data) => {
      wrapper.innerHTML = `
        <a href="${data.html_url}" target="_blank" rel="noopener" class="github-stats-repo">${data.full_name}</a>
        <div class="github-stats-row">
          <div class="github-stats-item">
            <div class="github-stats-num">${data.stargazers_count}</div>
            <div class="github-stats-lbl">Stars</div>
          </div>
          <div class="github-stats-item">
            <div class="github-stats-num">${data.forks_count}</div>
            <div class="github-stats-lbl">Forks</div>
          </div>
          <div class="github-stats-item">
            <div class="github-stats-num">${data.open_issues_count}</div>
            <div class="github-stats-lbl">Open issues</div>
          </div>
        </div>
      `;
    })
    .catch(() => {
      wrapper.innerHTML = '<p class="github-stats-error">Couldn\'t load live stats right now.</p>';
    });
}
