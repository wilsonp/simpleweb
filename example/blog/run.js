var fk = require('../../index.js'),
	App = fk.App;
	app = new App,
	_static = fk.static,
	view = fk.view,
	session = fk.session,
	redirect = fk.redirect,
	post = fk.postbin,
	query = fk.query,
	download = fk.download,
	articles = require('./articles.js'),
	types = require('./types.js'),
	admin = {loginname:"admin",password:"admin"} ;

app.use(_static(__dirname + '/public'));
app.use(post);
app.use(query);
app.use(redirect);
app.use(session);
app.use(download);
app.use(view(__dirname + '/view'));

function isLogin(req){
	// console.log(req.hasOwnProperty('session'));
	req.session = req.session || {};
	return req.session.logined;
}

//主页
app.get('/',function(req,res){
	var type = req.query.type,
		arts;
	if(type){
		arts = articles.getByType(type);
	}else{
		arts = articles;
	}
	res.view('index.html',{
		isLogined:isLogin(req),
		types:types,
		articles:arts,
	});
});

app.get('/login',function(req,res){
	res.view('login.html',{msg:'请输入用户名和密码'});
})

app.post('/login',function(req,res){
	if(req.body.loginname === admin.loginname && req.body.password === admin.password){
		req.session.logined = true;
		res.redirect('/');
	}else{
		res.view('login.html',{msg:'用户名或密码错误'});
	}
});
//类别管理
app.get('/type/manage',function(req,res){
	if(isLogin(req)){
		res.view('type_manager.html',{
			types:types
		});
	}else{
		res.redirect('/');
	}
});
//创建类别
app.post('/type/create',function(req,res){
	if(isLogin(req)){
		var title = req.body.title;
		types.create(title);
		res.redirect('/type/manage');
	}else{
		res.redirect('/');
	}
	
});

//类别管理
app.post('/type/del/:id',function(req,res){
	if(isLogin(req)){
		var id = req.params.id;
		types.del(id);
		res.redirect('/type/manage');
	}else{
		res.redirect('/');
	}
});
//类别管理
app.post('/type/update/:id',function(req,res){
	if(isLogin(req)){
		var id = req.params.id;
		var title = req.body.title;
		types.update(title,id);
		res.redirect('/type/manage');
	}else{
		res.redirect('/');
	}
});

//创建文章
app.get('/create',function(req,res){
	if(isLogin(req)){
		res.view('create.html',{
			types:types
		});
	}else{
		res.redirect('/');
	}
});

app.post('/create',function(req,res){
	if(isLogin(req)){
		var data = {
			typeId:req.body.type,
			title:req.body.title,
			content:req.body.content,
			img:req.files.img
		};
		articles.create(data);
	}
	res.redirect('/');

});

app.get('/article/:id',function(req,res){
	if(isLogin(req)){
		var id = req.params.id;
		var art = articles.getById(id);
		res.view('view.html',{
			article:art
		});
	}else{
		res.redirect('/');
	}
});

//加载图片
app.get('/img/:articleId',function(req,res){
	if(isLogin(req)){
		var id = req.params.articleId;
		var art = articles.getById(id);
		res.download('img',new Buffer(art.img,'base64'));
	}else{
		res.redirect('/');
	}
});

app.get('/edit/:id',function(req,res){
	if(isLogin(req)){
		var art = articles.getById(req.params.id);
		res.view('edit.html',{
			article:art,
			types:types
		});
	}
});

app.post('/update/:id',function(req,res){
	if(isLogin(req)){
		var id = req.params.id;
		if(req.files.img !== null){
			console.log('xxxxxxxxxxxxx');
			req.body.img = req.files.img;
		}
		articles.update(id,req.body);
	}
	res.redirect('/');
});

app.get('/del/:id',function(req,res){
	if(isLogin(req)){
		var id = req.params.id;
		articles.delById(id);
	}
	res.redirect('/');
});

app.get('/logout',function(req,res){
	if(isLogin(req)){
		req.session.logined = false;
	}
	res.redirect('/');
});


app.listen(8000);
console.log('blog server started...');
