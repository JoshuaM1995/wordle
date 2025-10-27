import "./tile.scss";
import { useState, useEffect, useRef } from "react";

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
  const [shouldPopIn, setShouldPopIn] = useState(false);
  const prevLetterRef = useRef<string>("");

  useEffect(() => {
    const prevLetter = prevLetterRef.current;
    console.log(`Tile ${tileIndex}: prevLetter="${prevLetter}", currentLetter="${letter}", shouldFlip: ${shouldFlip}`);
    
    if (!prevLetter && letter && !shouldFlip) {
      console.log(`Tile ${tileIndex}: triggering pop animation (transition from empty to "${letter}")`);
      setShouldPopIn(false);
      requestAnimationFrame(() => {
        setShouldPopIn(true);
      });
      prevLetterRef.current = letter;
      return;
    }
    
    prevLetterRef.current = letter || "";
  }, [letter, shouldFlip, tileIndex]);

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName === "flipTile") {
      setHasAnimated(true);
    }
  };

  let className = "tile";

  if (letter) {
    className += " has-letter";
  }

  if (shouldPopIn && !shouldFlip) {
    className += " pop-in";
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
        // @ts-expect-error custom properties
        "--flip-delay": `${tileIndex * 250}ms`,
        "--final-color": finalColor,
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      {letter}
    </div>
  );
};
