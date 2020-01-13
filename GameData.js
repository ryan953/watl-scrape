const Model = require('./Model');

module.exports = class SeasonGames extends Model {
  constructor(league, season, seasonId, weekId, gameId) {
    super();
    this.league = league;
    this.season = season;
    this.seasonId = seasonId; // "Season1"
    this.weekId = weekId;
    this.gameId = gameId;
  }

  url() {
    return `/${this.league}/league/${this.season.slug}/${this.seasonId}/${this.weekId}/game-data/${this.gameId}.json`;
  }
}
