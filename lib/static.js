var fs = require('fs');
var url = require('url');

function url2path(urlStr){
  var pathObj = url.parse(urlStr);
  var path = pathObj.path;
  return path;
}

module.exports = function static(parent_path){
  return function(req,res,next){
     var path = url2path(req.url);
     function callback(err,data){
        if(err){
          res.statuCode = 404;
        }else{
          res.write(data);
        }
        res.end();
     }
     fs.readFile(parent_path + path,'utf-8',path);
  }
}