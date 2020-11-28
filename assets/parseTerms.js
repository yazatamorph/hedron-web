/* eslint-disable camelcase */
// This file needs to be moved to the server
// because some of the regex features it relies upon
// aren't compatible with all browsers. Thus,
// it's safer to run in the 'universal' Node backend.
const _ = require('lodash');

const parseTerms = (searchString) => {
  const terms = {};
  const destring = (regex) => {
    return _.words(searchString, regex);
  };

  const name = destring(/(?<=^|\s)\b\w+\b(?![:"])|(?<=(^|\s)")[\w\s]+\b(?=")/g);
  if (name) terms.name = name;

  const set = destring(
    /(?<=(^|\s)(s|set):)\w+|(?<=(^|\s)(s|set):")[\w\s]*(?=")/g
  );
  if (set) {
    terms.set = set;
    terms.set_name = set;
  }

  const type_line = destring(
    /(?<=(^|\s)(t|type):)\w+|(?<=(^|\s)(t|type):")[\w\s]*(?=")/g
  );
  if (type_line) terms.type_line = type_line;

  const artist = destring(
    /(?<=(^|\s)(a|art|artist):)\w+|(?<=(^|\s)(a|art|artist):")[\w\s]*(?=")/g
  );
  if (artist) terms.artist = artist;

  const tags = destring(/(?<=(^|\s)#)\w+|(?<=(^|\s)#")[\w\s]*(?=")/g);
  if (tags) terms.tags = tags;

  return terms;
};

module.exports = parseTerms;
