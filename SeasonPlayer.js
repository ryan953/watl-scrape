const Model = require('./Model');

module.exports = class SeasonPlayer extends Model {
  constructor(league, season, id) {
    super();
    this.league = league;
    this.season = season;
    this.playerId = id
  }

  url() {
    // Same as the list returned from `/${this.league}/league/${this.season.slug}/Season1/standings.json`
    return `/${this.league}/league/${this.season.slug}/Season1/standings/${this.playerId}.json`;
  }
}
