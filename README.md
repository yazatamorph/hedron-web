# Hedron

Hedron is a collection management app for Magic: The Gathering, which I produced in my spare time as a way to teach myself Vue/Nuxt - and keep track of all the cardboard I've got stacked about. This repository, specifically, contains the client app. It consumes the [Scryfall](https://scryfall.com/) API to provide search functionality, card data, and card images, and user collection data is persisted within the client with assistance from [vuex-persist](https://github.com/championswimmer/vuex-persist) and [localforage](https://github.com/localForage/localForage). A deployed instance of Hedron is available at [https://hedronarchive.com/](https://hedronarchive.com/).

## Contributing

Found a problem? Notice something missing that absolutely needs to be included? Please feel free to file an issue, and I'll do what I can to resolve it. Help with development is also appreciated, so don't be shy about making a PR to address issues that have been filed!

## Setup

The following commands may help you get set up once you've forked and/or cloned this repository:

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev
```

Unlike the default Nuxt project, the Hedron client is a statically generated app, so if you wish to run or test a production build, you should use:

```bash
# generate static app files in ./dist
$ npm run generate
```

The [Nuxt docs](https://nuxtjs.org) are a good starting point for further information about configuring, building, and running the project.

## Disclaimer and License

Hedron makes use of textual and visual information, including card text and images, that is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. This use constitutes unofficial Fan Content as permitted under the Wizards of the Coast Fan Content Policy. Hedron is in no way produced by, endorsed by, supported by, or affiliated with Wizards of the Coast or its parent company.

Card data and images used by Hedron are provided courtesy of [Scryfall](https://scryfall.com/). Hedron is in no way produced by, endorsed by, supported by, or affiliated with Scryfall.

All original content and functionality, such as it is, is licensed under the GNU General Public License v3.0.
