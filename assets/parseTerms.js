import _ from 'lodash';

export default (searchString) => {
  const terms = {};
  const destring = (regex) => {
    return _.words(searchString, regex);
  };

  const name = destring(/\w+|"[\w\s]*"/g);
  if (name) terms.name = name;

  // these output arrays, eg ['s:term', 'set:term'] - need to remove prefixes
  const set = destring(/s:\w+|set:\w+|s:"[\w\s]*"|set:"[\w\s]*"/g);
  if (set) {
    terms.set = set;
    terms.set_name = set;
  }

  const type_line = destring(/t:\w+|type:\w+|t:"[\w\s]*"|type:"[\w\s]*"/g);
  if (type_line) terms.type_line = type_line;

  const artist = destring(
    /a:\w+|art:\w+|artist:\w+|a:"[\w\s]*"|art:"[\w\s]*"|artist:"[\w\s]*"/g
  );
  if (artist) terms.artist = artist;

  const tags = destring(/#\w+|#"[\w\s]*"/g);
  if (tags) terms.tags = tags;

  console.log('Term output:', terms);
  return terms;
};

// const exampleRegex = /\w+:\w+|\w+:"[\w\s]*"/g;
