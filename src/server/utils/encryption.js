const base64 = require('base-64');
const utf8 = require('utf8');

function encode(phrase) {
  const bytes = utf8.encode(phrase);
  return base64.encode(bytes);
}

function decode(phrase) {
  const bytes = base64.decode(phrase);
  return utf8.decode(bytes);
}

module.exports = {
  encode,
  decode,
};

