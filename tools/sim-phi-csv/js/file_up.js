function upload() {
    var inputObj=document.createElement('input')
    inputObj.setAttribute('id','file');
    inputObj.setAttribute('type','file');
    inputObj.setAttribute('name','file');
    inputObj.setAttribute("style",'visibility:hidden');
    document.body.appendChild(inputObj);
    inputObj.value;
    inputObj.click();
    console.log(inputObj);
} 

$("#chooseFile").on('click',function(){
    upload();
    document.querySelector('#file').addEventListener('change', e => {
        for (let entry of e.target.files){
            document.getElementById("fileNameInput").value=entry.name;
            console.log(entry.name, entry.webkitRelativePath);
        }
    });
});
 $("#fileImport").on('click',function(){
    //文件上传事件
});