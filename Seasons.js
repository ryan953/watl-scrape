const Model = require('./Model');

module.exports = class Seasons extends Model {
  constructor(league) {
    super();
    this.league = league
  }

  url() {
    return `/${this.league}/event-list/league.json`;
  }

  seasonIds() {
    return Object.keys(this.data);
  }

  seasons() {
    return Object.values(this.data);
  }

  titles() {
    return Object.values(this.data).map((event) => event.title);
  }
}
