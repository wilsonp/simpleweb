var fk = require('../../index.js'),
    App = fk.App,
    app = new App,
    static_middle = fk.static,
    post = fk.post,
    fs = require('fs');
    
app.use(static_middle(__dirname + '/public'));

app.use(post);

app.post('/post',function(req,res){
        console.log(req.body.xxx);
        fs.writeFile(__dirname+"/public/file.txt",req.files.file1,function(){
            res.write("ok!");
            res.write('title:' + req.body.title);
            res.write('content:' + req.body.content);
            res.end();
        })
});

app.listen(8000);
console.log('server started listend on 8000');