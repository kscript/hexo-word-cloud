var fs = require('fs');
var path = require('path');
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

function create(locals){
  var wordCloud = this.config.wordCloud;
  var public_dir = this.config.public_dir;
  // 放置标签云的目录
  var tagpath = path.join(
    process.cwd(),
    public_dir,
    wordCloud.dir
  );
  // 如果图片不是http(s):或data:开头
  if(wordCloud.image && !/^(http(s):|data:)/.test(wordCloud.image)){
    var imageInfo = path.parse(wordCloud.image);
    // 加上随机前缀
    imageInfo.base = 'cloud' + ~~(Math.random() * 10e8) + '-' + imageInfo.base;
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
  // 标签数据统计结果
  wordCloud.tagdata = wordCloud.tagdata || countPost(locals.posts.data);
  // 标签云写入
  fs.writeFile(
    path.join(tagpath, wordCloud.base),
    swigTpl('template',
      {
        style: swigTpl('style', wordCloud),
        tagdata: swigTpl('tagdata', wordCloud),
        script: swigTpl('script', wordCloud),
        element: swigTpl('element', wordCloud),
        echarts: setSrc('echarts', 'echarts.min.js'),
        wordcloud: setSrc('main', 'echarts-wordcloud.min.js')
      },
      wordCloud
    ),
    function(err){
      err && console.log(err)
  });

  function setSrc(type, src){
    var file = wordCloud[type];
    var pathinfo;
    var output;
    if(file){
      if(/^http(s):/.test(file)){
        return file;
      }
      pathinfo = path.parse(file);
      output = path.join(
        tagpath,
        pathinfo.base
      );
      // 将文件复制到标签云所在目录
      copyFile(path.join(
        process.cwd(),
        pathinfo.dir
      ), output);
      return output;
    }
    // 如果用户没有配置js文件地址, 则复制默认的js到文件夹
    copyFile(
      path.join(__dirname, src),
      path.join(tagpath, src)
    );
    return src;
  }

  function swigTpl(key, data, config){
    var filepath = data[key]
      ? path.join(process.cwd(), data[key]) 
      : path.join(__dirname, key + '.swig');
    var swig = fs.readFileSync(filepath).toString();
    return swig ? swig.replace(/<!--\s+(.*?)\s+-->/g, function(m, $1){
      return data[$1] || config[$1] || '';
    }) : '';
  }
};

module.exports = create;
