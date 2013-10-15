var App = require('../../index.js').App;
var app = new App();
var static_middle  = require('../../index.js').static;

app.use(static_middle(__dirname + '/public'));

app.get(function(req,res){
   res.write('i am get method');
   res.end();  
});

app.post(function(req,res){
  res.write('i am post method');
  res.end();
})

app.listen(8000);
console.log('server started listend on 8000'); 
