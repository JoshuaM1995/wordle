import { useLocalStorage } from "@uidotdev/usehooks";
import { Toaster } from "react-hot-toast";
import "./app.scss";
import { Game, Topbar } from "./components";
import { LOCAL_STORAGE_KEYS } from "./constants";
import wordleWords from "./data/wordle-words.json";
import "./styles/global.scss";

const word = wordleWords[Math.floor(Math.random() * wordleWords.length)];

function App() {
  const [correctWord] = useLocalStorage(LOCAL_STORAGE_KEYS.CORRECT_WORD, word);

  return (
    <div id="app">
      <Topbar />

      <Game correctWord={correctWord} />

      <Toaster
        toastOptions={{
          duration: 2000,
          style: {
            background: "var(--toast-background)",
            color: "var(--toast-text)",
          },
        }}
      />
    </div>
  );
}

export default App;
