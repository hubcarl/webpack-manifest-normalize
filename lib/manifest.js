'use strict';
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const manifest = {};

manifest.readFile = filepath => {
  try {
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, 'utf8');

      return JSON.parse(content);
    }
  } catch (e) {
    /* istanbul ignore next */
  }
  return null;
};

manifest.writeFile = (filepath, content) => {
  try {
    mkdirp.sync(path.dirname(filepath));
    fs.writeFileSync(filepath, typeof content === 'string' ? content : JSON.stringify(content), 'utf8');
  } catch (e) {
    console.error(`writeFile ${filepath} err`, e);
  }
};

manifest.normalize = jsonManifest => {
  const normalizeManifest = {};

  Object.keys(jsonManifest).forEach(key => {
    const normalizeKey = key.replace(/^\\/g, '').replace(/\\/g, '/');
    const normalizeValue = jsonManifest[key].replace(/\\/g, '/').replace(/\/\//g, '/');
    normalizeManifest[normalizeKey] = normalizeValue;
  });
  return normalizeManifest;
};

manifest.saveFile = (filepath, content) => {
  const jsonManifest = typeof content === 'string' ? JSON.parse(content) : content;
  const normalizeManifest = manifest.normalize(jsonManifest);
  manifest.writeFile(filepath, normalizeManifest);
};

manifest.normalizeFile = filepath => {
  const manifestContent = manifest.readFile(filepath);
  if (manifestContent) {
    manifest.saveFile(filepath, manifestContent);
  }
};

module.exports = manifest;