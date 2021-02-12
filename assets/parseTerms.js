/* eslint-disable camelcase */
const _ = require('lodash');

const parseTerms = (searchString) => {
  const terms = {};
  const destring = (regex) => {
    return _.words(searchString, regex);
  };

  const name = destring(
    /(?<=^|\s)\b\w+\b(?![=:"])|(?<=(^|\s)")[\w\s]+\b(?=")/g
  );
  if (name && name.length) terms.name = name;

  const set = destring(
    /(?<=(^|\s)(s|set):)\w+|(?<=(^|\s)(s|set):")[\w\s]*(?=")/g
  );
  if (set && set.length) {
    terms.set = set;
  }

  const setAbbr = destring(
    /(?<=(^|\s)(s|set)=)\w+|(?<=(^|\s)(s|set)=")\w+(?=")/g
  );
  if (setAbbr && setAbbr.length) {
    terms.setAbbr = setAbbr;
  }

  const type_line = destring(
    /(?<=(^|\s)(t|type):)\w+|(?<=(^|\s)(t|type):")[\w\s]*(?=")/g
  );
  if (type_line && type_line.length) terms.type_line = type_line;

  const artist = destring(
    /(?<=(^|\s)(a|art|artist):)\w+|(?<=(^|\s)(a|art|artist):")[\w\s]*(?=")/g
  );
  if (artist && artist.length) terms.artist = artist;

  const tags = destring(/(?<=(^|\s)#)\w+|(?<=(^|\s)#")[\w\s]*(?=")/g);
  if (tags && tags.length) terms.tags = tags;

  return terms;
};

// Test invocation
// console.log(
//   parseTerms(
//     'barnacles meat "Test Name" set:lrw s:"Lorwyn Time" t:faerie type:"big butts" art:"Wylie Beckert" #neato #frito #"Crash Bandicoot"'
//   )
// );

module.exports = parseTerms;
