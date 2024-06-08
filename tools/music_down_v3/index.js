/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-01-25 14:03:01
 * @LastEditors: SilentPoria 99938821+SilentPoria@users.noreply.github.com
 * @LastEditTime: 2024-06-08 00:17:06
 * @FilePath: \SilentPoria.github.io\tools\music_down_v3\get.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


function music_id_get(){
  var musicUrl = document.getElementById('url').value;
  if (!musicUrl || !musicUrl.startsWith('http')) {
    myFunction('请输入正确的音乐链接');
    return;
    }else{
    var music_id = musicUrl.split('&')[0].split('=')[1];
    var show_id = document.getElementById('music_id');
    $("#main-box").addClass('right-panel-active')
    show_id.value = music_id;
    music_Info(music_id)
    myFunction('解析成功');
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
    // 处理数据
    console.log(data);
  } catch (error) {
    console.error('请求失败：', error);
  }
};

function downloadMusic(musicUrl) {
  if (!musicUrl || !musicUrl.startsWith('http')|| !musicUrl.startsWith('https') ) {
      myFunction('请输入正确的音乐链接');
      return;
  }
  musicUrl = musicUrl.replace('http://', 'https://');
  $.ajax({
      url: musicUrl,
      method: 'GET',
      xhrFields: {
          responseType: 'blob'
      },
      success: function (data) {
          // 获取文件名
          var name = document.getElementById('musicName').value;
          var composer = document.getElementById('composer').value;
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
  var show_name = document.getElementById('musicName');
  var show_composer = document.getElementById('composer');
  var url = 'https://tenapi.cn/v2/songinfo?id='+id;
  fetch(url, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(result => {
      var result = result['data'];
      show_name.value = result['songs']
      show_composer.value = result['sings']
      $("#download").attr("disabled",false);
      $("#download").html("下载");

    })
    .catch(error => {
      console.error('Error:', error);
    });  
}


function myFunction(content) {
  // 创建一个 snackbar 元素，用于显示消息
  var snackbar = document.getElementById('snackbar');
  snackbar.innerHTML = content
  // 获取 snackbar DIV
  var x = document.getElementById("snackbar");

  // 将 "show" 类添加到 DIV
  x.className = "show";

   // 3 秒后，从 DIV 中删除 show 类
  setTimeout(function(){ x.className = x.className.replace("show", ""); },3000);
}