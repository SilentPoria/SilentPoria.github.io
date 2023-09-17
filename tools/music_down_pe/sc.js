
//测试用例
//Euphoria (feat. Tsugumi Nagahara)
//电脑端链接https://music.163.com/song?id=1899317143&userid=3964654302
//手机端链接https://y.music.163.com/m/song?app_version=8.9.40&id=1899317143&textid=1069001&uct2=XI/QdzGwQMqi3tL3txG7Qg%3D%3D&dlt=0846
//手机
//报错list
fault = ["Cannot read properties of undefined (reading 'split')",]


function selection(){
    var m_url = document.getElementById('url').value
    var mode = document.getElementById('selection');
    var mode = mode.options[mode.options.selectedIndex].value;
    console.log("选择模式："+mode,'链接：'+(m_url));
    if(mode == 'wyy'){
        wyy_music(m_url)
    }
};

function wyy_music(url){
    var u = url
    try { //对代码是网易云电脑端还是手机端进行判断
        test1 = u.indexOf('music.163.com/song');
        test2 = u.indexOf('y.music.163.com/m');
        console.log(test)
        if(test1 != -1 ){
            //判断为电脑端链接
            console.log('This link is from the computer')
            var music_id = u.split('?')[1].split('&')[0].split('=')[1];//获取音乐id
            console.log(music_id)
            console.log('http://music.163.com/song/media/outer/url?id='+music_id+'.mp3','music')
            window.location.href='http://music.163.com/song/media/outer/url?id='+music_id+'.mp3'
        }else if(test2 != -1){
            //当判断为手机端链接
            console.log('This link is from the phone')
            var music_id = u.split('&')[1].split('=')[1];//获取音乐id
            console.log('http://music.163.com/song/media/outer/url?id='+music_id+'.mp3','music')
            window.location.href='http://music.163.com/song/media/outer/url?id='+music_id+'.mp3'
        }else{inmp('链接存在问题')}
    }
    catch(err) {
        if(err.message==fault[0]){
            inmp(err.message)
        }
    }
}


function inmp(text) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
  }