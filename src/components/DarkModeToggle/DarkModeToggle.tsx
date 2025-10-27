import { useLocalStorage } from "@uidotdev/usehooks";
import "./dark-mode-toggle.scss";
import { LOCAL_STORAGE_KEYS } from "../../constants";
import { useEffect } from "react";

export const DarkModeToggle = () => {
  const getInitialValue = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE);
      if (stored !== null && stored !== "null") {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Ignore parse errors
    }
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark;
  };

  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    LOCAL_STORAGE_KEYS.DARK_MODE,
    getInitialValue()
  );

  // Apply theme whenever isDarkMode changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = (shouldSetDarkMode: boolean) => {
    setIsDarkMode(shouldSetDarkMode);
  };

  return (
    <div id="dark-mode-toggle">
      <input
        id="toggle"
        type="checkbox"
        checked={isDarkMode ?? false}
        onChange={({ target: { checked } }) => toggleDarkMode(checked)}
      />
      <label htmlFor="toggle"></label>
    </div>
  );
};
