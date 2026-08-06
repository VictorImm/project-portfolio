(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const savedTheme = () => {
    try {
      return localStorage.getItem("portfolio-theme");
    } catch {
      return null;
    }
  };

  const applyTheme = (theme, persist = false) => {
    const nextTheme = theme === "dark" ? "dark" : "light";
    const isDark = nextTheme === "dark";

    root.dataset.theme = nextTheme;
    themeColor?.setAttribute("content", isDark ? "#071321" : "#eef5ff");
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle?.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");

    if (!persist) return;
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      // Theme remains active for the current page when storage is unavailable.
    }
  };

  applyTheme(root.dataset.theme || (systemTheme.matches ? "dark" : "light"));
  themeToggle?.addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
  systemTheme.addEventListener?.("change", (event) => {
    if (!savedTheme()) applyTheme(event.matches ? "dark" : "light");
  });
})();
