SecureVote — Online Voting System

A responsive, front-end-only college election platform built with HTML, CSS (Bootstrap 5), and vanilla JavaScript. It supports voter registration and login, one-person-one-vote casting, candidate management via an admin panel, and real-time result visualization. All data is stored locally in the browser using localStorage — no backend or database required.

Features


Voter Registration & Login — voters sign up with a unique Voter ID and email, then log in to access their dashboard.
One Person, One Vote — each voter can cast a single vote; the system prevents duplicate voting.
Candidate Management — admin panel to add, edit, or remove candidates and their manifestos.
Live Results — real-time vote count and result charts on the results page.
Admin Dashboard — separate admin login to manage candidates and monitor election stats.
Responsive UI — built with Bootstrap 5 and Font Awesome icons, works on desktop and mobile.


Project Structure

online-voting-system/
├── index.html        # Landing page
├── login.html         # Voter login
├── register.html      # Voter registration
├── dashboard.html      # Voter dashboard (cast vote)
├── results.html        # Live election results
├── admin.html          # Admin panel
├── css/
│   └── style.css
├── js/
│   ├── app.js          # Shared data store (localStorage) & utilities
│   ├── auth.js          # Registration & login logic
│   ├── vote.js          # Voting logic
│   ├── results.js        # Results rendering
│   └── admin.js          # Admin panel logic
└── assets/
    └── images/

Tech Stack


HTML5, CSS3
Bootstrap 5.3
Font Awesome 6.5
Vanilla JavaScript (ES6+)
Browser localStorage for data persistence


Getting Started

Option 1: Open directly

Open index.html in your browser. Note: some features may be limited under the file:// protocol due to browser security restrictions.

Option 2: Run with a local server (recommended)

Using VS Code's Live Server extension:


Open the project folder in VS Code.
Right-click index.html → Open with Live Server.
The site will open at http://127.0.0.1:5500/index.html (or similar).


Or using Python:

bashpython -m http.server 5500

Then visit http://localhost:5500/.

Usage


Register as a voter from the homepage.
Log in with your Voter ID/email and password.
Cast your vote from the dashboard (one vote per voter).
View results on the live results page.
Admin access: open admin.html to manage candidates and view overall stats.


Notes


This is a demo / academic mini-project (Software Project Lab). It is not intended for production or real elections — data is stored client-side and is not secure or tamper-proof.
To reset all data, clear your browser's local storage for this site.


License

This project is open-source and free to use for educational purposes.
