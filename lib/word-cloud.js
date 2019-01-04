var fs = require('fs');
var path = require('path');
var merge = require('utils-merge');
/**
 * 统计文章里的标签信息
 * @param {object} data 文章信息
 * @param {boolean} more 是否统计更多信息(包含该标签的文章)
 */
function countPost(data, more){
  var tags = {};
  var list = [];
  data.forEach(item => {
    (item.tags.data || []).forEach(function(tag){
      if(!tags[tag.name]){
        list.push(tags[tag.name] = {
          name: tag.name,
          value: 0,
          articles: []
        });
      }
      tags[tag.name].value++;
      more && tags[tag.name].articles.push(item.title);
    });
  });
  return list;
}
/**
 * 复制文件
 * @param {string} from 复制源
 * @param {string} to 目标
 * @param {function==} format 转换函数
 */
function copyFile(from, to, format){
  fs.readFile(from, function(err, data){
    if(err){
      format && format(err, data);
    } else {
      data = format ? format(err, data) : data;
      // 如果有目标 且 转换后的结果不为空
      to && data && fs.writeFile(to, data, function(err){
        err && console.log(err)
      });
    }
  });
}


module.exports = function (locals){
  if(!locals)return ;
  var wordCloud = this.config.wordCloud;
  var public_dir = this.config.public_dir;
  // 放置标签云的目录
  var tagpath = path.join(
    process.cwd(),
    public_dir,
    wordCloud.dir
  );
  // 如果图片不是http(s):或data:开头
  if(wordCloud.image && !/^(http(s|):|data:)/.test(wordCloud.image)){
    var imageInfo = path.parse(wordCloud.image);
    // 将其复制到输出目录
    copyFile(path.join(
      process.cwd(),
      wordCloud.image
    ), path.join(
      tagpath,
      imageInfo.base
    ));
    wordCloud.image = imageInfo.base
  }
  // 标签云写入
  fs.writeFile(
    path.join(tagpath, wordCloud.base),
    parseTpl('template',
      merge(wordCloud, {
        style: parseTpl('style', wordCloud),
        tagdata: parseTpl('tagdata', {}, {
          tagdata:  wordCloud.tagdata || JSON.stringify(countPost(locals.posts.data), null, 2)
        }),
        script: parseTpl('script', wordCloud),
        element: parseTpl('element', wordCloud),
        echarts: setSrc('echarts', 'echarts.min.js'),
        wordcloud: setSrc('wordcloud', 'echarts-wordcloud.min.js')
      })
    ),
    function(err){
      err && console.log(err)
  });

  function setSrc(type, src){
    var file = wordCloud[type];
    var pathinfo;
    if(file){
      if(/^http(s|):/.test(file)){
        return file;
      }
      pathinfo = path.parse(file);
      // 将文件复制到标签云所在目录
      copyFile(path.join(
        process.cwd(),
        pathinfo.dir
      ), tagpath);
      return pathinfo.base;
    }
    // 如果用户没有配置js文件地址, 则复制默认的js到文件夹
    copyFile(
      path.join(__dirname, src),
      path.join(tagpath, src)
    );
    return src;
  }
  function trim(str){
    return typeof str === 'string' ? str.replace(/(^\s+|\s+$)/g, '') : str;
  }
  /**
   * 
   * @param {string} key 模板key
   * @param {object} data 模板数据
   * @param {object} config 模板数据不存在时的替换值
   */
  function parseTpl(key, data, config){
    config = config || {};
    var filepath = data[key]
      ? path.join(process.cwd(), data[key]) 
      : path.join(__dirname, key + '.tpl');
    var template = trim(fs.readFileSync(filepath).toString());
    return template ? template.replace(/<!--\s+(.*?)\s+-->/g, function(m, $1){
      return data[$1] || config[$1] || '';
    }) : '';
  }
}
