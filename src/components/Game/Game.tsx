import { Tile } from "../Tile";
import "./game.scss";

const TILES_PER_ROW = 5;
const ROWS_PER_GAME = 6;

export const Game = () => {
  return (
    <div id="game">
      {Array.from({ length: ROWS_PER_GAME }).map(() => (
        <div className="tile-row">
          {Array.from({ length: TILES_PER_ROW }).map(() => (
            <Tile />
          ))}
        </div>
      ))}
    </div>
  );
};
