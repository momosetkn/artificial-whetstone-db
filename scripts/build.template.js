const fs = require('fs');
const mustache = require('mustache');


const template = fs.readFileSync("./src/templates/index.html").toString()
fs.writeFileSync(
  './dist/index.html',
  mustache.render(template, {})
);
