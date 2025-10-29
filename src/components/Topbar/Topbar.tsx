import { DarkModeToggle } from "../DarkModeToggle/DarkModeToggle";
import { LOCAL_STORAGE_KEYS } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./topbar.scss";

export const Topbar = () => {
  const handleNewWordle = () => {
    const hasConfirmed = window.confirm(
      "Are you sure you want to create a new Wordle? All your progress will be lost."
    );

    if (hasConfirmed) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.GUESSES);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_GUESS_INDEX);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CORRECT_WORD);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.HAS_WON_GAME);
      window.location.reload();
    }
  };

  return (
    <div id="topbar">
      <button id="new-wordle" onClick={handleNewWordle}>
        <FontAwesomeIcon icon={faPlus} />
        New Wordle
      </button>
      <DarkModeToggle />
    </div>
  );
};
