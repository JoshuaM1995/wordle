import "./tile.scss";

interface TileProps {
  letter?: string;
}

export const Tile = ({ letter }: TileProps) => {
  return <div className="tile">{letter}</div>;
};
