var App = require('../../index.js').App,
    app = new App(),
    static_middle = require('../../index.js').static;

app.use(static_middle(__dirname + '/public'));
    
app.get('/about',function(req,res){
  res.write('url:' + req.url + '\n');
  res.write('route to /about');
  res.end();
});
app.get('/concat',function(req,res){
  res.write('url:' + req.url + '\n');
  res.write('route to /concat');
  res.end();
});

app.listen(8000);
console.log('server started on port 8000');