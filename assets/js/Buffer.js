window.onload=function(){
    var oBox=document.getElementById('box');
    var timer=null;
    function startmove(iTarget){
        clearInterval(timer);
        timer=setInterval(function(){
            //求步长，为正向右移动，为负向左移动，10为自定义
            var speed=(iTarget-oBox.offsetLeft)/10;
            //对步长取整，大于0向上取整，小于0向下取整，原因就是正数越来越大，负数越来越小
            speed=speed>0?Math.ceil(speed):Math.floor(speed);
            //设置left的值
            oBox.style.left=oBox.offsetLeft+speed+'px';
        },30)
    }

    oBox.onmouseenter=function(){
        startmove(0);
    }
    oBox.onmouseleave=function(){
        startmove(-200);
    }
}