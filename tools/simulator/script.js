//基本
let combo = 0
let max_combo = 0
let pf_notes = [0,0] //[大p，小p]
let g_notes = [0,0] //[early,late]
let bad_notes = 0 //bad
let loader = 'False'//加载状态
const stopPlaying = []
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
//模块加载路径
const urls = {
	zip: ['//cdn.jsdelivr.net/npm/@zip.js/zip.js/dist/zip.min.js', '//fastly.jsdelivr.net/npm/@zip.js/zip.js/dist/zip.min.js'],
	browser: ['//cdn.jsdelivr.net/gh/mumuy/browser/Browser.js', '//fastly.jsdelivr.net/gh/mumuy/browser/Browser.js', '//passer-by.com/browser/Browser.js'],
	bitmap: ['//cdn.jsdelivr.net/gh/Kaiido/createImageBitmap/dist/createImageBitmap.js', '//fastly.jsdelivr.net/gh/Kaiido/createImageBitmap/dist/createImageBitmap.js'],
	blur: ['//cdn.jsdelivr.net/npm/stackblur-canvas', '//fastly.jsdelivr.net/npm/stackblur-canvas'],
	md5: ['//cdn.jsdelivr.net/npm/md5-js', '//fastly.jsdelivr.net/npm/md5-js'],
}


//抛出信息
const message = {
	out: document.getElementById('msg-out'),
    sendinfo(msg) {
		this.out.innerText = msg ;}
    }

//给图片上色
function imgShader(img, color) {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const imgData = ctx.getImageData(0, 0, img.width, img.height);
	const data = hex2rgba(color);
	for (let i = 0; i < imgData.data.length / 4; i++) {
		imgData.data[i * 4] *= data[0] / 255;
		imgData.data[i * 4 + 1] *= data[1] / 255;
		imgData.data[i * 4 + 2] *= data[2] / 255;
		imgData.data[i * 4 + 3] *= data[3] / 255;
	}
	return imgData;
}

//十六进制color转rgba数组
function hex2rgba(color) {
	const ctx = document.createElement('canvas').getContext('2d');
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);
	return ctx.getImageData(0, 0, 1, 1).data;
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
// Return
async function awaImage(img, color) {
	const clickqwq = imgShader(img, color);
	const arr = [];
	const min = Math.min(img.width, img.height);
	const max = Math.max(img.width, img.height);
	for (let i = 0; i < parseInt(max / min); i++) arr[i] = await createImageBitmap(clickqwq, 0, i * min, min, min);
	return arr;
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
async function checkSupport() {
	window.addEventListener('error', e => message.sendinfo(e.message));
	window.addEventListener('unhandledrejection', e => message.sendinfo(e.reason));
	//兼容性检测
	message.sendinfo('加载StackBlur组件...');
	if (typeof StackBlur != 'object') await loadJS(urls.blur).catch(() => message.throwError('StackBlur组件加载失败，请检查网络'));
	message.sendinfo('加载md5组件...');
	if (typeof md5 != 'function') await loadJS(urls.md5).catch(() => message.throwError('md5组件加载失败，请检查网络'));
	message.sendinfo('加载Browser组件...');
	if (typeof Browser != 'function') await loadJS(urls.browser).catch(() => message.throwError('Browser组件加载失败，请检查网络'));
	message.sendinfo('加载zip组件...');
	if (typeof zip != 'object') await loadJS(urls.zip).catch(() => message.throwError('zip组件加载失败，请检查网络'));
	message.sendinfo('检查浏览器兼容性...');
	const info = new Browser;
	if (info.browser == 'XiaoMi') message.sendWarning('检测到小米浏览器，可能存在切后台声音消失的问题');
	if (info.browser == 'Safari') {
		if (info.os == 'Mac OS' && parseFloat(info.version) < 14.1) message.sendinfo('检测到Safari(MacOS)版本小于14.1，可能无法正常使用模拟器');
		else if (parseFloat(info.version) < 14.5) message.sendinfo('检测到Safari(iOS)版本小于14.5，可能无法正常使用模拟器');
	}
	if (info.os == 'iOS' && parseFloat(info.osVersion) < 14.5) message.sendinfo('检测到iOS版本小于14.5，可能无法正常使用模拟器');
	// if (info.os == 'iOS' && parseFloat(info.osVersion) >= 15.4) message.sendWarning(`${info.os}${info.osVersion}：qwq`);
	if (info.os == 'iOS' || info.browser == 'Safari') window['isApple'] = true;
	if (typeof createImageBitmap != 'function') await loadJS(urls.bitmap).catch(() => message.sendinfo('当前浏览器不支持ImageBitmap'));
	message.sendinfo('加载声音组件...');
	const oggCompatible = !!(new Audio).canPlayType('audio/ogg');
	if (!oggCompatible) await loadJS('/lib/oggmented-bundle.js').catch(() => message.info('oggmented兼容模块加载失败，请检查网络'));
	if (!oggCompatible && typeof oggmented != 'object') message.throwError('oggmented兼容模块运行失败，请检查浏览器版本');
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	if (!AudioContext) message.throwError('当前浏览器不支持AudioContext');
	const actx = oggCompatible ? new AudioContext() : new oggmented.OggmentedAudioContext(); //兼容Safari
	const gain = actx.createGain();
	const playSound = (res, loop, isOut, offset, playbackrate) => {
		const bufferSource = actx.createBufferSource();
		bufferSource.buffer = res;
		bufferSource.loop = loop; //循环播放
		bufferSource.connect(gain);
		bufferSource.playbackRate.value = Number(playbackrate || 1);
		if (isOut) gain.connect(actx.destination);
		bufferSource.start(0, offset);
		return () => bufferSource.stop();
	}
	Object.assign(window, { actx, stopPlaying, playSound });
	//message.sendMessage('检测是否支持全屏...');
	//if (!full.enabled) message.sendWarning('检测到当前浏览器不支持全屏，播放时双击右下角将无反应');

	function loadJS(qwq) {
		const a = (function*(arg) { yield* arg; })(qwq instanceof Array ? qwq.reverse() : arguments);
		const load = url => new Promise((resolve, reject) => {
			if (!url) return reject();
			const script = document.createElement('script');
			script.onload = () => resolve(script);
			script.onerror = () => load(a.next().value).then(script => resolve(script)).catch(e => reject(e));
			script.src = url;
			script.crossOrigin = 'anonymous';
			document.head.appendChild(script);
		});
		return load(a.next().value);
	}
}


window.onload = async function() {
	message.sendinfo('初始化中...');
	await checkSupport();
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
		res['Ranks'] = await awaImage(res['Rank'], 'white');
		res['Clicks']['rgba(255,236,160,0.8823529)'] = await awaImage(res['clickRaw'], 'rgba(255,236,160,0.8823529)'); //#fce491
		res['Clicks']['rgba(168,255,177,0.9016907)'] = await awaImage(res['clickRaw'], 'rgba(168,255,177,0.9016907)'); //#97f79d
		res['Clicks']['rgba(180,225,255,0.9215686)'] = await awaImage(res['clickRaw'], 'rgba(180,225,255,0.9215686)'); //#9ed5f3
		message.sendinfo('等待上传文件...');
		upload.parentElement.classList.remove('disabled');
	})();
	const createImage = () => {
		const b = document.createElement('canvas').getContext('2d');
		b.drawImage(res['JudgeLine'], 0, 0);
		return b.getImageData(0, 0, 1, 1).data[0];
	}
	if (!createImage()) message.throwError('检测到图片加载异常，请关闭所有应用程序然后重试');
}


