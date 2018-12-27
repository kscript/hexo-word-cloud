var merge = require('utils-merge');
var pathFn = require('path');

var config = hexo.config.wordCloud = merge({
  output: 'wordCloud.html',
  template: ''
}, hexo.config.wordCloud);

if (!config.path){
  config.output = 'wordCloud.html';
}

if (!pathFn.extname(config.output)){
  config.output += '.html';
}
if (config.template && !pathFn.extname(config.template)){
  config.template += '.html';
}

hexo.extend.generator.register('wordCloud', require('./lib/word-cloud'));
