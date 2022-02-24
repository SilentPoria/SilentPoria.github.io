fetchG = function(){
	fetch('https://v1.hitokoto.cn/?c=b&c=c&c=a&c=d&c=e&c=f&c=a&c=g&c=h&c=i&c=j&c=k')
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
