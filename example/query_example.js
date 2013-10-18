var App = require('../index.js').App,
    app = new App(),
    query = require('../index.js').query;
    
app.use(query);

app.get('/about',function(req,res){
  res.write('my name is ' + req.query.name);
  res.end();
});

app.listen(8000);
console.log('server started listened on 8000');    