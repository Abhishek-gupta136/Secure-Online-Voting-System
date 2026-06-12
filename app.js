const STORAGE_KEYS = {
  voters: "ovs_voters",
  candidates: "ovs_candidates",
  currentVoter: "ovs_current_voter",
  adminSession: "ovs_admin_session"
};

const defaultCandidates = [
  {
    id: "cand_1",
    name: "Ayesha Rahman",
    position: "Student Council President",
    photo: "",
    manifesto: "Improve campus communication, organize monthly student forums, and promote transparent student activities.",
    votes: 0
  },
  {
    id: "cand_2",
    name: "Rohan Mehta",
    position: "Student Council President",
    photo: "",
    manifesto: "Create a better academic support network, strengthen club funding, and improve event participation.",
    votes: 0
  },
  {
    id: "cand_3",
    name: "Priya Das",
    position: "Student Council President",
    photo: "",
    manifesto: "Focus on digital notices, student wellness programs, and a cleaner, safer campus environment.",
    votes: 0
  }
];

function readData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Local Storage read failed:", error);
    return fallback;
  }
}

function writeData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initializeStore() {
  if (!localStorage.getItem(STORAGE_KEYS.candidates)) {
    writeData(STORAGE_KEYS.candidates, defaultCandidates);
  }
  if (!localStorage.getItem(STORAGE_KEYS.voters)) {
    writeData(STORAGE_KEYS.voters, []);
  }
}

function getVoters() {
  return readData(STORAGE_KEYS.voters, []);
}

function saveVoters(voters) {
  writeData(STORAGE_KEYS.voters, voters);
}

function getCandidates() {
  return readData(STORAGE_KEYS.candidates, defaultCandidates);
}

function saveCandidates(candidates) {
  writeData(STORAGE_KEYS.candidates, candidates);
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function candidateImage(candidate) {
  if (candidate.photo) {
    return `<img class="candidate-photo" src="${escapeHtml(candidate.photo)}" alt="${escapeHtml(candidate.name)}">`;
  }
  const initial = escapeHtml(candidate.name.charAt(0).toUpperCase());
  return `<div class="candidate-avatar">${initial}</div>`;
}

function showToast(message) {
  const toastEl = document.getElementById("appToast");
  if (!toastEl) {
    alert(message);
    return;
  }
  toastEl.querySelector(".toast-body").textContent = message;
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

function getCurrentVoter() {
  return readData(STORAGE_KEYS.currentVoter, null);
}

function setCurrentVoter(voter) {
  writeData(STORAGE_KEYS.currentVoter, voter);
}

function clearCurrentVoter() {
  localStorage.removeItem(STORAGE_KEYS.currentVoter);
}

function getElectionStats() {
  const voters = getVoters();
  const candidates = getCandidates();
  const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.votes || 0), 0);
  const votedCount = voters.filter((voter) => voter.hasVoted).length;
  return { voters, candidates, totalVotes, votedCount };
}

function renderHomeStats() {
  const holder = document.getElementById("homeStats");
  if (!holder) return;
  const stats = getElectionStats();
  holder.innerHTML = `
    <div class="col-6"><div class="stat-mini"><strong>${stats.voters.length}</strong><span>Registered Voters</span></div></div>
    <div class="col-6"><div class="stat-mini"><strong>${stats.candidates.length}</strong><span>Candidates</span></div></div>
    <div class="col-6"><div class="stat-mini"><strong>${stats.totalVotes}</strong><span>Total Votes</span></div></div>
    <div class="col-6"><div class="stat-mini"><strong>${stats.votedCount}</strong><span>Voted</span></div></div>
  `;
}

initializeStore();
document.addEventListener("DOMContentLoaded", renderHomeStats);
