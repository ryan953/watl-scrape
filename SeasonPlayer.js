const Model = require('./Model');

module.exports = class SeasonPlayer extends Model {
  constructor(league, season, id) {
    super();
    this.league = league;
    this.season = season;
    this.playerId = id
  }

  url() {
    return `/${this.league}/league/${this.season.slug}/Season1/standings/${this.playerId}.json`;
  }
}
