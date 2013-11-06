var fs = require('fs'),
	path = require('path');

// 过滤 \r\n
function filterRN(s){
    s = s.replace("\'","\"");
    s = s.replace(/\n/g,"\\n");
    s = s.replace(/\r/g,"\\r");
    return "result += \'"+s+"\';\n\r";
}   

module.exports = function(viewDir){
	var viewCache = {};
	fs.readdir(viewDir,function(err,files){
		files.forEach(function(file){
			var filePath = path.join(viewDir,file);
			fs.readFile(filePath,function(err,data){
				var content = data.toString();
				var buf = [];
				buf.push("var result = '';");
				var htmlPart = '';
				for(var i = 0,len = content.length;i<len;){
					
					if(content.slice(i,i+2) === '<%'){
						var end = content.indexOf('%>',i);//从i出查找
						var jsPart = content.slice(i+2,end);//截取出<%  %>封闭的内容

						i = end + 2;
						buf.push(filterRN(htmlPart));
						htmlPart = '';

						if(jsPart.slice(0,1) === '='){//如果第一个是等于号，则说明是需要赋值的部分
							buf.push("\r\nresult += " + jsPart.slice(1) + ";\r\n");
						}else{//其余部分直接放到buf里
							buf.push("\r\n" + jsPart + "\r\n");
						}

					}else{
						htmlPart += content.slice(i,i+1);
						i++;
					}
				}

				buf.push(filterRN(htmlPart));

				buf.push("return result;")
				
				viewCache[file] = new Function('locals',buf.join(''));
			});
		});
	});

	return function(req,res,next){
		res.view = function(filename,locals){
			res.write(viewCache[filename](locals));
			res.end();
		}
		next();
	}

}
