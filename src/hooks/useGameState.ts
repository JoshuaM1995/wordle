import { useLocalStorage } from "@uidotdev/usehooks";
import { toast } from "react-hot-toast";
import { LOCAL_STORAGE_KEYS, ROWS_PER_GAME, TILES_PER_ROW } from "../constants";
import validWords from "../data/valid-words.json";

export interface HandleKeyPressOptions {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
}

// Initialize the state with null values so we can check if a guess was made for the row yet
const emptyGuesses = Array.from({ length: ROWS_PER_GAME }).map(() => null);

export const useGameState = (correctWord: string) => {
  const [guesses, setGuesses] = useLocalStorage<(string | null)[]>(
    LOCAL_STORAGE_KEYS.GUESSES,
    emptyGuesses
  );
  const [currentGuessIndex, setCurrentGuessIndex] = useLocalStorage(
    LOCAL_STORAGE_KEYS.CURRENT_GUESS_INDEX,
    0
  );
  const [hasWonGame, setHasWonGame] = useLocalStorage(
    LOCAL_STORAGE_KEYS.HAS_WON_GAME,
    false
  );

  const handleKeyPress = ({ key, metaKey, ctrlKey }: HandleKeyPressOptions) => {
    // Don't process keys when modifier keys are pressed (Cmd/Ctrl shortcuts)
    if (metaKey || ctrlKey) {
      return;
    }

    // The user has used up all their guesses or they won the game, so no point in applying the game logic
    if (currentGuessIndex === ROWS_PER_GAME || hasWonGame) {
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

      if (
        currentGuess &&
        // The guess has already been added to the array before pressing enter, so if we check length === 0
        // Then it will always be true and the user can never guess
        guesses.filter((guess) => guess === currentGuess).length > 1
      ) {
        toast("You already guessed this word!");
        return;
      }

      if (currentGuess === correctWord) {
        setHasWonGame(true);
        toast("You guessed the correct word!", {
          style: {
            color: "white",
            backgroundColor: "green",
          },
        });
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

  return {
    guesses,
    currentGuessIndex,
    hasWonGame,
    handleKeyPress,
  };
};
