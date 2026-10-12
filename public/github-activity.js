(() => {
  const user = "carlangelomaniangap";
  const section = document.querySelector("#gh");
  const activity = document.querySelector("#gh-activity");
  const profileLink = document.querySelector("#gh-all");

  if (!user || !section || !activity) return;

  const dayKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const contributionCount = (event) => {
    if (event.type === "PushEvent") return Math.max(1, event.payload?.commits?.length || event.payload?.size || 1);
    if (event.type === "PullRequestReviewEvent" && event.payload?.action === "created") return 1;
    if (event.type === "PullRequestEvent" && ["opened", "closed"].includes(event.payload?.action)) return 1;
    if (event.type === "IssuesEvent" && event.payload?.action === "opened") return 1;
    return 0;
  };

  const render = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - (11 * 7 + today.getDay()));

    const byDay = new Map();
    const repositories = new Set();
    let total = 0;

    events.forEach((event) => {
      const amount = contributionCount(event);
      if (!amount) return;
      const key = event.created_at.slice(0, 10);
      byDay.set(key, (byDay.get(key) || 0) + amount);
      total += amount;
      if (event.repo?.name) repositories.add(event.repo.name);
    });

    const days = Array.from({ length: 84 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const count = date > today ? 0 : byDay.get(dayKey(date)) || 0;
      return { date, count, future: date > today };
    });
    const max = Math.max(1, ...days.map((day) => day.count));
    const activeDays = days.filter((day) => day.count > 0).length;

    activity.innerHTML = `
      <div class="gh-activity-copy">
        <p class="gh-kicker">CONTRIBUTION ACTIVITY</p>
        <h4>Recent public work</h4>
        <p>Public commits, pull requests, reviews, and issues from the latest GitHub activity available.</p>
      </div>
      <div class="gh-stats" aria-label="Recent public GitHub activity summary">
        <div><strong>${total}</strong><span>public contributions</span></div>
        <div><strong>${activeDays}</strong><span>active days</span></div>
        <div><strong>${repositories.size}</strong><span>repositories</span></div>
      </div>
      <div class="gh-calendar-wrap">
        <div class="gh-calendar" role="img" aria-label="Twelve-week calendar of recent public GitHub activity"></div>
        <div class="gh-legend"><span>Less</span><i data-level="0"></i><i data-level="1"></i><i data-level="2"></i><i data-level="3"></i><i data-level="4"></i><span>More</span></div>
      </div>
      <p class="gh-note">Shows recent public events only. Private work and older activity are not included.</p>`;

    const calendar = activity.querySelector(".gh-calendar");
    days.forEach(({ date, count, future }) => {
      const cell = document.createElement("span");
      const level = count ? Math.max(1, Math.ceil((count / max) * 4)) : 0;
      cell.dataset.level = String(level);
      if (future) cell.classList.add("is-future");
      cell.title = `${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}: ${count} public contribution${count === 1 ? "" : "s"}`;
      calendar.appendChild(cell);
    });

    if (profileLink) profileLink.href = `https://github.com/${encodeURIComponent(user)}`;
    activity.hidden = false;
    section.hidden = false;
  };

  const key = `gh-activity:${user}`;
  let cached = null;
  try { cached = JSON.parse(sessionStorage.getItem(key) || "null"); } catch {}

  if (cached && Date.now() - cached.time < 600000) {
    render(cached.events);
    return;
  }

  fetch(`https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100`)
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then((events) => {
      try { sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), events })); } catch {}
      render(events);
    })
    .catch(() => {});
})();
