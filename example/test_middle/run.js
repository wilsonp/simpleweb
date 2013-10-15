var App = require('../../index.js').App;
var app = new App();

app.use(require('./middle01.js'));
app.use(require('./middle02.js'));

app.listen(8000);