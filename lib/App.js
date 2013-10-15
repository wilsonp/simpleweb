var http = require('http');

function App(){
  var middleWareList = this._middleWareList = [];
  
  function handle(req,res){
     if(middleWareList.length === 0){
      //
     } else{
       var middleIndex = 0;
       execMiddle();
       
       function next(){
         middleIndex += 1;
         execMiddle(); 
       }
       
       function execMiddle(){
          var middle = middleWareList[middleIndex];
          if(middle){
             middle(req,res,next);
          }
       }
    }
  }
  
  this._server = http.createServer(handle);
}

App.prototype.use = function(middleWare){
  this._middleWareList.push(middleWare);
}
App.prototype.listen = function(){
  this._server.listen.apply(this._server,arguments);
}

module.exports = App;

