export function isValidCoordinates(coords) {
  const regexp = /^\[?(-?\d+(?:\.\d+)?),\s?(-?\d+(?:\.\d+)?)\]?$/;

  const result = coords.match(regexp);

  console.log(coords, regexp, result);

  if (result === null) {
    throw new Error('Некорректный формат координат');
  }

  return { latitude: Number(result[1]), longitude: Number(result[2]) };
}
