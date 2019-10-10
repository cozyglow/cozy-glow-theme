# Cozy Glow Theme
Within this Theme you’ll find the following directories and files, grouping common resources and providing both compiled and minified distribution files, as well as raw source files.

## Project Structure
This project will consist of the following file structure:
```bash
├── gulpfile.js
├── package.json
├── README.md
├── docs/
├── less/
│   ├── custom/
│   ├── variables.less
│   └── toolkit.less
├── js/
│   └── custom/
├── fonts/
│   ├── bootstrap-entypo.eot
│   ├── bootstrap-entypo.svg
│   ├── bootstrap-entypo.ttf
│   ├── bootstrap-entypo.woff
│   └── bootstrap-entypo.woff2
└── dist/
 ├── toolkit.css
 ├── toolkit.css.map
 ├── toolkit.min.css
 ├── toolkit.min.css.map
 ├── toolkit.js
 └── toolkit.min.js
```

### Docs & Examples
The `docs` directory contains all the static resources for this Theme's docs and examples. To view, just open in your favourite browser!

```bash
$ open docs/index.html
```

### Gulpfile.js
We've also included a Gulp file for theme customisation. You’ll need to install node and Gulp before using our included gulpfile.js.

To install node visit [node][node-download].

To install gulp, run the following command:
```
$ yarn add global gulp
```

When you’re done, install the rest of the theme's dependencies:
```
$ yarn install
```

From here on out, simply run `gulp` from your terminal and you're good to go!

* `gulp` - recompiles and minifies the theme assets into the `dist` directory.

## Support

If you experience any problems with the above, or if you think you've found a bug with the theme, please don't hesitate to reach out to marcom@cozyglow.co.uk. Thanks!

[node-download]: https://nodejs.org/download
