const Api = require('./Api');

module.exports = class Model {
  async get({cache} = {cache: true}) {
    if (cache) {
      if (cache === 'refresh') {
        Api.clear(this.url());
      }
      this.data = await Api.cacheGet(this.url());
    } else {
      this.data = Api.get(this.url());
    }
    return this.data
  }
}
