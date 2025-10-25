import { useEffect, useState } from "react";
import validWords from "../../data/valid-words.json";
import { Tile } from "../Tile";
import "./game.scss";
import { toast } from "react-hot-toast";

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
      // The user has used up all their guesses
      if (currentGuessIndex === ROWS_PER_GAME) {
        // TODO: Handle this
        return;
      }

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
        if (!currentGuess) {
          toast("Please add some letters!");
          return;
        }

        if ((currentGuess?.length ?? 0) < TILES_PER_ROW) {
          toast("Too short!");
          return;
        }

        if (!validWords.includes(currentGuess)) {
          toast("Invalid word!");
          return;
        }

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

            // Don't show the colors for tiles without any guesses yet or if a guess hasn't been submitted
            if (
              guessForTile === "" ||
              (i === currentGuessIndex && !hasWonGame)
            ) {
              return <Tile letter={guessForTile} />;
            }

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

      {currentGuessIndex === ROWS_PER_GAME && !hasWonGame && (
        <div>Correct Answer: {correctWord?.toUpperCase()}</div>
      )}
    </div>
  );
};
