import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import type { HandleKeyPressOptions } from "../../hooks/useGameState";
import "./keyboard.scss";

const firstRowKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const secondRowKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const thirdRowKeys = ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"];

interface KeyboardProps {
  correctWord: string;
  currentGuessIndex: number;
  guesses: (string | null)[];
  hasWonGame: boolean;
  handleKeyPress: (options: HandleKeyPressOptions) => void;
  isAnimating: boolean;
  lastSubmittedRow: number;
}

const mapPhysicalKeyToVisual = (physicalKey: string) => {
  const key = physicalKey.toLowerCase();

  if (key === "enter") {
    return "enter";
  }

  if (key === "backspace") {
    return "backspace";
  }

  return key;
};

export const Keyboard = ({
  guesses,
  correctWord,
  currentGuessIndex,
  hasWonGame,
  handleKeyPress,
  isAnimating,
  lastSubmittedRow,
}: KeyboardProps) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const handleKeyPressRef = useRef(handleKeyPress);
  const isAnimatingRef = useRef(isAnimating);

  // Keep the refs up to date
  useEffect(() => {
    handleKeyPressRef.current = handleKeyPress;
  }, [handleKeyPress]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      // Don't show pressed key animation if tiles are animating
      if (!isAnimatingRef.current) {
        const visualKey = mapPhysicalKeyToVisual(event.key);
        setPressedKey(visualKey);

        // Clear the pressed key after animation
        setTimeout(() => {
          setPressedKey(null);
        }, 80);
      }

      handleKeyPressRef.current(event);
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Memoize expensive calculations
  const keyStates = useMemo(() => {
    const correctWordLetters = correctWord.split("");

    let filteredGuesses;
    if (hasWonGame) {
      filteredGuesses = guesses;
    } else if (isAnimating && lastSubmittedRow >= 0) {
      // Exclude the row that's currently animating
      filteredGuesses = guesses.filter(
        (_, i) => i !== currentGuessIndex && i !== lastSubmittedRow
      );
    } else {
      filteredGuesses = guesses.filter((_, i) => i !== currentGuessIndex);
    }

    const allGuessLetters = filteredGuesses
      .filter((guess) => !!guess)
      .map((guess) => guess?.split(""));

    const states: Record<
      string,
      {
        hasBeenGuessed: boolean;
        isKeyCorrect: boolean;
        isKeyInCorrectPosition: boolean;
        isKeyIncorrectGuess: boolean;
      }
    > = {};

    [...firstRowKeys, ...secondRowKeys, ...thirdRowKeys].forEach((key) => {
      const hasBeenGuessed =
        filteredGuesses?.some((guess) => guess?.includes(key)) ?? false;
      const isKeyInCorrectPosition = correctWord.includes(key);
      const isKeyIncorrectGuess = !correctWord.includes(key);

      let isKeyCorrect = false;
      allGuessLetters.forEach((guess) => {
        if (guess?.includes(key)) {
          guess?.forEach((guessLetter, j) => {
            if (guessLetter === correctWordLetters[j] && guessLetter === key) {
              isKeyCorrect = true;
            }
          });
        }
      });

      states[key] = {
        hasBeenGuessed,
        isKeyCorrect,
        isKeyInCorrectPosition,
        isKeyIncorrectGuess,
      };
    });

    return states;
  }, [
    correctWord,
    guesses,
    hasWonGame,
    currentGuessIndex,
    isAnimating,
    lastSubmittedRow,
  ]);

  const getKeyClassName = useCallback(
    (key: string) => {
      const state = keyStates[key];
      if (!state) return "key";

      let className = "key";

      // Add pressed key animation class only if not animating
      if (pressedKey === key.toLowerCase() && !isAnimating) {
        className += " key-pressed";
      }

      // Add color classes
      if (!state.hasBeenGuessed) {
        return className;
      }

      if (state.isKeyCorrect) {
        className += " correct";
      } else if (state.isKeyInCorrectPosition) {
        className += " correct-position";
      } else if (state.isKeyIncorrectGuess) {
        className += " incorrect";
      }

      return className;
    },
    [keyStates, pressedKey, isAnimating]
  );

  return (
    <div id="keyboard" className={isAnimating ? "disabled" : ""}>
      <div className="keyboard-row">
        {firstRowKeys.map((key) => (
          <div
            key={key}
            className={getKeyClassName(key)}
            onClick={() => {
              handleKeyPress({ key, metaKey: false, ctrlKey: false });
            }}
          >
            {key}
          </div>
        ))}
      </div>

      <div className="keyboard-row">
        {secondRowKeys.map((key) => (
          <div
            key={key}
            className={getKeyClassName(key)}
            onClick={() => {
              handleKeyPress({ key, metaKey: false, ctrlKey: false });
            }}
          >
            {key}
          </div>
        ))}
      </div>

      <div className="keyboard-row">
        {thirdRowKeys.map((key) => {
          if (key === "backspace") {
            return (
              <div
                key={key}
                className={`${getKeyClassName(key)} backspace`}
                onClick={() => {
                  handleKeyPress({
                    key: "Backspace",
                    metaKey: false,
                    ctrlKey: false,
                  });
                }}
              >
                <FontAwesomeIcon icon={faDeleteLeft} />
              </div>
            );
          }

          if (key === "enter") {
            return (
              <div
                key={key}
                className={`${getKeyClassName(key)} enter`}
                onClick={() => {
                  handleKeyPress({
                    key: "Enter",
                    metaKey: false,
                    ctrlKey: false,
                  });
                }}
              >
                {key}
              </div>
            );
          }

          return (
            <div
              key={key}
              className={getKeyClassName(key)}
              onClick={() => {
                handleKeyPress({ key, metaKey: false, ctrlKey: false });
              }}
            >
              {key}
            </div>
          );
        })}
      </div>
    </div>
  );
};
