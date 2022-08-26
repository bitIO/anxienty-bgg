import { loadFromBgg } from './bgg.mjs';
import { loadFromFile, saveToFile } from './cache.mjs';
import { generateMarkdownPlayMe } from './markdown.mjs';

function hastBeenPlayedTogether(gameId, gameName, usersPlays) {
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
    const hasPlayer1 = play.players.player.find(
      (p) => p.username === 'ccanado'
    );
    const hasPlayer2 = play.players.player.find((p) => p.username === 'bitio');

    return hasPlayer1 && hasPlayer2;
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
  let data = loadFromFile();
  if (!data) {
    data = await loadFromBgg();
    saveToFile(data);
  }

  data.toBePlayed = [];
  data.shelvesDiff.forEach((game) => {
    const { id, name, plays } = game;
    const played = hastBeenPlayedTogether(id, name, data.usersPlays);
    if (!played) {
      data.toBePlayed.push({
        game: { id, name },
        plays: {
          ccanado: data.shelves[0].item.find((game) => game.objectid === id)
            ?.numplays,
          bitio:
            data.shelves[1].item.find((game) => game.objectid === id)
              ?.numplays || 0,
        },
      });
    }
  });
  console.log('GamesToPlay:', JSON.stringify(data.toBePlayed, null, 2));
  saveToFile(data);
  generateMarkdownPlayMe(data.toBePlayed);
}

await main();
