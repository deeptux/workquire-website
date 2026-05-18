import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({ theme: "light", setTheme: () => {}, toggle: () => {} });

const STORAGE_KEY = "wq-theme";

const applyThemeClass = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.setAttribute("data-theme", theme);
};

export const ThemeProvider = ({ children, defaultTheme = "light" }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) { /* ignore */ }
    return defaultTheme;
  });

  useEffect(() => {
    applyThemeClass(theme);
    try { window.localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
  }, [theme]);

  const setTheme = useCallback((next) => setThemeState(next), []);
  const toggle = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;
