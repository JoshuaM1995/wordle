import "./tile.scss";

interface TileProps {
  letter?: string;
  isLetterCorrect?: boolean;
  isLetterInCorrectPosition?: boolean;
  isLetterIncorrect?: boolean;
}

export const Tile = ({
  letter,
  isLetterCorrect,
  isLetterInCorrectPosition,
  isLetterIncorrect,
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

  return <div className={className}>{letter}</div>;
};
