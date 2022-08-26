import { existsSync, readFileSync, writeFileSync } from 'fs';

export function saveToFile(data) {
  writeFileSync('cache.json', JSON.stringify(data, null, 2));
}

export function loadFromFile() {
  if (!existsSync('./cache.json')) {
    return null;
  }
  return JSON.parse(readFileSync('./cache.json'));
}
