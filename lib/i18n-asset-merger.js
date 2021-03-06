var concat = require('broccoli-concat');
var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var fs = require('fs');

function I18nAssetMerger(inputNode, options) {
  options = options || {};
  var directories = getDirectories(inputNode);
  var concatenatedProperties = [];

  //Concat all files into one
  directories.forEach(function(directory) {
    var fileName = '/' + directory + '.properties';
    var concatenatedDirectoryProperties = concat(inputNode + '/' + directory, {
      outputFile: fileName,
      inputFiles: ['*.properties']
    });
    concatenatedProperties.push(concatenatedDirectoryProperties);
  });

  //Get the seperate properties files in the parent directory and convert them to js file as such.
  var otherPropertiesFiles = funnel(inputNode, {
    include: ['*.properties']
  });

  concatenatedProperties.push(otherPropertiesFiles);
  return mergeTrees(concatenatedProperties);
}

function getDirectories(sourcePath) {
  return fs.readdirSync(sourcePath).filter(function(file) {
    return fs.statSync(sourcePath + '/' + file).isDirectory();
  });
}
module.exports = I18nAssetMerger;
