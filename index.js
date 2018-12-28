var path = require('path');
var merge = require('utils-merge');
var _locals;
var pathinfo;

var config = hexo.config.wordCloud = merge({
  output: '',
  title: '',
  script: '',
  style: '',
  template: '',
  echarts: '',
  main: '',
  tagdata: null,
  width: 1000,
  height: 520,
}, hexo.config.wordCloud);
config.output = config.output || path.join(hexo.config.tag_dir || 'tags','/index.html');

pathinfo = path.parse(config.output);
config.dir = pathinfo.dir;
config.base = pathinfo.base;
config.tagpath = hexo.config.url + hexo.config.root + pathinfo.dir + '/';

hexo.extend.generator.register('wordCloud', function(locals){
  _locals = locals;
});
hexo.extend.filter.register('before_exit', function(){
  require('./lib/word-cloud').call(this, _locals);
});
