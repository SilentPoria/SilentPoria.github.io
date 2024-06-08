//wyy
// 获取音乐ID的函数
const neteaseMusicIdGet = musicLink => {
    if (!musicLink || !musicLink.startsWith('http')) {
        prompt('请输入正确的音乐链接', 'alert-danger');
        return null;
    }
    const musicId = musicLink.split('&')[0].split('=')[1];
    prompt(`解析成功! 音乐ID: ${musicId}`, 'alert-success');
    return musicId;
};


const getNeteaseMusicUrl = async musicId => {
    try {
        const response = await fetch(`https://dataiqs.com/api/netease/music/?type=songid&id=${musicId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data['song_url']);
        return data['song_url'];
    } catch (error) {
        console.error('请求失败：', error);
    }
};

function neteaseMusicInfo(musicId) {
    const url = 'https://tenapi.cn/v2/songinfo';
    const data = {id: musicId};
    // 使用fetch API发送POST请求
    fetch(url, {
        method: 'POST', // 设置请求方法为POST
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: new URLSearchParams(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        //console.log(data['data']);
        var data = data;
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
    return data
}