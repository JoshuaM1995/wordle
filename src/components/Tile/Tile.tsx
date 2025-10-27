import "./tile.scss";

interface TileProps {
  letter?: string;
  isLetterCorrect?: boolean;
  isLetterInCorrectPosition?: boolean;
  isLetterIncorrect?: boolean;
  tileIndex: number;
  shouldFlip: boolean;
}

export const Tile = ({
  letter,
  isLetterCorrect,
  isLetterInCorrectPosition,
  isLetterIncorrect,
  tileIndex,
  shouldFlip,
}: TileProps) => {
  let className = "tile";

  if (isLetterCorrect) {
    className += " correct";
  } else if (isLetterInCorrectPosition) {
    className += " correct-position ";
  } else if (isLetterIncorrect) {
    className += " incorrect";
  }

  if (letter) {
    className += " has-letter";
  }

  if (shouldFlip) {
    className += " flip";
  }

  return (
    <div
      className={className}
      style={{ animationDelay: `${tileIndex * 250}ms` }}
    >
      {letter}
    </div>
  );
};
