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
      const currentGuess = guesses[currentGuessIndex];
      const newGuesses = [...guesses];
      const validKeyRegex = /^[a-z]{1}$/;
      const validKeyMatches = key.match(validKeyRegex);

      if ((validKeyMatches?.length ?? 0) === 0) {
        return;
      }

      // TODO: Add enter logic to check if the word is correct

      if (key === "Backspace" && currentGuess) {
        newGuesses[currentGuessIndex] = currentGuess?.slice(0, -1);
        setGuesses(newGuesses);

        return;
      }

      const newGuess = `${currentGuess}${key}`;

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
