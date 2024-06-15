

// 弹出式提示框
const prompt = (message, style, time = 1200) => {
    const successElement = document.getElementById('success');
    successElement.classList.add('show');
    ['alert-success', 'alert-danger', 'alert-warning', 'alert-info'].forEach(cls => successElement.classList.remove(cls));
    successElement.classList.add(style);
    document.getElementById('tip').textContent = message;
    setTimeout(() => successElement.classList.remove('show'), time);
};

// 判断音乐链接类型
const detectMusicLinkType = musicLink => {
    // 音乐平台链接的正则表达式
    const patterns = {
        'netease': /music\\.163\\.com\\song\\?id=/,
        'qq': /y\\.qq\\.com\\song\\?.+songmid=/
    };
    for (let platform in patterns) {
        if (patterns[platform].test(musicLink)) {
            return platform; // 返回匹配到的平台名称
        }
    }
    return 'netease' ; // 如果没有匹配到任何平台，返回unknown
}

// 下载音乐的函数
const downloadMusic = (musicUrl,name='untitle',composer='unkown') => {
    const fileName = `${name} - ${composer}.mp3`;
    fetch(musicUrl)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            document.body.appendChild(a); // 添加到文档中才能触发点击
            a.click();
            document.body.removeChild(a); // 下载后移除元素
            URL.revokeObjectURL(a.href);
        })
        .catch(
            error => prompt('下载失败:'+error, 'alert-danger'));     
    };





// 添加下载按钮事件监听
document.addEventListener('DOMContentLoaded', () => {
    console.log('触发下载');
    const downloadButton = document.querySelector('.main button');
    downloadButton.addEventListener('click',async() => {
        const musicLink = document.querySelector('.main input[type="text"]').value;
        if (musicLink) {
            const musicLinkType = detectMusicLinkType(musicLink);
            console.log('识别平台为'+musicLinkType);
            if (musicLinkType === 'unknown') {
                prompt('请输入正确的音乐链接...', 'alert-danger');
                return;
            }else if (musicLinkType === 'netease') {
                    try {
                        var musicId =  await neteaseMusicIdGet(musicLink);
                        var musicTrueUrl = getNeteaseMusicUrl(musicId);
                        var musicInfo =  await neteaseMusicInfo(musicId); // 使用await等待Promise解决
                        var musicName = musicInfo['songs'];
                        var musicSinger = musicInfo['sings'];
                        prompt('解析成功' + (musicName + ' - ' + musicSinger), 'alert-success');
                    } catch (error) {
                        prompt('解析音乐信息失败', 'alert-danger');
                        console.error(error);
                    }
            }
        } else {
            prompt('请输入音乐链接...', 'alert-danger');
        }
    });
});


