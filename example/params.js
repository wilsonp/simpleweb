var App = require('../index.js').App,
    app = new App(),
    query = require('../index.js').query;
    
app.use(query);

app.get('/about/:name/:age',function(req,res){
  res.write('my name is ' + req.params.name + '\n');
  res.write('my age is ' + req.params.age);
  res.end();
});

app.listen(8000);
console.log('server started listened on 8000');    