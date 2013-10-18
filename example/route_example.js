var App = require('../index.js').App,
    app = new App();
    
app.get('/about',function(req,res){
   res.write('my name is wilson');
   res.end();
});

app.get('/contact/:id/*/ok',function(req,res){
   res.write('my qq is 475726357');
   res.end();
});

app.listen(8000);
console.log('server started listend on 8000...');