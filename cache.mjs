import { existsSync, readFileSync, writeFileSync } from 'fs';

export function saveToFile(fileName, data, isJson) {
  if (isJson) {
    return writeFileSync(fileName, JSON.stringify(data, null, 2));
  }
  return writeFileSync(fileName, data, null, 2);
}

export function loadFromFile(fileName) {
  if (!existsSync(fileName)) {
    return null;
  }
  return JSON.parse(readFileSync(fileName));
}
