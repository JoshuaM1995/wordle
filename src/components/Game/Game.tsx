import {
  LOCAL_STORAGE_KEYS,
  ROWS_PER_GAME,
  TILES_PER_ROW,
} from "../../constants";
import { useGameState } from "../../hooks/useGameState";
import { Keyboard } from "../Keyboard";
import { Tile } from "../Tile";
import "./game.scss";

interface GameProps {
  correctWord: string;
}

export const Game = ({ correctWord }: GameProps) => {
  const { guesses, currentGuessIndex, hasWonGame, handleKeyPress } =
    useGameState(correctWord);

  return (
    <>
      <div id="game">
        <h1 className="title">Wordle Practice</h1>

        <button
          id="new-wordle"
          onClick={() => {
            const hasConfirmed = window.confirm(
              "Are you sure you want to create a new Wordle? All your progress will be lost."
            );

            if (hasConfirmed) {
              localStorage.removeItem(LOCAL_STORAGE_KEYS.GUESSES);
              localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_GUESS_INDEX);
              localStorage.removeItem(LOCAL_STORAGE_KEYS.CORRECT_WORD);
              localStorage.removeItem(LOCAL_STORAGE_KEYS.HAS_WON_GAME);
              window.location.reload();
            }
          }}
        >
          New Wordle
        </button>

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

        <Keyboard
          correctWord={correctWord}
          currentGuessIndex={currentGuessIndex}
          guesses={guesses}
          hasWonGame={hasWonGame}
          handleKeyPress={handleKeyPress}
        />

        {currentGuessIndex === ROWS_PER_GAME && !hasWonGame && (
          <div id="correct-answer">
            Correct Answer: {correctWord?.toUpperCase()}
          </div>
        )}
      </div>
    </>
  );
};
