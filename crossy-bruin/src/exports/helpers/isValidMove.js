import { minTile, maxTile } from "../globals";
import metadata from "../metadata";

export default function isValidMove(direction, currRow, currTile) {
  let newPosition = { row: currRow, tile: currTile };

  switch (direction) {
    case "forward":
      newPosition.row += 1;
      break;
    case "backward":
      newPosition.row -= 1;
      break;
    case "left":
      newPosition.tile -= 1;
      break;
    case "right":
      newPosition.tile += 1;
      break;
  }

  // border detection
  if (
    newPosition.row <= -1 ||
    newPosition.tile < minTile ||
    newPosition.tile > maxTile
  ) {
    return false;
  }

  // obstacle detection
  const rowData = metadata[newPosition.row - 1];

  if (
    rowData &&
    rowData.type === "trees" &&
    rowData.occupiedTiles &&
    rowData.occupiedTiles.has(newPosition.tile)
  ) {
    return false;
  }

  return true;
}
