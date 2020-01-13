const Api = require('./Api');

const EventList = require('./EventList');
const Season = require('./Season');
const SeasonPlayer = require('./SeasonPlayer');
const GlobalPlayer = require('./GlobalPlayer');
const SeasonGames = require('./SeasonGames');
const GameData = require('./GameData');

const league = 'bad-axe-throwing-san-francisco-ca';

async function main() {
  // Api.clearCache();

  // Get list of season for this League:
  const eventList = new EventList(league);
  await eventList.get({cache: true});

  // Fetch summary season Standing records:
  const seasons = eventList.events().map((season) => new Season(league, season));
  await Promise.all(seasons.map((season) => season.get({cache: true})));

  // Fetch global player stats records:
  const playerIds = seasons.map((season) => season.playerIds());
  const globalPlayerIds = Array.from(new Set(playerIds.reduce((s, ids) => s.concat(ids), [])));
  const globalPlayers = globalPlayerIds.map((playerId) => new GlobalPlayer(playerId));
  await Promise.all(globalPlayers.map((globalPlayer) => globalPlayer.get({cache: true})));

  // For each Season...
  seasons.forEach(async (season) => {
    // Get the players stats for the eason
    const seasonPlayerIds = season.playerIds();
    const seasonPlayers = seasonPlayerIds.map((playerId) => new SeasonPlayer(league, season.season, playerId));
    await Promise.all(seasonPlayers.map((seasonPlayer) => seasonPlayer.get({cache: true})));

    // Get the list of games that were played
    const seasonGamesList = seasonPlayerIds.map((playerId) => new SeasonGames(season.season, playerId));
    await Promise.all(seasonGamesList.map((seasonGames) => seasonGames.get({cache: true})));

    // Get the axes thrown for each game played
    const gameDataList2 = seasonGamesList.map(async (seasonGames) => {
      const gameDataList = seasonGames.toList().map(({season, seasonID, weekID, gameID}) =>
        new GameData(league, season, seasonID, weekID, gameID)
      );
      await Promise.all(gameDataList.map(async (gameData) => gameData.get({cache: true})));

      return gameDataList;
    });
  });
}

main();

// ryan = LdHWIgqU5VuNdMW7Xgq
