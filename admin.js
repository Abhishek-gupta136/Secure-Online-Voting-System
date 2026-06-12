document.addEventListener("DOMContentLoaded", () => {
  const adminLoginForm = document.getElementById("adminLoginForm");
  const candidateForm = document.getElementById("candidateForm");
  const resetElection = document.getElementById("resetElection");
  const adminLogout = document.getElementById("adminLogout");

  if (readData(STORAGE_KEYS.adminSession, false)) {
    showAdminPanel();
  }

  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPass").value.trim();
    if (username === "admin" && password === "admin123") {
      writeData(STORAGE_KEYS.adminSession, true);
      showAdminPanel();
      showToast("Admin login successful.");
    } else {
      showToast("Invalid admin credentials.");
    }
  });

  candidateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("candidateName").value.trim();
    const position = document.getElementById("candidatePosition").value.trim();
    const photo = document.getElementById("candidatePhoto").value.trim();
    const manifesto = document.getElementById("candidateManifesto").value.trim();

    if (!name || !position || !manifesto) {
      showToast("Candidate name, position, and manifesto are required.");
      return;
    }

    const candidates = getCandidates();
    candidates.push({ id: makeId("cand"), name, position, photo, manifesto, votes: 0 });
    saveCandidates(candidates);
    candidateForm.reset();
    document.getElementById("candidatePosition").value = "Student Council President";
    renderAdminData();
    showToast("Candidate added successfully.");
  });

  resetElection.addEventListener("click", () => {
    if (!confirm("Reset all voters, candidates, votes, and sessions?")) return;
    localStorage.removeItem(STORAGE_KEYS.voters);
    localStorage.removeItem(STORAGE_KEYS.candidates);
    localStorage.removeItem(STORAGE_KEYS.currentVoter);
    initializeStore();
    renderAdminData();
    showToast("Election reset with default candidates.");
  });

  adminLogout.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.adminSession);
    window.location.reload();
  });
});

function showAdminPanel() {
  document.getElementById("adminLoginCard").classList.add("d-none");
  document.getElementById("adminPanel").classList.remove("d-none");
  renderAdminData();
}

function renderAdminData() {
  const voters = getVoters();
  const candidates = getCandidates();
  const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.votes || 0), 0);
  const votedCount = voters.filter((voter) => voter.hasVoted).length;

  document.getElementById("adminStats").innerHTML = `
    <div class="col-md-3"><div class="stat-card"><strong>${voters.length}</strong><span>Voters</span></div></div>
    <div class="col-md-3"><div class="stat-card"><strong>${candidates.length}</strong><span>Candidates</span></div></div>
    <div class="col-md-3"><div class="stat-card"><strong>${totalVotes}</strong><span>Total Votes</span></div></div>
    <div class="col-md-3"><div class="stat-card"><strong>${votedCount}</strong><span>Voted Users</span></div></div>
  `;

  document.getElementById("candidateTable").innerHTML = candidates.map((candidate) => `
    <tr>
      <td>${escapeHtml(candidate.name)}</td>
      <td>${escapeHtml(candidate.position)}</td>
      <td><span class="badge text-bg-primary">${candidate.votes || 0}</span></td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteCandidate('${candidate.id}')"><i class="fa-solid fa-trash"></i></button></td>
    </tr>
  `).join("") || `<tr><td colspan="4" class="text-center text-secondary">No candidates found.</td></tr>`;

  document.getElementById("voterTable").innerHTML = voters.map((voter) => `
    <tr>
      <td>${escapeHtml(voter.name)}</td>
      <td>${escapeHtml(voter.voterId)}</td>
      <td>${escapeHtml(voter.email)}</td>
      <td>${voter.hasVoted ? '<span class="badge text-bg-success">Voted</span>' : '<span class="badge text-bg-warning">Pending</span>'}</td>
    </tr>
  `).join("") || `<tr><td colspan="4" class="text-center text-secondary">No registered voters yet.</td></tr>`;
}

function deleteCandidate(candidateId) {
  const candidate = getCandidates().find((item) => item.id === candidateId);
  if (!candidate) return;
  if (candidate.votes > 0 && !confirm("This candidate has votes. Delete anyway? Vote records for this candidate will be removed.")) return;

  const candidates = getCandidates().filter((item) => item.id !== candidateId);
  const voters = getVoters().map((voter) => {
    if (voter.votedCandidateId === candidateId) {
      return { ...voter, hasVoted: false, votedCandidateId: null, votedAt: null };
    }
    return voter;
  });

  saveCandidates(candidates);
  saveVoters(voters);
  renderAdminData();
  showToast("Candidate deleted successfully.");
}
