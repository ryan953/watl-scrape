const Model = require('./Model');

module.exports = class EventList extends Model {
  constructor(league) {
    super();
    this.league = league
  }

  url() {
    return `/${this.league}/event-list/league.json`;
  }

  titles() {
    return Object.values(this.data).map((event) => event.title);
  }

  events() {
    return Object.values(this.data);
  }
}
