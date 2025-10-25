import { Game } from "./components/Game";
import "./styles/global.scss";
import words from "./data/words.json";

const word = words[Math.floor(Math.random() * words.length)];

function App() {
  return <Game correctWord={word} />;
}

export default App;
