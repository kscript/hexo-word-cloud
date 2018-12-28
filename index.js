var path = require('path');
var merge = require('utils-merge');
var _locals;
var pathinfo;

var config = hexo.config.wordCloud = merge({
  output: path.join(hexo.config.tag_dir || 'tags','/index.html'),
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

if (config.output){
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
}
// [
//   'before_post_render',
//   'after_post_render',
//   'before_exit',
//   'before_generate',
//   'after_generate',
//   'template_locals',
//   'after_init',
//   'new_post_path',
//   'post_permalink',
//   'after_render',
//   'server_middleware'
// ].forEach(element => {
//   hexo.extend.filter.register(element, function(){
//     console.log(element)
//   });
// });
