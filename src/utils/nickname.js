const adjectives = [
  'Brave',
  'Swift',
  'Bright',
  'Calm',
  'Mighty',
  'Lucky',
  'Sharp',
  'Bold',
  'Wild',
  'Nimble',
  'Clever',
  'Steady',
];

const nouns = [
  'Fox',
  'Hawk',
  'Wolf',
  'Sparrow',
  'Tiger',
  'Pioneer',
  'Rider',
  'Builder',
  'Scout',
  'Drift',
  'Spark',
  'Orbit',
];

const seedToNumber = (seed) => {
  const value = `${seed || ''}`.trim().toLowerCase();
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash || Math.floor(Math.random() * 100000);
};

export const generateNickname = (seed = '') => {
  const number = seedToNumber(seed);
  const adjective = adjectives[number % adjectives.length];
  const noun = nouns[Math.floor(number / adjectives.length) % nouns.length];
  const suffix = String(number % 900 + 100);
  return `${adjective}${noun}${suffix}`;
};