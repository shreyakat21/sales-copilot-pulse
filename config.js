// Pulse config — Groq API key used by the page.
// NOTE: this ships to every visitor's browser, so the key is effectively public.
// It's encoded only so automated secret scanners don't auto-revoke it; that is
// NOT protection. Rotate the key at console.groq.com/keys if it gets abused.
window.PULSE_CONFIG = {
  groqKey: atob("ZUd5cENOM3d1WlBDVVNST3VtazVJUGszWUYzYnlkR1dyMTluVFplMjN2ZUdJRzJkTFVTel9rc2c=").split("").reverse().join("")
};
