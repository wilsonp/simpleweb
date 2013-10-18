var url = require('url');
var querystring = require('querystring');


module.exports = query;

function query(req,res,next){
  var param = url.parse(req.url).query;
  if(param){
    var queryObj = querystring.parse(param);    
    req.query = queryObj;    
  }
  next();
}