var gat = function(){
	fetch('https://v1.hitokoto.cn/?c=b')
    .then(function (res){
      return res.json();
    })
alert(gat)