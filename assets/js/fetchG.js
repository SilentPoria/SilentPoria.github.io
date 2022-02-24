fetchG = function(){
	fetch('https://v1.hitokoto.cn/?c=b&c=c&c=a')
    .then(function (res){
      return res.json();
    })
    .then(function (data) {
      var hitokoto = document.getElementById('hitokoto');
      var sfrom = document.getElementById('sfrom');
      hitokoto.innerText = data.hitokoto;
      sfrom.innerText = data.from
    })

}
