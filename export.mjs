import json2csv from 'json2csv';
import { saveToFile } from './cache.mjs';

export function exportData(data) {
  saveToFile('./cache.json', data, true);
  saveToFile('./2play.json', data.toBePlayed, true);
  saveToFile(
    './2play.csv',
    json2csv.parse(data.toBePlayed, {
      header: true,
      fields: [
        {
          label: 'id',
          value: 'game.id',
        },
        {
          label: 'name',
          value: 'game.name',
        },
        {
          label: 'plays C',
          value: 'plays.ccanado',
        },
        {
          label: 'plays B',
          value: 'plays.bitio',
        },
      ],
    }),
    false
  );
}
