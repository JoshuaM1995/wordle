import { Game } from "./components/Game";
import "./styles/global.scss";
import wordleWords from "./data/wordle-words.json";

const word = wordleWords[Math.floor(Math.random() * wordleWords.length)];

function App() {
  return <Game correctWord={word} />;
}

export default App;
