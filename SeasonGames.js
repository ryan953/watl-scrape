const Model = require('./Model');

module.exports = class SeasonGames extends Model {
  constructor(season, id) {
    super();
    this.season = season;
    this.playerId = id
  }

  url() {
    return `/global/watl/players-career/${this.playerId}/league-games/${this.season.slug}-Season1.json`;
  }

  toList() {
    return Object.keys(this.data).map((gameID) => {
      const {leagueID, seasonID, weekID} = this.data[gameID];
      return {
        season: {slug: leagueID},
        seasonID,
        weekID,
        gameID,
      };
    });
  }
}
