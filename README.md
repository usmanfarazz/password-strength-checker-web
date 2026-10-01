# 🔐 Password Strength Checker (Web)

A zero-dependency, client-side password strength checker. Pure HTML, CSS and
JavaScript — no build step, no framework, no network calls. The password you
type never leaves your browser tab.

This is the web/UI companion to the [CLI version](https://github.com/usmanfarazz/password-analyzer)
written in Python + Bash.

## Features

- 📏 Live entropy estimate (bits) as you type
- ⏱️ Offline brute-force crack-time estimate (~10B guesses/sec)
- 🚩 Weak-pattern detection: common passwords (including dressed-up variants like `Password123!` or `p@ssw0rd`), keyboard sequences, repeated characters
- 🎨 Simple animated strength meter
- 🔒 Fully offline — everything runs in `script.js`, nothing is transmitted anywhere
- 🛡️ A strict Content-Security-Policy blocks any outgoing request, so the "no network calls" promise is enforced by the browser, not just by the code

## Usage

Just open `index.html` in any browser — no build tools or dependencies required.

```bash
git clone https://github.com/usmanfarazz/password-strength-checker-web.git
cd password-strength-checker-web
open index.html   # or just double-click it
```

## Stack

- HTML5
- CSS3 (custom properties, no framework)
- Vanilla JavaScript (ES6+)

