const TURKISH_CHAR_MAP = {
  '\u00e7': 'c',
  '\u011f': 'g',
  '\u0131': 'i',
  '\u00f6': 'o',
  '\u015f': 's',
  '\u00fc': 'u',
};

export const slugify = (value = '') =>
  String(value)
    .trim()
    .toLocaleLowerCase('tr')
    .split('')
    .map((character) => TURKISH_CHAR_MAP[character] || character)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
