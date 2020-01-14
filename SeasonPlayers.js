const Model = require('./Model');

module.exports = class SeasonPlayers extends Model {
  constructor(league, season) {
    super()
    this.league = league;
    this.season = season;
  }

  url() {
    return `/${this.league}/league/${this.season.slug}/Season1/standings.json`;
  }

  summary() {
    if (!this.data) {
      return `SeasonPlayers: ${this.season.title}\nPlayers:\n\t_none_`;
    }

    const count = Object.keys(this.data).length;
    const activeCount = Object.keys(this.data).filter((key) => this.data[key].scoreavg !== 0).length
    const players = Object.values(this.data).filter((person) => person.scoreavg !== 0).map((person) => person.alias.trim());
    return `Season: ${this.season.title}
Players: (${count-activeCount} hidden)
\t${players.join('\n\t')}`;
  }

  playerIds() {
    if (!this.data) {
      return []
    }

    return Object.keys(this.data).filter((key) => this.data[key].scoreavg !== 0);
  }
}
