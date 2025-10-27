import { useLocalStorage } from "@uidotdev/usehooks";
import "./dark-mode-toggle.scss";
import { LOCAL_STORAGE_KEYS } from "../../constants";
import { useEffect } from "react";

export const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean | null>(
    LOCAL_STORAGE_KEYS.DARK_MODE,
    null
  );

  useEffect(() => {
    if (isDarkMode === null) {
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      toggleDarkMode(prefersDarkMode);

      return;
    }

    const html = document.documentElement;
    html.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDarkMode = (shouldSetDarkMode: boolean) => {
    const html = document.documentElement;

    if (shouldSetDarkMode) {
      html.setAttribute("data-theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
    }

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
