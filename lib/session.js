var sessionCache = {},
		sid = Date.now();
module.exports = function(req,res,next){
	Object.defineProperty(req,'session',{
		get:function(){
			return sessionCache[this.sessionId];
		},
		set:function(value){
			sessionCache[this.sessionId] = value;
		}
	});

	if(!(req.headers.cookie && (req.sessionId = parse(req.headers.cookie).sessionId))){
		req.sessionId = sid + 1;
		res.setHeader('Set-Cookie:',['sessionId=' + req.sessionId]);
	}
	next();
}

function parse(cookie){
	var carray = cookie.split(';'),
		obj = {};
	carray.forEach(function(field){
		var o = field.split('=');
		obj[o[0].trim()] = o[1];
	});
	return obj;
}

// { accept: 'text/html, application/xhtml+xml, */*',
//   'accept-language': 'zh-CN',
//   'user-agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Tride
// nt/5.0) LBBROWSER',
//   'accept-encoding': 'gzip, deflate',
//   host: '127.0.0.1:8000',
//   connection: 'Keep-Alive' }