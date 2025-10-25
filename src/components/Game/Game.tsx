import { useState } from "react";
import { Tile } from "../Tile";
import "./game.scss";

const ROWS_PER_GAME = 6;
const TILES_PER_ROW = 5;
// Initialize the state with null values so we can check if a guess was made for the row yet
const emptyGuesses = Array.from({ length: ROWS_PER_GAME }).map(() => null);

export const Game = () => {
  const [guesses, setGuesses] = useState(emptyGuesses);

  return (
    <div id="game">
      {Array.from({ length: ROWS_PER_GAME }).map((_, i) => (
        <div className="tile-row">
          {Array.from({ length: TILES_PER_ROW }).map((__, j) => (
            <Tile />
          ))}
        </div>
      ))}
    </div>
  );
};
