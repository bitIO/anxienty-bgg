import * as bgg from 'bgg-xml-api-client';
import _ from 'lodash';

async function getUser(userName) {
  const response = await bgg.getBggUser({ name: userName });
  return response.data;
}

async function getUserPlaysPage(userName, pageNumber) {
  const response = await bgg.getBggPlays({
    page: pageNumber,
    username: userName,
  });
  const { page, play, total } = response.data;
  return { play, hasNextPage: parseInt(page, 10) * 100 < parseInt(total, 10) };
}

async function getUserPlays(userName) {
  let result = [];
  let keepPooling = true;
  let page = 1;

  while (keepPooling) {
    let { play, hasNextPage } = await getUserPlaysPage(userName, page);
    result = result.concat(play);
    keepPooling = hasNextPage;
    page += 1;
  }

  return result;
}

async function getShelve(userName, own = false) {
  const { data } = await bgg.getBggCollection({
    subtype: 'boardgame',
    excludesubtype: 'boardgameexpansion',
    username: userName,
    own,
  });
  return data;
}

export async function loadFromBgg() {
  console.log('>>> Retrieving users data ...');
  const users = await Promise.all([getUser('ccanado'), getUser('bitio')]);
  const usersPlays = await Promise.all([
    getUserPlays('ccanado'),
    getUserPlays('bitio'),
  ]);

  console.log('>>> Retrieving shelves  data ...');
  const shelves = await Promise.all([
    getShelve('ccanado', true),
    getShelve('bitio', true),
  ]);
  console.log('>>> Building diff ...');
  const shelvesMapped = shelves.map((shelve) => {
    return shelve.item.map((game) => {
      return {
        id: game.objectid,
        name: game.name.text,
        image: game.thumbnail,
      };
    });
  });
  const shelvesDiffLeft = _.differenceWith(
    shelvesMapped[0],
    shelvesMapped[1],
    (gameA, gameB) => {
      return gameA.id === gameB.id;
    }
  );
  const shelvesDiffRight = _.differenceWith(
    shelvesMapped[1],
    shelvesMapped[0],
    (gameA, gameB) => {
      return gameA.id === gameB.id;
    }
  );

  const shelvesDiff = shelvesDiffLeft.concat(shelvesDiffRight).sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else {
      return 0;
    }
  });

  return {
    shelvesDiff,
    shelvesMapped,
    shelves,
    users,
    usersPlays,
  };
}
