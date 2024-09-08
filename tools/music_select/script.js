function main() {
  var keyword = document.getElementById('search-input').value;
  console.log(keyword);
  var source = document.getElementById('search-source').value;
  try {
    search(keyword).then((result) => {
      console.log(result);
      if (result) {
        for (let item of result) {
          console.log(item.songId, item.songName,item.songUrl,item.songArtist,item.songName);
          add(item)
        }
      } else {
        console.error('搜索结果未找到');
      }
    }).catch((error) => {
      console.error('请求失败:', error);
    });
  } catch (error) {
    console.error('主函数中发生错误:', error);
  }
}

function search(songName) {
  var data = { 'songName': songName };
  var jsonData = JSON.stringify(data);

  return fetch('http://113.44.70.233/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('请求失败 ' + response.status);
    }
    return response.json();
  })
  .then(jsonResponse => {
    return jsonResponse.result; // 假设返回的 JSON 对象有一个名为 'result' 的属性
  })
  .catch(error => {
    console.error('请求失败:', error);
    throw error;
  });
}
  function add(results) {
    // 模拟搜索结果（实际应用中应替换为实际的搜索逻辑）
    //var results = [{ title: '搜索结果1', url: 'http://example.com/result1' },{ title: '搜索结果2', url: 'http://example.com/result2' }];

    // 清空之前的搜索结果
    //var resultsContainer = document.getElementById('search-results');
    //resultsContainer.innerHTML = '';
    //resultsContainer.style.display = 'block'; // 显示搜索结果

    // 添加新的搜索结果
    var resultsContainer = document.querySelector('.search-results'); // 获取搜索结果容器
    var resultElement = document.createElement('div'); // 创建新的 div 元素
    resultElement.classList.add('result');

    // 创建新的 div 元素
    resultElement.innerHTML = `
        <h3 class="result-title">${results.songName}</h3>
        <p class="result-artist">${results.songArtist}</p>
        <a download='${results.songName}.mp3' onclick="downloadMusic('${results.songUrl}','${results.songName}','${results.songArtist}')" class="download-btn" target='_blank'>下载</a>
    `;
    resultsContainer.appendChild(resultElement);
  
  };


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



