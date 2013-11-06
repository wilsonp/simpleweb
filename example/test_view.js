var fk = require('../index.js'),
	App = fk.App,
	app = new App,
	view = fk.view;

app.use(view(__dirname + '/view'));
app.get('/',function(req,res){
	res.view('index.html',{title:'test view',name:'wilson'});
});

app.get('/about',function(req,res){
	var info = [
          ["Name","wilson"],
          ["Tel","213442322"],
          ["Card","322232"]
       ]
	res.view('about.html',{title:'test view about',info:info});
});

app.listen(8000);
console.log('server started ...');