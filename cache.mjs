import { existsSync, readFileSync, writeFileSync } from 'fs';

export function saveToFile(fileName, data) {
  writeFileSync(fileName, JSON.stringify(data, null, 2));
}

export function loadFromFile(fileName) {
  if (!existsSync(fileName)) {
    return null;
  }
  return JSON.parse(readFileSync(fileName));
}
