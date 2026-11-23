var rules = {
  name: function (v) {
    var t = v.trim();
    if (t.length < 2) return "Enter your full name (at least 2 characters).";
    if (t.length > 60) return "Name must be under 60 characters.";
    return "";
  },
  email: function (v) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? "" : "Enter an email like name@example.com.";
  },
  password: function (v) {
    return v.length >= 10 && /\d/.test(v) ? "" : "Use at least 10 characters including a number.";
  },
  confirm: function (v) {
    return v === document.getElementById("password").value ? "" : "The passwords do not match.";
  }
};

function check(input) {
  var message = rules[input.name](input.value);
  var error = document.getElementById(input.name + "-error");
  error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

function updateStrength() {
  var v = document.getElementById("password").value;
  var bar = document.getElementById("meter-bar");
  var text = document.getElementById("strength-text");
  if (!v) { bar.style.width = "0"; text.textContent = ""; return; }

  var score = 0;
  if (v.length >= 10) score++;
  if (v.length >= 14) score++;
  if (/\d/.test(v)) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;

  if (score <= 2) { bar.style.width = "33%"; bar.style.background = "#dc2626"; text.textContent = "Strength: Weak"; }
  else if (score <= 3) { bar.style.width = "66%"; bar.style.background = "#f59e0b"; text.textContent = "Strength: Medium"; }
  else { bar.style.width = "100%"; bar.style.background = "#16a34a"; text.textContent = "Strength: Strong"; }
}

var form = document.getElementById("signup");

Array.from(form.elements).forEach(function (input) {
  if (!rules[input.name]) return;
  input.addEventListener("blur", function () { check(input); });
  input.addEventListener("input", function () {
    if (input.getAttribute("aria-invalid") === "true") check(input);
    if (input.name === "password") updateStrength();
    if (input.name === "password" && document.getElementById("confirm").value) check(document.getElementById("confirm"));
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var invalid = Array.from(form.elements).filter(function (i) {
    return rules[i.name] && !check(i);
  });
  if (invalid.length) { invalid[0].focus(); return; }
  document.getElementById("success-msg").textContent = "Account created! All checks passed.";
});