// 显示加载进度条
function showLoadingProgress(progress) {
    const progressBar = document.getElementById('progress');
    progressBar.style.width = progress + '%';
  }
  
  // 1. 获取视频流并设置摄像头
  async function setupCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    video.srcObject = stream;
  
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }
  
  // 2. 加载 HandPose 模型并显示加载进度
  async function loadHandPoseModel() {
    const loadingContainer = document.getElementById('loading-container');
    loadingContainer.style.display = 'block'; // 显示加载进度条
  
    const model = await handpose.load({
      flipHorizontal: false,  // 不要水平翻转模型
      progressCallback: (fraction) => {
        const progress = Math.round(fraction * 100); // 计算加载的百分比
        showLoadingProgress(progress); // 更新进度条
      }
    });
  
    loadingContainer.style.display = 'none'; // 隐藏加载进度条
    return model;
  }
  
  // 3. 识别手势
  async function detectGesture(video, model) {
    const predictions = await model.estimateHands(video);
  
    // 如果没有检测到手部，则显示"检测中..."
    if (predictions.length === 0) {
      document.getElementById('result').innerText = "检测中...";
      requestAnimationFrame(() => detectGesture(video, model));
      return;
    }
  
    const landmarks = predictions[0].landmarks; // 获取手部的关键点
    const fingers = detectFingers(landmarks);
  
    let resultText = "检测中...";
  
    // 基于手指的状态判断手势
    switch (fingers) {
      case 1:
        resultText = "一";
        break;
      case 2:
        resultText = "二";
        break;
      case 3:
        resultText = "三";
        break;
      case 4:
        resultText = "四";
        break;
      case 5:
        resultText = "五";
        break;
      default:
        resultText = "无法识别手势";
        break;
    }
  
    // 更新检测结果显示
    document.getElementById('result').innerText = resultText;
  
    // 每一帧进行检测
    requestAnimationFrame(() => detectGesture(video, model));
  }
  
  // 4. 判断手势
  function detectFingers(landmarks) {
    let fingers = 0;
  
    // 判断每个手指是否伸出：如果手指的末端关键点在其他关键点的上方，说明该手指伸出
    // 对于每根手指，检查其关键点位置
    // 手指顺序: [1: thumb, 2: index, 3: middle, 4: ring, 5: pinky]
  
    // 检查每根手指的伸展情况
    const thumb = landmarks[4];  // 拇指
    const index = landmarks[8];  // 食指
    const middle = landmarks[12];  // 中指
    const ring = landmarks[16];  // 无名指
    const pinky = landmarks[20];  // 小拇指
  
    if (index[1] < thumb[1]) fingers++;  // 如果食指的末端在拇指的末端前面，说明食指伸展
    if (middle[1] < index[1]) fingers++;  // 如果中指的末端在食指的末端前面，说明中指伸展
    if (ring[1] < middle[1]) fingers++;  // 如果无名指的末端在中指的末端前面，说明无名指伸展
    if (pinky[1] < ring[1]) fingers++;  // 如果小拇指的末端在无名指的末端前面，说明小拇指伸展
  
    // 在"四"和"五"的判断上，可以加大判断容忍度，避免误判
    if (ring[1] < middle[1] && pinky[1] < ring[1]) {
      // 可能"四"或者"五"的手势识别较弱，可以通过容忍度来改进
      fingers = (fingers === 4) ? 5 : fingers;
    }
  
    return fingers;
  }
  
  async function main() {
    // 等待模型加载
    const model = await loadHandPoseModel();
    
    // 设置视频流并开始播放
    const video = await setupCamera();
    video.play();
  
    // 开始手势识别
    detectGesture(video, model);
  }
  
  main();
  