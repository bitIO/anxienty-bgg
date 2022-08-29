import { loadFromBgg } from './bgg.mjs';
import { loadFromFile, saveToFile } from './cache.mjs';
import { exportData } from './export.mjs';
import { generateMarkdownPlayMe } from './markdown.mjs';

function hasBeenPlayedTogether(gameId, gameName, usersPlays) {
  const leftSidePLays = usersPlays[0].filter(
    (play) => play.item.objectid === gameId
  );
  const rightSidePLays = usersPlays[1].filter(
    (play) => play.item.objectid === gameId
  );

  const playedByBothAtPlayer1 = leftSidePLays.find((play) => {
    const hasPlayer1 = play.players.player.find(
      (p) => p.username === 'ccanado'
    );
    const hasPlayer2 = play.players.player.find((p) => p.username === 'bitio');

    return hasPlayer1 && hasPlayer2;
  });

  const playedByBothAtPlayer2 = rightSidePLays.find((play) => {
    try {
      const hasPlayer1 = Array.isArray(play.players.player)
        ? play.players.player.find((p) => p.username === 'ccanado')
        : false;
      const hasPlayer2 = Array.isArray(play.players.player)
        ? play.players.player.find((p) => p.username === 'bitio')
        : false;

      return hasPlayer1 && hasPlayer2;
    } catch (error) {
      console.log('Err');
    }
  });

  if (
    playedByBothAtPlayer1 === undefined &&
    playedByBothAtPlayer2 === undefined
  ) {
    return false;
  }
  return true;
}

async function main() {
  let data = loadFromFile('./cache.json');
  if (!data) {
    data = await loadFromBgg();
    saveToFile('./cache.json', data, true);
  }

  data.toBePlayed = [];
  data.shelvesDiff.forEach((game) => {
    const { id, name, plays } = game;
    const played = hasBeenPlayedTogether(id, name, data.usersPlays);
    if (!played) {
      console.log(name, 'has not been played by both');
      data.toBePlayed.push({
        game: { id, name },
        plays: {
          ccanado:
            data.shelves[0].item.find((game) => game.objectid === id)
              ?.numplays || 0,
          bitio:
            data.shelves[1].item.find((game) => game.objectid === id)
              ?.numplays || 0,
        },
      });
    }
  });

  exportData(data);
  generateMarkdownPlayMe(data.toBePlayed);
}

await main();
