var fs = require('fs');
var path = require('path');
// 统计文章里的标签
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

function copyFile(from, to, format){
  fs.readFile(from, function(err, data){
    if(err){
      format && format(err, data);
    } else {
      data = format ? format(err, data) : data;
      to && fs.writeFile(to, data, function(err){
        err && console.log(err)
      });
    }
  });
}

function create(locals){
  var wordCloud = this.config.wordCloud;
  var tagpath = path.join(
    process.cwd(),
    this.config.public_dir,
    wordCloud.dir
  );
  var tagData = countPost(locals.posts.data);
  fs.writeFile(path.join(tagpath, wordCloud.base), swigTpl('template', {
    script: swigTpl('script', wordCloud),
    element: swigTpl('element', wordCloud),
    echarts: setSrc('echarts', 'echarts.min.js'),
    main: setSrc('main', 'echarts-wordcloud.min.js'),
    tagData: `<script>var tagData = ${JSON.stringify(tagData)};</script>`
  }, wordCloud), function(){});
  function setSrc(type, src){
    if(wordCloud[type]){
      return wordCloud[type];
    }
    // 如果用户没有配置js文件地址, 则复制默认的js到文件夹
    copyFile(
      path.join(__dirname, src),
      path.join(tagpath, src)
    );
    return src;
  }

  function swigTpl(key, data, config){
    var filepath = data[key] || path.join(__dirname, key + '.swig');
    var swig = fs.readFileSync(filepath).toString();
    return swig ? swig.replace(/<!--\s(.*?)\s-->/g, function(s, $1){
      return data[$1] || config[$1] || '';
    }) : '';
  }
};

module.exports = create;
