var fk = require('../index.js'),
	App = fk.App,
	app = new App,
	view = fk.view,
	session = fk.session;

app.use(session);
app.use(view(__dirname + '/view'));

app.get('/',function(req,res){
	res.view('index.html',{title:'test view',name:'wilson'});
});

app.get('/num',function(req,res){
	req.session = req.session || 0;
	req.session++;
	res.view('num.html',{title:'num page',num:req.session});
});

app.listen(8000);
console.log('server started...');