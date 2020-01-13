const Model = require('./Model');

module.exports = class GlobalPlayer extends Model {
  constructor(id) {
    super();
    this.playerId = id
  }

  url() {
    return `/global/watl/players/${this.playerId}.json`;
  }
}

/*
 * Another url:
 * `/global/watl/players-career/-LbYjzJG27JyOPcElK8W/league`
 * returns a list of seasons, without the league location info
 */
