const fetch = require('node-fetch');
const fs = require('fs');

const FIREBASE_APP = 'forged-7adb7';

const _cacheFolder = './api-cache';
let _hasCacheDir = false;

const Api = {
  _ensureCacheDir() {
    if (!_hasCacheDir) {
      fs.mkdirSync('./api-cache', {recursive: true});
      _hasCacheDir = true;
    }
  },

  _ensureSuffix(str, suff) {
    return str.endsWith(suff) ? str : str + suff
  },

  clearCache() {
    fs.rmdirSync(_cacheFolder, {recursive: true});
    _hasCacheDir = false;
  },

  clear(path) {
    Api._ensureCacheDir();

    const encodedUrl = encodeURIComponent(path.replace(/\.json$/, ''));
    const cachePath = `${_cacheFolder}/${encodedUrl}.json`
    if (fs.existsSync(cachePath)) {
      console.info('[Api] Removing saved response for: $s', path);
      fs.unlinkSync(cachePath)
    }
  },

  async get(path) {
    console.info('[Api] Fetching url: %s', path);
    const response = await fetch(`https://${FIREBASE_APP}.firebaseio.com${Api._ensureSuffix(path, '.json')}`);
    const json = await response.json()
    return json;
  },

  async cacheGet(path) {
    Api._ensureCacheDir();

    const encodedUrl = encodeURIComponent(path.replace(/\.json$/, ''));
    const cachePath = `${_cacheFolder}/${encodedUrl}.json`

    if (fs.existsSync(cachePath)) {
      console.info('[Api] Read api file: %s', path);
      return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    } else {
      const json = await Api.get(path);
      if (json) {
        console.info('[Api] Saving response: $s', path);
        fs.writeFileSync(cachePath, JSON.stringify(json, null, '\t'))
      } else {
        console.error('[Api] Null response; unable to save %s', path);
      }
      return json;
    }
  }
}


module.exports = Api;
