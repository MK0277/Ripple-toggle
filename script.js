(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const tryToggle = document.getElementById("tryToggle");
  const layer = document.getElementById("transitionLayer");
  const previewMode = document.getElementById("previewMode");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const description = document.getElementById("previewDescription");
  const effectNumber = document.getElementById("selectedEffectNumber");
  const effectLabel = document.getElementById("selectedEffectLabel");
  const options = [...document.querySelectorAll(".animation-option")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const effects = {
    water: { name: "WATER RIPPLE", number: "01", description: "A fluid circle expands from your click and gently settles into the new theme.", duration: 920 },
    cube: { name: "SOLVING CUBE", number: "02", description: "A dimensional cube turns through space while the new colour palette comes into view.", duration: 1100 },
    chess: { name: "CHESSBOARD", number: "03", description: "A clean checkerboard pattern sweeps across the screen, revealing the next theme.", duration: 1000 },
    wind: { name: "SOFT WIND", number: "04", description: "A soft, sweeping gust glides across the page and carries the new theme with it.", duration: 1050 },
    paper: { name: "UNFOLD PAPER", number: "05", description: "A folded paper-like surface relaxes, unfolds, and opens into a perfectly flat view.", duration: 1150 }
  };
  let selectedEffect = "water";
  let isAnimating = false;
  let animationTimer;

  function readSavedTheme() {
    try {
      const saved = localStorage.getItem("ripple-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {}
    return "dark";
  }

  function readSavedEffect() {
    try {
      const saved = localStorage.getItem("ripple-effect");
      if (effects[saved]) return saved;
    } catch (_) {}
    return "water";
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

  function selectEffect(effect) {
    if (!effects[effect]) return;
    selectedEffect = effect;
    options.forEach((button) => {
      const active = button.dataset.effect === effect;
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    description.textContent = effects[effect].description;
    effectNumber.textContent = effects[effect].number;
    effectLabel.textContent = effects[effect].name;
    try { localStorage.setItem("ripple-effect", effect); } catch (_) {}
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
    layer.style.setProperty("--origin-x", (rect.left + rect.width / 2) + "px");
    layer.style.setProperty("--origin-y", (rect.top + rect.height / 2) + "px");
    layer.style.setProperty("--next-bg", nextTheme === "light" ? "#f4f6f2" : "#0b1020");
    layer.dataset.effect = selectedEffect;
    layer.classList.remove("is-running");
    void layer.offsetWidth;
    layer.classList.add("is-running");

    const finish = () => {
      if (!isAnimating) return;
      window.clearTimeout(animationTimer);
      applyTheme(nextTheme);
      layer.classList.remove("is-running");
      isAnimating = false;
    };
    animationTimer = window.setTimeout(finish, effects[selectedEffect].duration);
    layer.addEventListener("animationend", (event) => {
      if (event.target === event.currentTarget.querySelector(".effect-surface") ||
          event.target === event.currentTarget.querySelector(".effect-cube") ||
          event.target === event.currentTarget.querySelector(".effect-grid") ||
          event.target === event.currentTarget.querySelector(".effect-wind") ||
          event.target === event.currentTarget.querySelector(".effect-paper")) finish();
    }, { once: true });
  }

  options.forEach((button) => button.addEventListener("click", () => {
    if (!isAnimating) selectEffect(button.dataset.effect);
  }));
  applyTheme(readSavedTheme());
  selectEffect(readSavedEffect());
  toggle.addEventListener("click", () => switchTheme(toggle));
  tryToggle.addEventListener("click", () => switchTheme(tryToggle));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target === document.body) switchTheme(toggle);
  });
})();