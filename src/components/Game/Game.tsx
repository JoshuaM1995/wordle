import {
  LOCAL_STORAGE_KEYS,
  ROWS_PER_GAME,
  TILES_PER_ROW,
} from "../../constants";
import { useGameState } from "../../hooks/useGameState";
import { Keyboard } from "../Keyboard";
import { Tile } from "../Tile";
import "./game.scss";
import { useState, useEffect } from "react";

interface GameProps {
  correctWord: string;
}

export const Game = ({ correctWord }: GameProps) => {
  const { guesses, currentGuessIndex, hasWonGame, handleKeyPress, lastSubmittedRow } =
    useGameState(correctWord);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(
    currentGuessIndex === ROWS_PER_GAME && !hasWonGame
  );

  useEffect(() => {
    if (currentGuessIndex === ROWS_PER_GAME && !hasWonGame && lastSubmittedRow === ROWS_PER_GAME - 1) {
      const FLIP_ANIMATION_DURATION = 800;
      const TILE_FLIP_DELAY = 250;
      const LAST_TILE_INDEX = TILES_PER_ROW - 1;
      const totalAnimationTime = LAST_TILE_INDEX * TILE_FLIP_DELAY + FLIP_ANIMATION_DURATION;
      
      const timer = setTimeout(() => {
        setShowCorrectAnswer(true);
      }, totalAnimationTime);

      return () => clearTimeout(timer);
    }
  }, [currentGuessIndex, hasWonGame, lastSubmittedRow]);

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
          <div key={i} className="tile-row">
            {Array.from({ length: TILES_PER_ROW }).map((__, j) => {
              const guessForTile = guesses[i]?.[j] ?? "";
              const correctWordLetters = correctWord.split("");

              // Don't show the colors for tiles without any guesses yet or if a guess hasn't been submitted
              if (
                guessForTile === "" ||
                (i === currentGuessIndex && !hasWonGame)
              ) {
                return (
                  <Tile
                    key={`${i}-${j}`}
                    tileIndex={j}
                    shouldFlip={false}
                    shouldAnimate={false}
                    letter={guessForTile}
                  />
                );
              }

              const isLetterIncorrect = !correctWord.includes(guessForTile);
              const isLetterInCorrectPosition =
                correctWord.includes(guessForTile);
              const isLetterCorrect = correctWordLetters[j] === guessForTile;
              const isCurrentRow = i === currentGuessIndex;
              const shouldFlip =
                i < currentGuessIndex || (isCurrentRow && hasWonGame);
              const shouldAnimate = i === lastSubmittedRow;

              return (
                <Tile
                  key={`${i}-${j}`}
                  tileIndex={j}
                  shouldFlip={shouldFlip}
                  shouldAnimate={shouldAnimate}
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

        {currentGuessIndex === ROWS_PER_GAME && !hasWonGame && showCorrectAnswer && (
          <div id="correct-answer" className="fade-in">
            Correct Answer: {correctWord?.toUpperCase()}
          </div>
        )}
      </div>
    </>
  );
};
