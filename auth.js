document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const voterId = document.getElementById("voterId").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const department = document.getElementById("department").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!name || !voterId || !email || !department || password.length < 4) {
        showToast("Please fill all fields. Password must be at least 4 characters.");
        return;
      }

      const voters = getVoters();
      const exists = voters.some((voter) => voter.voterId.toLowerCase() === voterId.toLowerCase() || voter.email === email);
      if (exists) {
        showToast("A voter with this ID or email already exists.");
        return;
      }

      voters.push({
        id: makeId("voter"),
        name,
        voterId,
        email,
        department,
        password,
        hasVoted: false,
        votedCandidateId: null,
        registeredAt: new Date().toISOString()
      });
      saveVoters(voters);
      showToast("Registration successful. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 900);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const loginId = document.getElementById("loginId").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value.trim();
      const voter = getVoters().find((item) => (item.email === loginId || item.voterId.toLowerCase() === loginId) && item.password === password);

      if (!voter) {
        showToast("Invalid voter ID/email or password.");
        return;
      }

      setCurrentVoter(voter);
      window.location.href = "dashboard.html";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearCurrentVoter();
      window.location.href = "login.html";
    });
  }
});
