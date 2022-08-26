import { writeFileSync } from 'fs';
import json2md from 'json2md';

export function generateMarkdownPlayMe(json) {
  const md = json2md([
    { h1: 'GAMES TO PLAY' },
    { p: `Last updated ${new Date().toISOString()}` },
    {
      code: {
        language: 'json',
        content: JSON.stringify(json, null, 2),
      },
    },
  ]);
  writeFileSync('PLAYME.md', md);
}
