(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const tryToggle = document.getElementById("tryToggle");
  const ripple = document.getElementById("rippleLayer");
  const previewMode = document.getElementById("previewMode");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isAnimating = false;

  function readSavedTheme() {
    try {
      const saved = localStorage.getItem("ripple-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {}
    return "dark";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const isLight = theme === "light";
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    toggle.querySelector(".toggle-label").textContent = isLight ? "DARK MODE" : "LIGHT MODE";
    previewMode.textContent = isLight ? "LIGHT THEME" : "DARK THEME";
    themeColor.setAttribute("content", isLight ? "#f4f6f2" : "#0b1020");
    try { localStorage.setItem("ripple-theme", theme); } catch (_) {}
  }

  function switchTheme(origin) {
    if (isAnimating) return;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    if (reducedMotion.matches) {
      applyTheme(nextTheme);
      return;
    }

    isAnimating = true;
    const rect = origin.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const nextBackground = nextTheme === "light" ? "#f4f6f2" : "#0b1020";

    ripple.style.backgroundColor = nextBackground;
    ripple.style.setProperty("--ripple-x", x + "px");
    ripple.style.setProperty("--ripple-y", y + "px");
    ripple.classList.remove("animate");
    void ripple.offsetWidth;
    ripple.classList.add("animate");

    const finish = () => {
      applyTheme(nextTheme);
      ripple.classList.remove("animate");
      ripple.style.backgroundColor = "transparent";
      isAnimating = false;
    };
    ripple.addEventListener("animationend", finish, { once: true });
    window.setTimeout(() => {
      if (isAnimating) finish();
    }, 1100);
  }

  applyTheme(readSavedTheme());
  toggle.addEventListener("click", () => switchTheme(toggle));
  tryToggle.addEventListener("click", () => switchTheme(tryToggle));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target === document.body) switchTheme(toggle);
  });
})();