const fs = require('fs');
const { Converter } = require('showdown');
const prism = require('prismjs');

// Copy needed prism components
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-python');

// Build function
function buildDocs() {
  // Add your build logic here
  console.log('Docs built successfully');
}

buildDocs();

