import "./tile.scss";

interface TileProps {
  letter?: string;
  isLetterCorrect?: boolean;
  isLetterInCorrectPosition?: boolean;
  isLetterIncorrect?: boolean;
  tileIndex: number;
  shouldFlip: boolean;
  shouldAnimate: boolean;
}

export const Tile = ({
  letter,
  isLetterCorrect,
  isLetterInCorrectPosition,
  isLetterIncorrect,
  tileIndex,
  shouldFlip,
  shouldAnimate,
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

  if (shouldFlip && shouldAnimate) {
    className += " flip";
  }

  return (
    <div
      className={className}
      style={{ animationDelay: `${tileIndex * 200}ms` }}
    >
      {letter}
    </div>
  );
};
