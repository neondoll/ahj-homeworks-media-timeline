import { isValidCoordinates } from '../validators';

describe('module validators', () => {
  describe('isValidCoordinates(coords)', () => {
    test.each([
      { coords: '51.50851, -0.12572' },
      { coords: '51.50851,-0.12572' },
      { coords: '[51.50851, -0.12572]' },
    ])('coords="$coords" => success', ({ coords }) => {
      expect(isValidCoordinates(coords)).toEqual({ latitude: 51.50851, longitude: -0.12572 });
    });

    test.each([
      { coords: '' },
      { coords: 's1.50851, -0.12572' },
      { coords: '51.50851, -o.12572' },
      { coords: '51.5085i, -0.12572' },
      { coords: '(51.50851, -0.12572)' },
      { coords: '{51.50851, -0.12572}' },
    ])('coords="$coords" => throw', ({ coords }) => {
      expect(() => isValidCoordinates(coords)).toThrow(Error);
    });
  });
});
