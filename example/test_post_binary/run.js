var fk = require('../../index.js'),
    App = fk.App,
    app = new App(),
    static_middle = fk.static,
    postbin = fk.postbin,
    fs = require('fs');

app.use(static_middle(__dirname + '/public'));
app.use(postbin);

app.post('/post',function(req,res){
	fs.writeFileSync(req.body.filename,req.files.img);
	//console.log(req.body.filename);
	res.write('upload ok');
	res.end();
});


app.listen(8000);
console.log('server started listen on 8000...');