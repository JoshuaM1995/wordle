import { Game } from "./components/Game";
import "./styles/global.scss";
import wordleWords from "./data/wordle-words.json";
import { Toaster } from "react-hot-toast";

const word = wordleWords[Math.floor(Math.random() * wordleWords.length)];

function App() {
  return (
    <>
      <Game correctWord={word} />

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
