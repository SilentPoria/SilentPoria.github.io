function downloadMusic() {
    // 获取音频元素
    const audio = document.getElementById('myAudio');

    // 设置音频的下载属性
    audio.setAttribute('download', 'music.mp3');

    // 模拟点击播放按钮，触发下载
    const playButton = document.querySelector('button');
    playButton.click();
}