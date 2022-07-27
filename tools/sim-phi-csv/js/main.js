//手动
function Manual(){
    //获取输入信息
    var Chart1 = document.getElementById('Chart').value
    var Music1 = document.getElementById('Music').value
    var Image1 = document.getElementById('Image').value
    var AspectRatio1 = document.getElementById('AspectRatio').value
    var index = document.getElementById('ScaleRatio').selectedIndex 
    var ScaleRatio1 = document.getElementById('ScaleRatio').options[index].value
    var GlobalAlpha1 = document.getElementById('GlobalAlpha').value
    var Name1 = document.getElementById('Name').value
    var Level1 = document.getElementById('Level').value
    var Illustrator1 = document.getElementById('Illustrator').value
    var Designer1 = document.getElementById('Designer').value
    //判断是否有空输入框（先鸽着
    //
    list = [{"Chart":Chart1,
            "Music":Music1,
            "Image":Image1,
            "AspectRatio":AspectRatio1,
            "ScaleRatio":ScaleRatio1,
            "GlobalAlpha":GlobalAlpha1,
            "Name":Name1,
            "Level1":Level1,
            "Illustrator":Illustrator1,
            "Designer":Designer1
        }]

    return list;
}


//判断是否有错误输入
//生成csv

//自动
//获取（上传）旧pec
//解压
//读取info.txt
//分类信息
//生成csv
//csv移入文件夹
//压缩
//生成