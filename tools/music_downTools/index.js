/**
 * 弹出式提示框，默认1.2秒自动消失
 * @param message 提示信息
 * @param style 提示样式，有alert-success、alert-danger、alert-warning、alert-info
 * @param time 消失时间
 */

// 弹出式提示框
var prompt = function (message, style, time){
    $("#success").addClass("show");
    $("#success").removeClass("alert-success").removeClass("alert-danger ")
    $("#success").addClass(style);
    $("#tip").text(message);
    window.setTimeout(function(){
            $("#success").removeClass("show");
        },time);//显示的时间
};

//触发下载按钮
document.addEventListener('DOMContentLoaded', function() {
    var downloadButton = document.querySelector('.main button');
    downloadButton.onclick = function() {
        var musicLink = document.querySelector('.main input[type="text"]').value;
        if (musicLink) {
            var id = music_id_get(musicLink)
            // 执行下载操作
            getRequest(id);
        } else {
            prompt('请输入网易云音乐链接...','alert-danger', 1000)
        }
    };
});


function music_id_get(musicLink){
    var musicUrl = musicLink
    if (!musicUrl || !musicUrl.startsWith('http')) {
        prompt('请输入正确的音乐链接','alert-danger', 1000);
      return;
      }else{
      var music_id = musicUrl.split('&')[0].split('=')[1];
      prompt('解析成功!音乐id:'+music_id, 'alert-success', 1000)
        return music_id
    }

    };


async function getRequest(id) {
    try {
        // 发起GET请求
        const response = await fetch('https://dataiqs.com/api/netease/music/?type=songid&id='+id);
        // 检查响应状态
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 解析响应内容为JSON格式
        const data = await response.json();
        downloadMusic(data['song_url']);
        
    } catch (error) {
        console.error('请求失败：', error);
    }
    };
    
function downloadMusic(musicUrl) {
var name = Date.parse(new Date());
var composer = 'unkown'
musicUrl = musicUrl.replace('http://', 'https://');
$.ajax({
    url: musicUrl,
    method: 'GET',
    xhrFields: {
        responseType: 'blob'
    },
    success: function (data) {
        // 获取文件名
        
        const fileName = name + ' - ' + composer + '.mp3';

        // 创建一个 Blob 对象，用于存储音乐文件
        const blob = new Blob([data], { type: 'audio/mp3' });

        // 创建一个 a 标签，用于下载音乐文件
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();

        // 释放 URL 对象
        URL.revokeObjectURL(a.href);
    },
    error: function (error) {
        console.error('下载音乐失败：', error);
    }
});
}
    
function music_Info(id){
    info = {}
    var url = 'https://tenapi.cn/v2/songinfo?id='+id;
    fetch(url, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(result => {
        return result['data'];
      })
      .catch(error => {
        console.error('Error:', error);
      });  
  }