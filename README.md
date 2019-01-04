#### hexo-word-cloud
hexo 标签 词云

#### 调用示例

在 hexo 项目的 _config.yml 文件中添加配置项: wordCloud

```_config.yml
tag_dir: tags
# ...

# wordCloud相关的配置, 所有配置都可不填
# 相对路径 基于项目根目录
wordCloud:

  # 输出文件路径 (默认: [tag_dir]/index.html)
  output: 

  title: 标签云
  width: 1200
  height: 600

  # 定制的 echarts 中应当包含自定义系列, 不然没办法显示
  echarts: https://gallerybox.echartsjs.com/dep/echarts/3.8.0/echarts.min.js
  # https://github.com/ecomfe/echarts-wordcloud
  wordcloud: 

  # 标签云的形状
  image: themes/even/plugins/cloud/logo.png


  # 以下是一些模板 template/element/style/script/tagdata
  # 填写格式: 相对于根目录的路径

  # html 页面
  template: 

  # 标签云容器
  element: themes/even/plugins/cloud/element.tpl

  # 标签云的样式 / 逻辑
  style: themes/even/plugins/cloud/style.tpl
  script: 

  # 标签云数据(JSON String)
  # 覆盖echarts.setOption时的 series.data
  tagdata: 

```
#### 模板使用示例

```html
template 模板 
<html>
<head>
  <title>
  <!-- title -->
  </title>
  <!-- style -->
  <script src="<!-- echarts -->"></script>
  <script src="<!-- wordcloud -->"></script>
</head>
<body>
<!-- element -->
<!-- script -->
</body>
</html>

script 模板
<script>
console.log(<!-- width -->);
console.log(<!-- height -->);
</script>

```
