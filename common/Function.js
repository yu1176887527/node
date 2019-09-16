exports.trim=function(str,char=" "){
    if(typeof char != "string") throw new Error("参数char必须为字符串类型");
    var reg=new RegExp(`^(${char})+|(${char})+$`,"g");
    return str.replace(reg,"");
}