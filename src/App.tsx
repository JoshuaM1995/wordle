import { useLocalStorage } from "@uidotdev/usehooks";
import { Toaster } from "react-hot-toast";
import { Game } from "./components/Game";
import wordleWords from "./data/wordle-words.json";
import "./styles/global.scss";
import { LOCAL_STORAGE_KEYS } from "./constants";

const word = wordleWords[Math.floor(Math.random() * wordleWords.length)];

function App() {
  const [correctWord] = useLocalStorage(LOCAL_STORAGE_KEYS.CORRECT_WORD, word);

  return (
    <>
      <Game correctWord={correctWord} />

      <Toaster
        toastOptions={{
          duration: 2000,
          style: {
            color: "#fff",
            background: "#000",
          },
        }}
      />
    </>
  );
}

export default App;
