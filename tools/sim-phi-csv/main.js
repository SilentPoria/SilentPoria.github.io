//手动
function Manual(){
    var Chart1 = document.getElementById('Chart').value
    var Music1 = document.getElementById('Music').value
    var Image1 = document.getElementById('Image').value
    var AspectRatio1 = document.getElementById('AspectRatio').value
    var ScaleRatio1 = document.getElementById('ScaleRatio').value
    var GlobalAlpha1 = document.getElementById('GlobalAlpha')
    var Name1 = document.getElementById('Name')
    var Level1 = document.getElementById('Level')
    var Illustrator1 = document.getElementById('Illustrator')
    var Designer1 = document.getElementById('Designer')
    list = [{Chart:Chart1,
            Music:Music1,
            Image:Image1,
            AspectRatio:AspectRatio1,
            ScaleRatio:ScaleRatio1,
            GlobalAlpha:GlobalAlpha1,
            Name:Name1,
            Level1:Level1,
            Illustrator:Illustrator1,
            Designer:Designer1
        }]
    console.log(list)
}
//获取输入信息
//判断是否有空输入框
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