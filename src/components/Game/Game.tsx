import { useEffect, useState } from "react";
import { Tile } from "../Tile";
import "./game.scss";

const ROWS_PER_GAME = 6;
const TILES_PER_ROW = 5;
// Initialize the state with null values so we can check if a guess was made for the row yet
const emptyGuesses = Array.from({ length: ROWS_PER_GAME }).map(() => null);

export const Game = () => {
  // const [guesses, setGuesses] = useState<(string | null)[]>(emptyGuesses);
  const [guesses, setGuesses] = useState<(string | null)[]>([
    "Hel",
    null,
    null,
    null,
    null,
    null,
  ]);
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);

  useEffect(() => {
    const keyUpEvent = ({ key }: KeyboardEvent) => {
      // TODO: Add validation to ensure key is valid
      // TODO: Add backspace logic

      const currentGuess = guesses[currentGuessIndex];
      const newGuess = `${currentGuess}${key}`;
      const newGuesses = [...guesses];

      newGuesses[currentGuessIndex] = newGuess;

      setGuesses(newGuesses);
    };

    window.addEventListener("keyup", keyUpEvent);

    return () => {
      window.removeEventListener("keyup", keyUpEvent);
    };
  }, [guesses, currentGuessIndex]);

  console.log("guesses", { guesses });

  return (
    <div id="game">
      {Array.from({ length: ROWS_PER_GAME }).map((_, i) => (
        <div className="tile-row">
          {Array.from({ length: TILES_PER_ROW }).map((__, j) => {
            const guessForTile = guesses[i]?.[j];

            return <Tile letter={guessForTile ?? undefined} />;
          })}
        </div>
      ))}
    </div>
  );
};
