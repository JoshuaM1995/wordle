import { useEffect, useState } from "react";
import { Tile } from "../Tile";
import "./game.scss";
import words from "../../data/words.json";

const ROWS_PER_GAME = 6;
const TILES_PER_ROW = 5;
// Initialize the state with null values so we can check if a guess was made for the row yet
const emptyGuesses = Array.from({ length: ROWS_PER_GAME }).map(() => null);

export const Game = () => {
  const [guesses, setGuesses] = useState<(string | null)[]>(emptyGuesses);
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [hasWonGame, setHasWonGame] = useState(false);
  const [word, setWord] = useState<string>();

  useEffect(() => {
    setWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  useEffect(() => {
    const keyUpEvent = ({ key }: KeyboardEvent) => {
      const currentGuess = guesses[currentGuessIndex]?.toLowerCase();
      const newGuesses = [...guesses];
      const validKeyRegex = /^[a-zA-Z]{1}$/;
      const validKeyMatches = key.match(validKeyRegex);

      if (key === "Backspace" && currentGuess) {
        newGuesses[currentGuessIndex] = currentGuess?.slice(0, -1);
        setGuesses(newGuesses);

        return;
      }

      if (key === "Enter") {
        if (currentGuess === word) {
          setHasWonGame(true);
          return;
        }

        // The answer is incorrect, so go to the next row
        setCurrentGuessIndex((prevIndex) => prevIndex + 1);
        return;
      }

      if ((validKeyMatches?.length ?? 0) === 0) {
        return;
      }

      const newGuess = `${currentGuess ?? ""}${key}`;

      // Don't allow guesses longer than x characters
      if (newGuess.length > TILES_PER_ROW) {
        return;
      }

      newGuesses[currentGuessIndex] = newGuess;
      setGuesses(newGuesses);
    };

    window.addEventListener("keyup", keyUpEvent);

    return () => {
      window.removeEventListener("keyup", keyUpEvent);
    };
  }, [guesses, currentGuessIndex]);

  return (
    <div id="game">
      {hasWonGame && "You won!!!!"}
      {Array.from({ length: ROWS_PER_GAME }).map((_, i) => (
        <div className="tile-row">
          {Array.from({ length: TILES_PER_ROW }).map((__, j) => {
            const guessForTile = guesses[i]?.[j];

            return <Tile letter={guessForTile ?? undefined} />;
          })}
        </div>
      ))}
      Answer: {word?.toUpperCase()}
    </div>
  );
};
