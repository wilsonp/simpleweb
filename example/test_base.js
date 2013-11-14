var querystring = require('querystring');
var req = 'loginname=admin&password=admin';
//req.sessionId = 'xxx';
var obj = querystring.parse(req);
console.log(obj);

