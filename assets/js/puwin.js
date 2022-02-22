
window.onload=function(){
var oBox=document.getElementById('box');
var oShare=document.getElementById('share');
var timer=null;  //定义一个空的定时器

function startmove(iTarget){
    var speed=0;  //定义步长
    clearInterval(timer); //每次调用函数后，先执行关闭定时器的代码，目的是防止多次操作导致计时器叠加出现变速的Bug
    timer=setInterval(function(){
        if(oBox.offsetLeft<iTarget){  //目标值从事件调用函数中传入，当盒子左边距小于目标值时，说明还没移动到指定位置，让步长=10，往右运动
            speed=10;
        }
        else{    //否则就是超过了目标值，让步长=-10，往左运动
            speed=-10;
        }
        if(oBox.offsetLeft==iTarget){   //当盒子左边距等于目标值时，就关闭计时器
            clearInterval(timer);
        }
        else{
            oBox.style.left=oBox.offsetLeft+speed+'px';   //盒子左边的距离，即移动的距离，注意加上单位；这个else分支也解决了一个bug:当满足条件停下来后，继续点击还会运动，所以加上else分支
        }
    },30)
}
//函数调用
oBox.onmouseover=function(){
    startmove(0);
}
oBox.onmouseout=function(){
    startmove(-200);
}

