//基本
let combo = 0
let max_combo = 0
let pf_notes = [0,0] //[大p，小p]
let g_notes = [0,0] //[early,late]
let bad_notes = 0 //bad
let loader = 'False'//加载状态

//
const inputName = document.getElementById('input-name');//歌名
const inputLevel = document.getElementById('input-level');//等级
const inputDesigner = document.getElementById('input-designer');//曲绘
const inputIllustrator = document.getElementById('input-illustrator');//谱师名称
const inputOffset = document.getElementById('input-offset');//延迟//
const lineColor = document.getElementById('lineColor');//
const autoplay = document.getElementById('autoplay');
const hyperMode = document.getElementById('hyperMode');
const showTransition = document.getElementById('showTransition');


//抛出信息
const message = {
	out: document.getElementById('msg-out'),
    sendinfo(msg) {
		this.out.innerText = msg ;}
    }




//选择zip
const upload = document.getElementById('upload-zip');
const uploads = document.getElementById('uploads-zip');
upload.onchange = function() {
	const file = this.files[0];
	document.getElementById('filename').value = file.name //显示文件（谱面）名称
	if (file) {
        upload.disabled = 'True';
	    loadFile(file);
	}else{
    console.log('未选择任何文件');
    return;
    }
}


//加载文件
const out = document.getElementById('msg-out');

const loadFile = function(file) {
    loader = 'True';
    const reader = new FileReader();//建立存储文件空间
    reader.readAsArrayBuffer(file);//用于将文件作为数组缓冲区读取
    console.log(reader.result);
    //文件加载进度
    reader.onprogress = progress => {
            const file_size = file.size;
            message.sendinfo('加载文件：'+ progress.loaded / file_size * 100+'%')
    };
    reader.onload = async function() {
		const reader = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(this.result)));
    
    
    
    
    
    }

}

//兼容Safari
const res = {} //存放资源
//初始化 //////////////////////////////////////此处参考lchzh代码
window.onload = async function() {
	message.sendinfo('初始化中...');
	//加载资源
	await (async function() {
		let loadedNum = 0;
		await Promise.all((obj => {
			const arr = [];
			for (const i in obj) arr.push([i, obj[i]]);
			return arr;
		})({
			JudgeLine: 'src/JudgeLine.png',
			ProgressBar: 'src/ProgressBar.png',
			SongsNameBar: 'src/SongsNameBar.png',
			Pause: 'src/Pause.png',
			clickRaw: 'src/clickRaw.png',
			Tap: 'src/Tap.png',
			Tap2: 'src/Tap2.png',
			TapHL: 'src/TapHL.png',
			Drag: 'src/Drag.png',
			DragHL: 'src/DragHL.png',
			HoldHead: 'src/HoldHead.png',
			HoldHeadHL: 'src/HoldHeadHL.png',
			Hold: 'src/Hold.png',
			HoldHL: 'src/HoldHL.png',
			HoldEnd: 'src/HoldEnd.png',
			Flick: 'src/Flick.png',
			FlickHL: 'src/FlickHL.png',
			LevelOver1: 'src/LevelOver1.png',
			LevelOver3: 'src/LevelOver3.png',
			LevelOver4: 'src/LevelOver4.png',
			LevelOver5: 'src/LevelOver5.png',
			Rank: 'src/Rank.png',
			NoImage: 'src/0.png',
			mute: 'src/mute.ogg',
			HitSong0: 'src/HitSong0.ogg',
			HitSong1: 'src/HitSong1.ogg',
			HitSong2: 'src/HitSong2.ogg'
		}).map(([name, src], _i, arr) => {      
			const xhr = new XMLHttpRequest();
			xhr.open('get', `${src}${window['isApple'] ? `?v=${Date.now()}` : ''}`, true); //针对苹果设备强制刷新
			xhr.responseType = 'arraybuffer';
			xhr.send();
			return new Promise(resolve => {
				xhr.onload = async () => {
					if (/\.(mp3|wav|ogg)$/i.test(src)) res[name] = await actx.decodeAudioData(xhr.response);
					else if (/\.(png|jpeg|jpg)$/i.test(src)) res[name] = await createImageBitmap(new Blob([xhr.response]));
					message.sendinfo(`加载资源：${Math.floor(++loadedNum / arr.length * 100)}%`);
					resolve();
				};
			});
		}));
		res['JudgeLineMP'] = await createImageBitmap(imgShader(res['JudgeLine'], '#feffa9'));
		res['JudgeLineAP'] = await createImageBitmap(imgShader(res['JudgeLine'], '#a3ffac'));
		res['JudgeLineFC'] = await createImageBitmap(imgShader(res['JudgeLine'], '#a2eeff'));
		res['TapBad'] = await createImageBitmap(imgShader(res['Tap2'], '#6c4343'));
		res['Clicks'] = {};
		//res['Clicks'].default = await qwqImage(res['clickRaw'], 'white');
		res['Ranks'] = await qwqImage(res['Rank'], 'white');
		res['Clicks']['rgba(255,236,160,0.8823529)'] = await qwqImage(res['clickRaw'], 'rgba(255,236,160,0.8823529)'); //#fce491
		res['Clicks']['rgba(168,255,177,0.9016907)'] = await qwqImage(res['clickRaw'], 'rgba(168,255,177,0.9016907)'); //#97f79d
		res['Clicks']['rgba(180,225,255,0.9215686)'] = await qwqImage(res['clickRaw'], 'rgba(180,225,255,0.9215686)'); //#9ed5f3
		message.sendMessage('等待上传文件...');
		upload.parentElement.classList.remove('disabled');
	})();
	const createImage = () => {
		const b = document.createElement('canvas').getContext('2d');
		b.drawImage(res['JudgeLine'], 0, 0);
		return b.getImageData(0, 0, 1, 1).data[0];
	}
	if (!createImage()) message.throwError('检测到图片加载异常，请关闭所有应用程序然后重试');
}




