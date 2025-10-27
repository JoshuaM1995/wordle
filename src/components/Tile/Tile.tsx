import "./tile.scss";
import { useState } from "react";

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
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleAnimationEnd = () => {
    setHasAnimated(true);
  };

  let className = "tile";

  if (letter) {
    className += " has-letter";
  }

  // Add color classes after animation completes
  if (shouldFlip && (!shouldAnimate || hasAnimated)) {
    if (isLetterCorrect) {
      className += " correct";
    } else if (isLetterInCorrectPosition) {
      className += " correct-position ";
    } else if (isLetterIncorrect) {
      className += " incorrect";
    }
  }

  if (shouldFlip && shouldAnimate && !hasAnimated) {
    className += " flip";
  }

  // Determine the final color for the animation
  let finalColor = "";
  if (isLetterCorrect) {
    finalColor = "var(--color-correct)";
  } else if (isLetterInCorrectPosition) {
    finalColor = "var(--color-correct-position)";
  } else if (isLetterIncorrect) {
    finalColor = "var(--color-incorrect)";
  }

  return (
    <div
      className={className}
      style={{
        animationDelay: `${tileIndex * 250}ms`,
        // @ts-expect-error final-color does not exist
        "--final-color": finalColor,
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      {letter}
    </div>
  );
};
