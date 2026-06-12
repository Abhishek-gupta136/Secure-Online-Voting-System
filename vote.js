document.addEventListener("DOMContentLoaded", () => {
  const voter = getCurrentVoter();
  if (!voter) {
    window.location.href = "login.html";
    return;
  }

  renderVoterDashboard(voter);
});

function renderVoterDashboard(voter) {
  const latestVoter = getVoters().find((item) => item.id === voter.id);
  const candidates = getCandidates();
  const list = document.getElementById("candidateList");
  const badge = document.getElementById("voteStatusBadge");
  document.getElementById("welcomeText").textContent = `Welcome, ${latestVoter.name} (${latestVoter.voterId})`;

  badge.innerHTML = latestVoter.hasVoted
    ? `<span class="badge badge-soft fs-6 p-3"><i class="fa-solid fa-check me-2"></i>Vote Submitted</span>`
    : `<span class="badge text-bg-warning fs-6 p-3"><i class="fa-solid fa-clock me-2"></i>Vote Pending</span>`;

  if (!candidates.length) {
    list.innerHTML = `<div class="col-12"><div class="alert alert-warning">No candidates are available. Please contact the administrator.</div></div>`;
    return;
  }

  list.innerHTML = candidates.map((candidate) => {
    const selected = latestVoter.votedCandidateId === candidate.id;
    return `
      <div class="col-md-6 col-xl-4">
        <div class="candidate-card">
          <div class="d-flex align-items-center gap-3 mb-3">
            ${candidateImage(candidate)}
            <div>
              <h2 class="h5 mb-1">${escapeHtml(candidate.name)}</h2>
              <span class="badge badge-soft">${escapeHtml(candidate.position)}</span>
            </div>
          </div>
          <p>${escapeHtml(candidate.manifesto)}</p>
          <button class="btn ${selected ? "btn-success" : "btn-primary"} w-100" ${latestVoter.hasVoted ? "disabled" : ""} onclick="castVote('${candidate.id}')">
            <i class="fa-solid ${selected ? "fa-check" : "fa-square-poll-vertical"} me-2"></i>${selected ? "Your Vote" : "Cast Vote"}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function castVote(candidateId) {
  const current = getCurrentVoter();
  const voters = getVoters();
  const voterIndex = voters.findIndex((voter) => voter.id === current.id);

  if (voterIndex === -1) {
    showToast("Voter session expired. Please login again.");
    clearCurrentVoter();
    setTimeout(() => window.location.href = "login.html", 800);
    return;
  }

  if (voters[voterIndex].hasVoted) {
    showToast("You have already voted. Duplicate voting is not allowed.");
    return;
  }

  const candidates = getCandidates();
  const candidateIndex = candidates.findIndex((candidate) => candidate.id === candidateId);
  if (candidateIndex === -1) {
    showToast("Candidate not found.");
    return;
  }

  candidates[candidateIndex].votes = Number(candidates[candidateIndex].votes || 0) + 1;
  voters[voterIndex].hasVoted = true;
  voters[voterIndex].votedCandidateId = candidateId;
  voters[voterIndex].votedAt = new Date().toISOString();

  saveCandidates(candidates);
  saveVoters(voters);
  setCurrentVoter(voters[voterIndex]);
  showToast("Your vote has been submitted successfully.");
  renderVoterDashboard(voters[voterIndex]);
}
