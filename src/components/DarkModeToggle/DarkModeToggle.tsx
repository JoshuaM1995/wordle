import { useLocalStorage } from "@uidotdev/usehooks";
import "./dark-mode-toggle.scss";
import { LOCAL_STORAGE_KEYS } from "../../constants";
import { useEffect } from "react";

export const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    LOCAL_STORAGE_KEYS.DARK_MODE,
    false
  );

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDarkMode(prefersDarkMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="dark-mode-toggle">
      <input
        id="toggle"
        type="checkbox"
        checked={isDarkMode}
        onChange={({ target: { checked } }) => {
          setIsDarkMode(checked);
        }}
      />
      <label htmlFor="toggle"></label>
    </div>
  );
};
