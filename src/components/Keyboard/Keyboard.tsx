import "./keyboard.scss";

const firstRowKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const secondRowKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const thirdRowKeys = ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"];

interface KeyboardProps {
  correctWord: string;
  currentGuessIndex: number;
  guesses: (string | null)[];
  hasWonGame: boolean;
}

export const Keyboard = ({
  guesses,
  correctWord,
  currentGuessIndex,
  hasWonGame,
}: KeyboardProps) => {
  const getKeyClassName = (key: string) => {
    const correctWordLetters = correctWord.split("");
    // When the user has won the game, we include the current guess because it's the
    // answer to the wordle, so it should highlight those letters on the keyboard
    const filteredGuesses = hasWonGame
      ? guesses
      : guesses
          // Exclude the current guess, because we don't want to give away the
          // letters until the user submits
          .filter((_, i) => i !== currentGuessIndex);
    const allGuessLetters = filteredGuesses
      // The array is initialized with null guesses, so filter them out
      .filter((guess) => !!guess)
      .map((guess) => guess?.split(""));
    const hasBeenGuessed =
      (filteredGuesses?.find((guess) => guess?.includes(key))?.length ?? 0) > 0;
    const isKeyInCorrectPosition = correctWord.includes(key);
    const isKeyIncorrectGuess = !correctWord.includes(key);

    let isKeyCorrect = false;

    allGuessLetters.forEach((guess) => {
      if (guess?.includes(key)) {
        // If any of the guesses have any of the letters in the correct position,
        // then the key should have the correct styling
        guess?.forEach((guessLetter, j) => {
          if (guessLetter === correctWordLetters[j] && guessLetter === key) {
            isKeyCorrect = true;
          }
        });
      }
    });

    let className = "key";

    if (!hasBeenGuessed) {
      return className;
    }

    if (isKeyCorrect) {
      className += " correct";
    } else if (isKeyInCorrectPosition) {
      className += " correct-position";
    } else if (isKeyIncorrectGuess) {
      className += " incorrect";
    }

    return className;
  };

  return (
    <div id="keyboard">
      <div className="keyboard-row">
        {firstRowKeys.map((key) => {
          return <div className={getKeyClassName(key)}>{key}</div>;
        })}
      </div>

      <div className="keyboard-row">
        {secondRowKeys.map((key) => (
          <div className={getKeyClassName(key)}>{key}</div>
        ))}
      </div>

      <div className="keyboard-row">
        {thirdRowKeys.map((key) => {
          if (key === "backspace") {
            return (
              <div className="key backspace">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  data-testid="icon-backspace"
                >
                  <path
                    fill="var(--color-tone-1)"
                    d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                  ></path>
                </svg>
              </div>
            );
          }

          if (key === "enter") {
            return <div className="key enter">{key}</div>;
          }

          return <div className={getKeyClassName(key)}>{key}</div>;
        })}
      </div>
    </div>
  );
};
