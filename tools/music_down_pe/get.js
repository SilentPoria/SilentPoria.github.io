function get_value(){
var music_url = document.getElementById('url_music').value;
var s_mode = document.getElementById('get_mode');
var mode = s_mode.options[s_mode.options.selectedIndex].value;
console.log("选择模式："+mode,'链接：'+(music_url));
return [mode,music_url]
}

function slice_fct(){
    var gvalue = get_value()
    var mode  = gvalue[0];
    var music_url  = gvalue[1];
    if( mode == 1){
    }else if( mode == 2)
    {
        var list_id = music_url.split('&');
        var id = list_id[1].split('=');
        var music_id = id[1]
        console.log('print',music_id);
        downloadUrlFile('http://music.163.com/song/media/outer/url?id='+music_id+'.mp3','music')
    }else{};

    

}

function downloadUrlFile(url){
    new $Msg({
        content:"我的自定义弹窗好了",
        type:"success",
        cancle:function(){
          let cancle = new $Msg({
            content:"我是取消后的回调"
          })
        },
        confirm:function(){
          new $Msg({content:"我是确定后的回调"})
        }
      })
    }