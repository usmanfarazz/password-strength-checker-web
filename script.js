/**
 * Password Strength Checker
 * 100% client-side. Nothing is sent over the network — the password
 * never leaves the browser tab.
 */

const COMMON_PASSWORDS = new Set([
  "password", "123456", "12345678", "qwerty", "abc123", "111111",
  "123123", "letmein", "iloveyou", "admin", "welcome", "monkey",
  "password1", "1234567", "12345", "1234567890", "football",
  "dragon", "master", "login", "princess", "solo", "qazwsx",
]);

const pwInput = document.getElementById("pwInput");
const toggleBtn = document.getElementById("toggleBtn");
const meterFill = document.getElementById("meterFill");
const strengthLabel = document.getElementById("strengthLabel");
const entropyValue = document.getElementById("entropyValue");
const crackValue = document.getElementById("crackValue");
const poolValue = document.getElementById("poolValue");
const issuesList = document.getElementById("issuesList");

toggleBtn.addEventListener("click", () => {
  const showing = pwInput.type === "text";
  pwInput.type = showing ? "password" : "text";
  toggleBtn.textContent = showing ? "👁" : "🙈";
});

pwInput.addEventListener("input", () => analyze(pwInput.value));

function poolSize(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  return pool;
}

function hasSequence(pw) {
  const lower = pw.toLowerCase();
  const sequences = ["abcdefghijklmnopqrstuvwxyz", "0123456789", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
  for (const seq of sequences) {
    for (let i = 0; i <= seq.length - 3; i++) {
      const chunk = seq.slice(i, i + 3);
      if (lower.includes(chunk) || lower.includes([...chunk].reverse().join(""))) {
        return true;
      }
    }
  }
  return false;
}

function hasRepeats(pw) {
  return /(.)\1\1/.test(pw);
}

function formatCrackTime(seconds) {
  if (!isFinite(seconds) || seconds <= 0) return "instantly";
  const units = [
    ["years", 365 * 24 * 3600],
    ["days", 24 * 3600],
    ["hours", 3600],
    ["minutes", 60],
    ["seconds", 1],
  ];
  for (const [name, secs] of units) {
    if (seconds >= secs) {
      const value = seconds / secs;
      return `${value >= 1000 ? value.toExponential(2) : value.toFixed(1)} ${name}`;
    }
  }
  return "instantly";
}

function analyze(pw) {
  if (!pw) {
    meterFill.style.width = "0%";
    meterFill.style.background = "var(--weak)";
    strengthLabel.textContent = "Strength: —";
    entropyValue.textContent = "0 bits";
    crackValue.textContent = "—";
    poolValue.textContent = "0";
    issuesList.innerHTML = "";
    return;
  }

  const pool = poolSize(pw);
  const entropy = pw.length * Math.log2(pool || 1);
  // Offline guess rate, matches the CLI tool's assumption (~10 billion guesses/sec)
  const guessesPerSecond = 1e10;
  const crackSeconds = Math.pow(2, entropy) / guessesPerSecond;

  const issues = [];
  if (pw.length < 8) issues.push({ ok: false, text: "Too short — use at least 12 characters" });
  if (!/[A-Z]/.test(pw)) issues.push({ ok: false, text: "Add an uppercase letter" });
  if (!/[a-z]/.test(pw)) issues.push({ ok: false, text: "Add a lowercase letter" });
  if (!/[0-9]/.test(pw)) issues.push({ ok: false, text: "Add a digit" });
  if (!/[^a-zA-Z0-9]/.test(pw)) issues.push({ ok: false, text: "Add a symbol" });
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) issues.push({ ok: false, text: "This is a widely known common password" });
  if (hasSequence(pw)) issues.push({ ok: false, text: "Avoid keyboard/alphabet sequences (e.g. abc, qwe)" });
  if (hasRepeats(pw)) issues.push({ ok: false, text: "Avoid repeating the same character 3+ times" });

  if (issues.length === 0) {
    issues.push({ ok: true, text: "No obvious weaknesses found" });
  }

  let score = 0;
  if (entropy > 28) score = 1;
  if (entropy > 40) score = 2;
  if (entropy > 60) score = 3;
  if (entropy > 80) score = 4;
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) score = 0;

  const levels = [
    { pct: 10, color: "var(--weak)", label: "Very Weak" },
    { pct: 30, color: "var(--weak)", label: "Weak" },
    { pct: 55, color: "var(--medium)", label: "Fair" },
    { pct: 80, color: "var(--medium)", label: "Strong" },
    { pct: 100, color: "var(--strong)", label: "Very Strong" },
  ];
  const level = levels[score];

  meterFill.style.width = `${level.pct}%`;
  meterFill.style.background = level.color;
  strengthLabel.textContent = `Strength: ${level.label}`;
  entropyValue.textContent = `${entropy.toFixed(1)} bits`;
  crackValue.textContent = formatCrackTime(crackSeconds);
  poolValue.textContent = pool;

  issuesList.innerHTML = issues
    .map((i) => `<li class="${i.ok ? "ok" : ""}">${i.ok ? "✅" : "⚠️"} ${i.text}</li>`)
    .join("");
}

