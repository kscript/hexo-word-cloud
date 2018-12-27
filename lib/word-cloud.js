var path = require('path');
var tags = {};
function formatTag(title, data){
  var hash = {};
  if(data.length){
    data.forEach(function(tag){
      var name = tag.name;
      // tag去重
      if(!hash[name]){
        hash[name] = 1;
        // 新增一个tag
        if(!tags[name]){
          tags[name] = {
            // 统计tag出现次数
            total: 1,
            // 出现的文章
            articles: [title]
          };
        } else {
          tags[name].total++;
          tags[name].articles.push(title);
        }
      }
    });
  }
}
module.exports = function(locals){
  tags = {};
  var articles = locals.posts.data;
  var filepath = path.join(
    process.cwd(),
    this.config.public_dir,
    this.config.tag_dir,
    this.config.wordCloud.output
  );
  var templatePath = this.template || path.join(__dirname, 'template.html');
  articles.forEach(item => {
    formatTag(item.title, item.tags.data);
  });
  // console.log(filepath, templatePath, tags);
}
