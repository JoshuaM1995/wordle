import { useEffect, useState } from "react";
import { Tile } from "../Tile";
import "./game.scss";

const ROWS_PER_GAME = 6;
const TILES_PER_ROW = 5;
// Initialize the state with null values so we can check if a guess was made for the row yet
const emptyGuesses = Array.from({ length: ROWS_PER_GAME }).map(() => null);

interface GameProps {
  correctWord: string;
}

export const Game = ({ correctWord }: GameProps) => {
  const [guesses, setGuesses] = useState<(string | null)[]>(emptyGuesses);
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [hasWonGame, setHasWonGame] = useState(false);

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

      // TODO: Add logic to ensure entered word is a valid english 5 letter word
      // NOTE: A valid word may not necessarily be in the wordle words list, as they're curated
      if (key === "Enter" && currentGuess?.length === TILES_PER_ROW) {
        if (currentGuess === correctWord) {
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
            const guessForTile = guesses[i]?.[j] ?? "";
            const correctWordLetters = correctWord.split("");

            // Don't show the colors for tiles without any guesses yet
            if (guessForTile === "") {
              return <Tile letter={guessForTile} />;
            }

            console.log("Tile", {
              guessForTile,
              correctWordLetters,
              guessIndex: j,
            });

            const isLetterIncorrect = !correctWord.includes(guessForTile);
            const isLetterInCorrectPosition =
              correctWord.includes(guessForTile);
            const isLetterCorrect = correctWordLetters[j] === guessForTile;

            return (
              <Tile
                letter={guessForTile}
                isLetterCorrect={isLetterCorrect}
                isLetterInCorrectPosition={isLetterInCorrectPosition}
                isLetterIncorrect={isLetterIncorrect}
              />
            );
          })}
        </div>
      ))}
      Answer: {correctWord?.toUpperCase()}
    </div>
  );
};
