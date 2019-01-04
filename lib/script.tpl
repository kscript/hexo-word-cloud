<script>
  if(window.jQuery){
    $(document).on('pjax:end', function() {
      initCloud();
    });
  } else {
    initCloud();
  }

  function initCloud(){
    var myChart = echarts.init(document.getElementById('main'));
    maskImage('<!-- image -->');
    myChart.on('click', function (params) {
      window.open('<!-- tagpath -->' + encodeURIComponent(params.name));
    });
    function maskImage(src){
      if(src){
        var image = new Image();
        image.onload = function(){
          setOption(image);
        }
        image.src = src;
      } else {
        setOption();
      }
    }
    function setOption(image){
      myChart.setOption({
        series: [{
          type: 'wordCloud',
          gridSize: 1,
          sizeRange: [13, 40],//最小文字——最大文字
          rotationRange: [0, 0],//旋转角度区间
          rotationStep: 90,//旋转角度间隔
          maskImage: image || '',//遮罩图片
          width: <!-- width -->,
          height: <!-- height -->,
          left: 'center',
          top: 'center',
          gridSize: 10,//字符间距
          textStyle: {
            normal: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              color: function () {
                return 'rgb(' + createColor(160, 10).join(',') + ')';
              }
            },
            emphasis: {
              color: function () {
                return 'rgb(' + createColor(200, 10).join(',') + ')';
              }
            }
          },
          data: formatData(tagData)
        }]
      });
      function formatData(data){
        return data.map(function(item){
          item.textStyle = {
            normal: {},
            emphasis: {}
          }
          return item;
        });
      }
      function createColor(num, min){
        min = min || 100;
        num = num || 100;
        return [
          ~~(Math.random() * num + min),
          ~~(Math.random() * num + min),
          ~~(Math.random() * num + min)
        ];
      }
    }
  }
</script>
