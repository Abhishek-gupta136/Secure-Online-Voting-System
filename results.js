document.addEventListener("DOMContentLoaded", renderResults);

function renderResults() {
  const candidates = getCandidates();
  const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.votes || 0), 0);
  document.getElementById("totalVotesBox").innerHTML = `<i class="fa-solid fa-square-poll-vertical me-2"></i>${totalVotes} Total Votes`;
  renderWinner(candidates, totalVotes);
  renderResultList(candidates, totalVotes);
  renderChart(candidates);
}

function renderWinner(candidates, totalVotes) {
  const winnerBox = document.getElementById("winnerBox");
  if (!candidates.length) {
    winnerBox.innerHTML = `<h2 class="h5 mb-1">No candidates available</h2><p class="text-secondary mb-0">Add candidates from the admin panel to start the election.</p>`;
    return;
  }

  if (totalVotes === 0) {
    winnerBox.innerHTML = `<h2 class="h5 mb-1">Winner Pending</h2><p class="text-secondary mb-0">No votes have been cast yet.</p>`;
    return;
  }

  const highestVotes = Math.max(...candidates.map((candidate) => Number(candidate.votes || 0)));
  const leaders = candidates.filter((candidate) => Number(candidate.votes || 0) === highestVotes);
  const leaderNames = leaders.map((candidate) => candidate.name).join(", ");
  const title = leaders.length > 1 ? "Current Tie" : "Winner Declared";

  winnerBox.innerHTML = `
    <div class="d-flex align-items-center gap-3">
      <i class="fa-solid fa-trophy fs-1 text-warning"></i>
      <div>
        <h2 class="h4 mb-1">${title}: <span class="winner-name">${escapeHtml(leaderNames)}</span></h2>
        <p class="text-secondary mb-0">Leading with ${highestVotes} vote${highestVotes === 1 ? "" : "s"}.</p>
      </div>
    </div>
  `;
}

function renderResultList(candidates, totalVotes) {
  const list = document.getElementById("resultList");
  list.innerHTML = candidates
    .slice()
    .sort((a, b) => Number(b.votes || 0) - Number(a.votes || 0))
    .map((candidate) => {
      const voteCount = Number(candidate.votes || 0);
      const percent = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;
      return `
        <div class="result-item">
          <div>
            <strong>${escapeHtml(candidate.name)}</strong>
            <div class="text-secondary small">${escapeHtml(candidate.position)}</div>
          </div>
          <div class="text-end">
            <strong>${voteCount}</strong>
            <div class="text-secondary small">${percent}%</div>
          </div>
        </div>
      `;
    }).join("") || `<p class="text-secondary mb-0">No candidate data available.</p>`;
}

function renderChart(candidates) {
  const canvas = document.getElementById("resultChart");
  if (!canvas) return;
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: candidates.map((candidate) => candidate.name),
      datasets: [{
        label: "Votes",
        data: candidates.map((candidate) => Number(candidate.votes || 0)),
        backgroundColor: "rgba(13, 110, 253, 0.72)",
        borderColor: "rgba(13, 110, 253, 1)",
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (item) => `${item.raw} vote${item.raw === 1 ? "" : "s"}` } }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}
