var fk = require('../index.js'),
	App = fk.App,
	app = new App,
	download = fk.download;

app.use(download);
app.get('/post',function(req,res){
	var bf = new Buffer('nihao');
	res.download('wilson.txt',bf);
});
app.listen(8000);
console.log('server started listened on 8000...');