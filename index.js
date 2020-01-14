const fs = require('fs');
const Api = require('./Api');

const Seasons = require('./Seasons');
const SeasonPlayers = require('./SeasonPlayers');
const SeasonPlayer = require('./SeasonPlayer');
const GlobalPlayer = require('./GlobalPlayer');
const SeasonGames = require('./SeasonGames');
const GameData = require('./GameData');

const _USE_CACHE_ = true; // 'refresh', false
const _LEAGUE_ = 'bad-axe-throwing-san-francisco-ca';

class DataType {
  constructor(name) {
    this.name = name;
    this.itemsById = {};
    // this.ids = new Set();
  }

  insert(item) {
    if (!item.id) {
      console.log('Missing item.id: unable to insert', item);
      return;
    }
    if (this.itemsById[item.id]) {
      console.log('Existing item.id: unable to replace', item);
      return;
    }

    this.itemsById[item.id] = item;
    // this.ids.add(item.id);
  }

  get length() {
    return Object.keys(this.itemsById).length;
  }
}

async function get(url) {
  if (_USE_CACHE_) {
    if (_USE_CACHE_ === 'refresh') {
      Api.clear(url);
    }
    return await Api.cacheGet(url);
  } else {
    return Api.get(url);
  }
}

// Players Per Season
// derek b = -LbUOerFpbCj8FW2aeRf
// shishir = -LbYjzJEulG9j2T0tcvx
// ryan    = -LbYjzJG27JyOPcElK8W

const datamart = {
  location: new DataType('location'),
  globalPlayer: new DataType('globalPlayer'),
  season: new DataType('season'),
  seasonPlayer: new DataType('seasonPlayer'),
  game: new DataType('game'),
  // gameStats: new DataType('gameStats'),
};

async function main() {
  // Api.clearCache();

  // Get list of season for this League:
  const seasons = await get(new Seasons(_LEAGUE_).url());

  datamart.location.insert({
    id: _LEAGUE_,
    seasons: Object.keys(seasons),
  });

  // Fetch summary season Standing records:
  await Promise.all(
    Object.entries(seasons).map(async ([seasonId, seasonData]) => {
      const seasonPlayers = await get(new SeasonPlayers(_LEAGUE_, seasonData).url());

      datamart.season.insert({
        id: seasonId,
        seasonData: seasonData,
        seasonPlayers: Object.keys(seasonPlayers || {}),
        gameIds: new Set(),
      });

      await Promise.all(
        Object.entries(seasonPlayers || {}).map(async ([playerId, seasonPlayerData]) => {
          if (seasonPlayerData.score === 0) {
            return;
          }

          // Global player may have been inserted already...
          const globalPlayer = await get(new GlobalPlayer(playerId).url());
          datamart.globalPlayer.insert({
            id: playerId,
            globalPlayerData: globalPlayer,
            seasonIds: new Set(),
            gameIds: new Set(),
          });

          const seasonPlayerId = `${seasonId} ${playerId}`;
          datamart.globalPlayer.itemsById[playerId].seasonIds.add(seasonPlayerId);
          datamart.seasonPlayer.insert({
            id: seasonPlayerId,
            seasonId: seasonId,
            playerId: playerId,
            seasonPlayerData: seasonPlayerData,
            gameIds: new Set(),
          });

          const seasonGames = await get(new SeasonGames(seasonData, playerId).url());

          await Promise.all(
            Object.entries(seasonGames || {}).map(async ([gameId, gameMeta]) => {
              const gameScores = await get(new GameData(_LEAGUE_, seasonData, gameMeta.seasonID, gameMeta.weekID, gameId).url());

              if (datamart.game.itemsById[gameId]) {
                datamart.game.itemsById[gameId].gameMeta2 = gameMeta;
              } else {
                datamart.game.insert({
                  id: gameId,
                  seasonId: seasonId,
                  gameMeta1: gameMeta,
                  gameMeta2: null,
                  gameScores: gameScores,
                });
              }

              datamart.globalPlayer.itemsById[playerId].gameIds.add(gameId);
              datamart.season.itemsById[seasonId].gameIds.add(gameId);
              datamart.seasonPlayer.itemsById[seasonPlayerId].gameIds.add(gameId);
            })
          );
        })
      );
    })
  );
}

main().then(() => {
  function Set_toJSON(key, value) {
    if (typeof value === 'object' && value instanceof Set) {
      return [...value];
    }
    return value;
  }

  fs.mkdirSync('./output', {recursive: true});
  fs.writeFileSync('./output/datamart.json', JSON.stringify(datamart, Set_toJSON, '\t'));
});
